export interface Storage {
  get(key: string): Promise<number | null>;
  set(key: string, value: number, ttl?: number): Promise<void>;
}
