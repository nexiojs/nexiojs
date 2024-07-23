import {
  DecoratorKind,
  HEADER_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
} from "@nexiojs/common";
import { createParamDecorator } from "./create-param-metadata.decorator.ts";

const createMappingDecorator =
  (method: string) =>
  (path: string): MethodDecorator => {
    return (target, key, descriptor) => {
      Reflect.defineMetadata(PATH_METADATA, path, descriptor.value as any);
      Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value as any);
    };
  };

export const Headers = (name: string): ParameterDecorator => {
  return createParamDecorator(
    (ctx) => {
      return ctx.req.headers.get(name);
    },
    {
      kind: DecoratorKind.Headers,
    }
  );
};

export const Body = (): ParameterDecorator => {
  return createParamDecorator(
    (ctx) => {
      return ctx.req.body;
    },
    {
      kind: DecoratorKind.Body,
    }
  );
};

export const Header = (name: string, value: string): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    const headers =
      Reflect.getMetadata(HEADER_METADATA, descriptor.value as any) ?? {};

    Reflect.defineMetadata(
      HEADER_METADATA,
      { ...headers, [name]: value },
      descriptor.value as any
    );
  };
};

export const SearchParams = (key?: string): ParameterDecorator => {
  return createParamDecorator(
    (ctx) => {
      return key ? ctx.req.searchParams?.get(key) : ctx.req.searchParams;
    },
    {
      kind: DecoratorKind.SearchParams,
    }
  );
};

export const Get = createMappingDecorator("GET");
export const Post = createMappingDecorator("POST");
export const Put = createMappingDecorator("PUT");
export const Patch = createMappingDecorator("PATCH");
export const Delete = createMappingDecorator("DELETE");
export const Head = createMappingDecorator("HEAD");
export const Options = createMappingDecorator("OPTIONS");
