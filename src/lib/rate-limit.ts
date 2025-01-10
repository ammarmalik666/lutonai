import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

interface RateLimitConfig {
    requests: number
    duration: `${number}s` | `${number}m` | `${number}h`
    prefix: string
}

const defaultConfig: RateLimitConfig = {
    requests: 5,
    duration: "30s",
    prefix: "@upstash/ratelimit",
}

class RateLimiter {
    private limiter: Ratelimit
    private redis: Redis
    private prefix: string

    constructor(config: Partial<Omit<RateLimitConfig, 'prefix'>> & Pick<RateLimitConfig, 'prefix'> = defaultConfig) {
        const { requests, duration, prefix } = { ...defaultConfig, ...config }
        this.prefix = prefix

        // Initialize Redis client
        this.redis = Redis.fromEnv()

        // Create rate limiter
        this.limiter = new Ratelimit({
            redis: this.redis,
            limiter: Ratelimit.slidingWindow(requests, duration),
            analytics: true,
            prefix: prefix,
        })
    }

    async check(identifier: string) {
        try {
            const result = await this.limiter.limit(identifier)
            return {
                success: result.success,
                limit: result.limit,
                remaining: result.remaining,
                reset: result.reset,
            }
        } catch (error) {
            console.error("Rate limit check failed:", error)
            // Default to allowing the request if rate limiting fails
            return {
                success: true,
                limit: 0,
                remaining: 0,
                reset: Date.now(),
            }
        }
    }

    async blockUntilReset(identifier: string): Promise<void> {
        const result = await this.check(identifier)
        if (!result.success) {
            const waitTime = result.reset - Date.now()
            if (waitTime > 0) {
                await new Promise(resolve => setTimeout(resolve, waitTime))
            }
        }
    }

    async getRemainingRequests(identifier: string): Promise<number> {
        const result = await this.check(identifier)
        return result.remaining
    }

    async reset(identifier: string): Promise<void> {
        try {
            await this.redis.del(`${this.prefix}:${identifier}`)
        } catch (error) {
            console.error("Failed to reset rate limit:", error)
        }
    }
}

// Create default instance
export const rateLimit = new RateLimiter()

// Export class for custom instances
export { RateLimiter, type RateLimitConfig } 