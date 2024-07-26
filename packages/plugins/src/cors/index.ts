import { IApplication, IContext, IInterceptor, IPlugin } from "@nexiojs/common";

type CORSOptions = {
  origin?: string[];
};

class CORSInterceptor implements IInterceptor {
  constructor(private readonly options: CORSOptions) {}

  pre(ctx: IContext<any>) {}

  post(ctx: IContext<any>) {
    const { origin = ["*"] } = this.options;
    ctx.res.headers.set("Access-Control-Allow-Origin", origin.join(","));
  }
}

export class CORSPlugin implements IPlugin {
  constructor(private readonly options: CORSOptions) {}

  apply(app: IApplication<IContext<any>>) {
    app.addInterceptor(new CORSInterceptor(this.options));
  }
}
