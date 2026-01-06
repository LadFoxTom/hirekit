// @ts-nocheck
import puppeteer, { Browser, Page } from 'puppeteer';

interface BrowserPoolConfig {
  maxOpenPages: number;
  maxBrowserInstances: number;
  retireInstanceAfterRequestCount: number;
  browserLaunchOptions?: puppeteer.LaunchOptions;
}

interface BrowserInstance {
  browser: Browser;
  activePages: number;
  requestCount: number;
  createdAt: Date;
}

class BrowserPool {
  private instances: BrowserInstance[] = [];
  private queue: Array<{
    resolve: (page: Page) => void;
    reject: (error: Error) => void;
    timestamp: number;
  }> = [];
  private config: BrowserPoolConfig;

  constructor(config: BrowserPoolConfig) {
    this.config = {
      browserLaunchOptions: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--disable-print-preview',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--memory-pressure-off',
          '--max_old_space_size=4096'
        ],
      },
      ...config
    };
  }

  async getPage(): Promise<Page> {
    // Try to get an existing instance with available capacity
    for (const instance of this.instances) {
      if (instance.activePages < this.config.maxOpenPages) {
        instance.activePages++;
        instance.requestCount++;
        
        // Retire instance if it has served too many requests
        if (instance.requestCount >= this.config.retireInstanceAfterRequestCount) {
          this.retireInstance(instance);
        }
        
        const page = await instance.browser.newPage();
        return page;
      }
    }

    // Create new instance if under limit
    if (this.instances.length < this.config.maxBrowserInstances) {
      const browser = await puppeteer.launch(this.config.browserLaunchOptions);
      const instance: BrowserInstance = {
        browser,
        activePages: 1,
        requestCount: 1,
        createdAt: new Date()
      };
      
      this.instances.push(instance);
      const page = await browser.newPage();
      return page;
    }

    // Queue request if all instances are at capacity
    return new Promise((resolve, reject) => {
      this.queue.push({
        resolve,
        reject,
        timestamp: Date.now()
      });
    });
  }

  async releasePage(page: Page): Promise<void> {
    try {
      await page.close();
      
      // Find the instance that owns this page
      for (const instance of this.instances) {
        if (instance.activePages > 0) {
          instance.activePages--;
          
          // Process queued requests
          if (this.queue.length > 0 && instance.activePages < this.config.maxOpenPages) {
            const queuedRequest = this.queue.shift();
            if (queuedRequest) {
              instance.activePages++;
              instance.requestCount++;
              const newPage = await instance.browser.newPage();
              queuedRequest.resolve(newPage);
            }
          }
          break;
        }
      }
    } catch (error) {
      console.error('Error releasing page:', error);
    }
  }

  private async retireInstance(instance: BrowserInstance): Promise<void> {
    try {
      await instance.browser.close();
      const index = this.instances.indexOf(instance);
      if (index > -1) {
        this.instances.splice(index, 1);
      }
    } catch (error) {
      console.error('Error retiring browser instance:', error);
    }
  }

  async cleanup(): Promise<void> {
    const cleanupPromises = this.instances.map(instance => 
      instance.browser.close().catch(console.error)
    );
    
    await Promise.all(cleanupPromises);
    this.instances = [];
    
    // Reject all queued requests
    this.queue.forEach(request => {
      request.reject(new Error('Browser pool cleanup'));
    });
    this.queue = [];
  }

  getStats() {
    return {
      activeInstances: this.instances.length,
      totalActivePages: this.instances.reduce((sum, instance) => sum + instance.activePages, 0),
      queuedRequests: this.queue.length,
      totalRequests: this.instances.reduce((sum, instance) => sum + instance.requestCount, 0)
    };
  }
}

// Global browser pool instance
const browserPool = new BrowserPool({
  maxOpenPages: 10,
  maxBrowserInstances: 3,
  retireInstanceAfterRequestCount: 100
});

// Cleanup on process exit
process.on('SIGINT', async () => {
  console.log('Cleaning up browser pool...');
  await browserPool.cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Cleaning up browser pool...');
  await browserPool.cleanup();
  process.exit(0);
});

export { browserPool, BrowserPool };
export type { BrowserPoolConfig, BrowserInstance };
