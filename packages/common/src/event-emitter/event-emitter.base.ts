import type { Listener } from "../interfaces";

export abstract class IEventEmitter<T = any> {
  protected events: Record<string, Listener<T>[]> = {};

  constructor() {}

  on(event: string, listener: Listener<T>) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  off(event: string, listener: Listener<T>) {
    if (this.events[event]) {
      this.events[event] = this.events[event]!.filter((l) => l !== listener);
    }
  }

  once(event: string, listener: Listener<T>) {
    const remove = (eventData: T) => {
      this.off(event, remove as unknown as any);
      listener(eventData);
    };
    this.on(event, remove as unknown as any);
  }

  emit(event: string, eventData?: T) {
    this.events[event]?.forEach((listener) => listener(eventData));
  }
}
