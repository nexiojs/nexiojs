import type { IApplication } from ".";

export type IContext<Body = any> = {
  application: IApplication<IContext>;
  req: {
    body: any;
    params?: Record<string, unknown>;
    search?: string;
    searchParams?: URLSearchParams;
    ip: string;
  } & Pick<Request, "headers" | "signal" | "method">;
  event: string;
  res: { body: Body; headers: Headers; status: number };
} & Record<string | symbol, any>;
