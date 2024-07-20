import {
  Adapter as BaseAdapter,
  Kind,
  type ApplicationOptions,
} from "@nexiojs/common";
import { Application } from "./core/application";
import { getContainer } from "./dependency-injection/service";

export const createApplication = (options: ApplicationOptions) => {
  let Adapter = options.adapter;

  // @ts-ignore
  if (options.adapter.kind !== Kind.Http) {
    Adapter = options.adapter;
  } else {
    // @ts-ignore
    Adapter = new options.adapter();
  }

  const application = new Application().init();

  const interceptors = (options.interceptors ?? []).map((Interceptor) =>
    getContainer().get(Interceptor)
  );

  return (Adapter as BaseAdapter).createServer({
    ...options,
    application,
    interceptors,
  });
};
