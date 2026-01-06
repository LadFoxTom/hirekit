import toast from 'react-hot-toast'

// Error types for better categorization
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  RATE_LIMIT = 'RATE_LIMIT',
  AI_SERVICE = 'AI_SERVICE',
  FILE_UPLOAD = 'FILE_UPLOAD',
  EXPORT = 'EXPORT',
  DATABASE = 'DATABASE',
  UNKNOWN = 'UNKNOWN'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Error interface
export interface AppError {
  type: ErrorType
  severity: ErrorSeverity
  message: string
  code?: string
  details?: any
  timestamp: Date
  userId?: string
  sessionId?: string
  userAgent?: string
  url?: string
}

// Error tracking service (can be replaced with Sentry, LogRocket, etc.)
class ErrorTracker {
  private errors: AppError[] = []
  private maxErrors = 100

  track(error: Omit<AppError, 'timestamp'>) {
    const fullError: AppError = {
      ...error,
      timestamp: new Date(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    }

    this.errors.push(fullError)
    
    // Keep only the latest errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracked:', fullError)
    }

    // Send to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(fullError)
    }
  }

  private async sendToExternalService(error: AppError) {
    try {
      // Replace with your preferred error tracking service
      await fetch('/api/error-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error),
      })
    } catch (e) {
      console.error('Failed to send error to tracking service:', e)
    }
  }

  getErrors() {
    return this.errors
  }

  clearErrors() {
    this.errors = []
  }
}

export const errorTracker = new ErrorTracker()

// Error handling utilities
export const handleError = (
  error: any,
  type: ErrorType = ErrorType.UNKNOWN,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM,
  showToast: boolean = true
) => {
  const message = error?.message || 'An unexpected error occurred'
  
  // Track the error
  errorTracker.track({
    type,
    severity,
    message,
    code: error?.code,
    details: error,
  })

  // Show user-friendly message
  if (showToast) {
    const toastMessage = getUserFriendlyMessage(type, message)
    const toastOptions = getToastOptions(severity)
    
    toast(toastMessage, toastOptions)
  }

  return { type, severity, message }
}

// Get user-friendly error messages
const getUserFriendlyMessage = (type: ErrorType, originalMessage: string): string => {
  switch (type) {
    case ErrorType.VALIDATION:
      return 'Please check your input and try again.'
    case ErrorType.NETWORK:
      return 'Connection error. Please check your internet and try again.'
    case ErrorType.AUTHENTICATION:
      return 'Please log in to continue.'
    case ErrorType.AUTHORIZATION:
      return 'You don\'t have permission to perform this action.'
    case ErrorType.RATE_LIMIT:
      return 'Too many requests. Please wait a moment and try again.'
    case ErrorType.AI_SERVICE:
      return 'AI service is temporarily unavailable. Please try again later.'
    case ErrorType.FILE_UPLOAD:
      return 'File upload failed. Please check the file and try again.'
    case ErrorType.EXPORT:
      return 'Export failed. Please try again or contact support.'
    case ErrorType.DATABASE:
      return 'Service temporarily unavailable. Please try again later.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

// Get toast options based on severity
const getToastOptions = (severity: ErrorSeverity) => {
  switch (severity) {
    case ErrorSeverity.LOW:
      return { duration: 3000, icon: 'ℹ️' }
    case ErrorSeverity.MEDIUM:
      return { duration: 4000, icon: '⚠️' }
    case ErrorSeverity.HIGH:
      return { duration: 6000, icon: '🚨' }
    case ErrorSeverity.CRITICAL:
      return { duration: 8000, icon: '💥' }
    default:
      return { duration: 4000 }
  }
}

// API error handler
export const handleApiError = async (response: Response, showToast: boolean = true) => {
  if (response.ok) return null

  let errorData
  try {
    errorData = await response.json()
  } catch {
    errorData = { message: 'Network error' }
  }

  const status = response.status
  let type = ErrorType.UNKNOWN
  let severity = ErrorSeverity.MEDIUM

  switch (status) {
    case 400:
      type = ErrorType.VALIDATION
      severity = ErrorSeverity.LOW
      break
    case 401:
      type = ErrorType.AUTHENTICATION
      severity = ErrorSeverity.MEDIUM
      break
    case 403:
      type = ErrorType.AUTHORIZATION
      severity = ErrorSeverity.MEDIUM
      break
    case 429:
      type = ErrorType.RATE_LIMIT
      severity = ErrorSeverity.MEDIUM
      break
    case 500:
      type = ErrorType.DATABASE
      severity = ErrorSeverity.HIGH
      break
    default:
      type = ErrorType.NETWORK
      severity = ErrorSeverity.MEDIUM
  }

  return handleError(
    { message: errorData.message || `HTTP ${status}`, code: status.toString() },
    type,
    severity,
    showToast
  )
}

// Async error wrapper
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  errorType: ErrorType = ErrorType.UNKNOWN,
  showToast: boolean = true
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args)
    } catch (error) {
      handleError(error, errorType, ErrorSeverity.MEDIUM, showToast)
      return null
    }
  }
}

// React error boundary hook
export const useErrorHandler = () => {
  const handleError = (error: any, context?: string) => {
    errorTracker.track({
      type: ErrorType.UNKNOWN,
      severity: ErrorSeverity.MEDIUM,
      message: error?.message || 'React error',
      details: { context, error },
    })
  }

  return { handleError }
}

// Performance monitoring
export const measurePerformance = <T extends any[], R>(
  name: string,
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    const start = performance.now()
    try {
      const result = await fn(...args)
      const duration = performance.now() - start
      
      // Track performance
      if (duration > 1000) { // Log slow operations
        console.warn(`Slow operation: ${name} took ${duration.toFixed(2)}ms`)
      }
      
      return result
    } catch (error) {
      const duration = performance.now() - start
      console.error(`Operation failed: ${name} after ${duration.toFixed(2)}ms`, error)
      throw error
    }
  }
} 