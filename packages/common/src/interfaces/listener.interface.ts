export type Listener<T = any> = (eventData?: T) => unknown | Promise<unknown>;
