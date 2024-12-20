/**
 * TODO: Implement Redis-based rate limiting for better persistence and scalability
 * - Replace in-memory Map with Redis
 * - Add distributed locking for concurrent requests
 * - Add proper cleanup mechanism
 * - Consider implementing sliding window rate limiting
 * - Add rate limit headers to responses
 * @see GitHub Issue: https://github.com/fahrulalwan/ganjil-genap/issues/1
 */

// Rate limiting configuration
export const RATE_LIMIT = {
  MAX_REQUESTS: 100, // Maximum requests per window
  WINDOW_MS: 60 * 1000, // 1 minute window
  BLOCK_DURATION_MS: 5 * 60 * 1000, // 5 minutes block
} as const;

// In-memory store for rate limiting
// Note: This will reset when the serverless function is recycled
const ipRequests = new Map<
  string,
  { count: number; timestamp: number; blocked?: boolean }
>();

function getRateLimitInfo(ip: string) {
  const now = Date.now();
  const requestInfo = ipRequests.get(ip);

  // Clean up old entries
  if (requestInfo && now - requestInfo.timestamp > RATE_LIMIT.WINDOW_MS) {
    ipRequests.delete(ip);
    return { count: 0, timestamp: now };
  }

  return requestInfo || { count: 0, timestamp: now };
}

export function isRateLimited(ip: string, maxRequests: number = RATE_LIMIT.MAX_REQUESTS): boolean {
  const now = Date.now();
  const requestInfo = getRateLimitInfo(ip);

  // Check if IP is blocked
  if (requestInfo.blocked) {
    if (now - requestInfo.timestamp > RATE_LIMIT.BLOCK_DURATION_MS) {
      // Unblock if block duration has passed
      ipRequests.delete(ip);
      return false;
    }
    return true;
  }

  // Update request count
  const newCount = requestInfo.count + 1;
  ipRequests.set(ip, {
    count: newCount,
    timestamp: now,
    blocked: newCount > maxRequests,
  });

  return newCount > maxRequests;
} 
