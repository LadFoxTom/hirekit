// @ts-nocheck
import { browserPool } from './browser-pool';
import { CVData } from '@/types/cv';

interface PDFGenerationJob {
  id: string;
  cvData: CVData;
  fileName: string;
  priority: 'high' | 'normal' | 'low';
  userId?: string;
  timestamp: number;
  retries: number;
  maxRetries: number;
}

interface PDFGenerationResult {
  success: boolean;
  buffer?: Buffer;
  error?: string;
  processingTime: number;
}

class PDFQueue {
  private queue: PDFGenerationJob[] = [];
  private processing = new Set<string>();
  private results = new Map<string, PDFGenerationResult>();
  private maxConcurrent = 3;
  private currentlyProcessing = 0;

  async addJob(
    cvData: CVData,
    fileName: string,
    options: {
      priority?: 'high' | 'normal' | 'low';
      userId?: string;
      maxRetries?: number;
    } = {}
  ): Promise<string> {
    const jobId = `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const job: PDFGenerationJob = {
      id: jobId,
      cvData,
      fileName,
      priority: options.priority || 'normal',
      userId: options.userId,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: options.maxRetries || 3
    };

    // Insert job based on priority
    const insertIndex = this.findInsertIndex(job);
    this.queue.splice(insertIndex, 0, job);

    // Start processing if not already running
    this.processQueue();

    return jobId;
  }

  async getResult(jobId: string): Promise<PDFGenerationResult | null> {
    return this.results.get(jobId) || null;
  }

  async waitForResult(jobId: string, timeout = 30000): Promise<PDFGenerationResult> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const result = this.results.get(jobId);
      if (result) {
        return result;
      }
      
      // Check if job is still in queue or processing
      const inQueue = this.queue.some(job => job.id === jobId);
      const isProcessing = this.processing.has(jobId);
      
      if (!inQueue && !isProcessing) {
        throw new Error('Job not found or failed');
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error('Timeout waiting for PDF generation');
  }

  private findInsertIndex(job: PDFGenerationJob): number {
    const priorityOrder = { high: 3, normal: 2, low: 1 };
    const jobPriority = priorityOrder[job.priority];
    
    for (let i = 0; i < this.queue.length; i++) {
      const existingPriority = priorityOrder[this.queue[i].priority];
      if (jobPriority > existingPriority) {
        return i;
      }
    }
    
    return this.queue.length;
  }

  private async processQueue(): Promise<void> {
    if (this.currentlyProcessing >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const job = this.queue.shift();
    if (!job) return;

    this.processing.add(job.id);
    this.currentlyProcessing++;

    try {
      const result = await this.generatePDF(job);
      this.results.set(job.id, result);
    } catch (error) {
      console.error(`PDF generation failed for job ${job.id}:`, error);
      
      if (job.retries < job.maxRetries) {
        job.retries++;
        // Re-queue with lower priority
        job.priority = 'low';
        this.queue.push(job);
      } else {
        this.results.set(job.id, {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          processingTime: Date.now() - job.timestamp
        });
      }
    } finally {
      this.processing.delete(job.id);
      this.currentlyProcessing--;
      
      // Continue processing queue
      setTimeout(() => this.processQueue(), 0);
    }
  }

  private async generatePDF(job: PDFGenerationJob): Promise<PDFGenerationResult> {
    const startTime = Date.now();
    let page: any = null;

    try {
      page = await browserPool.getPage();
      
      // Set viewport to match A4 dimensions at 96 DPI
      await page.setViewport({ width: 794, height: 1123 });
      
      // Emulate print media type
      await page.emulateMediaType('print');

      // Create the URL for the print-cv page with CV data
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const encodedData = encodeURIComponent(JSON.stringify(job.cvData));
      const printUrl = `${baseUrl}/print-cv?data=${encodedData}`;

      // Navigate to the print page
      await page.goto(printUrl, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // Wait for fonts to be ready
      await page.evaluateHandle('document.fonts.ready');
      
      // Additional wait to ensure all styles are applied
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate PDF with proper settings
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '18mm',
          bottom: '18mm',
          left: '12mm',
          right: '12mm',
        },
        displayHeaderFooter: false,
        preferCSSPageSize: true,
        omitBackground: false,
        scale: 1,
        landscape: false,
        pageRanges: '',
        headerTemplate: '',
        footerTemplate: '',
      });

      return {
        success: true,
        buffer: Buffer.from(pdfBuffer),
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      throw error;
    } finally {
      if (page) {
        await browserPool.releasePage(page);
      }
    }
  }

  getQueueStats() {
    return {
      queueLength: this.queue.length,
      processing: this.processing.size,
      currentlyProcessing: this.currentlyProcessing,
      completed: this.results.size,
      queue: this.queue.map(job => ({
        id: job.id,
        priority: job.priority,
        timestamp: job.timestamp,
        retries: job.retries
      }))
    };
  }

  // Cleanup old results to prevent memory leaks
  cleanupOldResults(maxAge = 3600000): void { // 1 hour
    const cutoff = Date.now() - maxAge;
    for (const [jobId, result] of this.results.entries()) {
      if (result.processingTime < cutoff) {
        this.results.delete(jobId);
      }
    }
  }
}

// Global PDF queue instance
export const pdfQueue = new PDFQueue();

// Cleanup old results every 30 minutes
setInterval(() => {
  pdfQueue.cleanupOldResults();
}, 30 * 60 * 1000);

export type { PDFGenerationJob, PDFGenerationResult };
