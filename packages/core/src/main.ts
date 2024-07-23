import {
  Adapter as BaseAdapter,
  Kind,
  type ApplicationOptions,
  type IApplication,
  type IContext,
} from "@nexiojs/common";
import { Application } from "./core/application.ts";
import { getContainer } from "./dependency-injection/service.ts";

export const createApplication = (
  options: ApplicationOptions
): IApplication<IContext> => {
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

  (Adapter as BaseAdapter).createServer({
    ...options,
    application,
    interceptors,
  });

  return application;
};
