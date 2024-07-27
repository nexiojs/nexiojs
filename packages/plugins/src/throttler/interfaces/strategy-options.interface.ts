export interface FixedWindowOptions {
  limit: number;
  ttl: number;
}

export interface SlidingWindowOptions {
  limit: number;
  ttl: number;
}

export interface TokenBucketOptions {
  limit: number;
  refillRate: number;
}
