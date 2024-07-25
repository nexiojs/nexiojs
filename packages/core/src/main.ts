import {
  type ApplicationOptions,
  type IApplication,
  type IContext,
} from "@nexiojs/common";
import { Application } from "./core/application.ts";
import { getContainer } from "./dependency-injection/service.ts";

export const createApplication = async <T = IApplication<IContext>>(
  options: ApplicationOptions
): Promise<T> => {
  const Adapter = options.adapter;

  const application = new Application().init();

  const interceptors = (options.interceptors ?? []).map((Interceptor) =>
    getContainer().get(Interceptor)
  );

  await Adapter.createServer({
    ...options,
    application,
    interceptors,
  });

  return application as T;
};
