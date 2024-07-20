import type { Constructor } from "@nexiojs/common";

export interface CallOptions {
  when: (e: Error | any) => boolean;
  instance: Constructor;
  method: string;
}
