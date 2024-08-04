import type { IApplication } from ".";

export interface IContext<Body = any> {
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

  [key: string | symbol]: any;
}
