type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
    level: LogLevel
    message: string
    timestamp: string
    data?: any
    error?: Error
    request?: {
        method: string
        url: string
        headers?: Record<string, string>
        body?: any
    }
}

class Logger {
    private static instance: Logger
    private environment: string
    private shouldPrintToConsole: boolean

    private constructor() {
        this.environment = process.env.NODE_ENV || 'development'
        this.shouldPrintToConsole = this.environment === 'development'
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger()
        }
        return Logger.instance
    }

    private formatLogEntry(entry: LogEntry): string {
        const { level, message, timestamp, data, error, request } = entry
        return JSON.stringify({
            level,
            message,
            timestamp,
            environment: this.environment,
            ...(data && { data }),
            ...(error && {
                error: {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                },
            }),
            ...(request && { request }),
        })
    }

    private async persistLog(entry: LogEntry): Promise<void> {
        // In production, you would typically send this to a logging service
        // like CloudWatch, Datadog, or your own logging infrastructure
        if (this.environment === 'production') {
            // TODO: Implement production logging
            // For now, we'll just console.log in production as well
            console.log(this.formatLogEntry(entry))
            return
        }

        if (this.shouldPrintToConsole) {
            console.log(this.formatLogEntry(entry))
        }
    }

    private log(level: LogLevel, message: string, data?: any, error?: Error, request?: LogEntry['request']): void {
        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            ...(data && { data }),
            ...(error && { error }),
            ...(request && { request }),
        }

        this.persistLog(entry).catch(console.error)
    }

    public debug(message: string, data?: any): void {
        this.log('debug', message, data)
    }

    public info(message: string, data?: any): void {
        this.log('info', message, data)
    }

    public warn(message: string, data?: any, error?: Error): void {
        this.log('warn', message, data, error)
    }

    public error(message: string, error: Error, request?: LogEntry['request']): void {
        this.log('error', message, undefined, error, request)
    }

    public logApiRequest(req: Request, error?: Error): void {
        const request = {
            method: req.method,
            url: req.url,
            headers: Object.fromEntries(req.headers),
        }

        if (error) {
            this.error('API Request Error', error, request)
        } else {
            this.info('API Request', { request })
        }
    }
}

export const logger = Logger.getInstance() 