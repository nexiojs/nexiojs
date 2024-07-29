import type { ExecutionContext } from '@cloudflare/workers-types';
import { ApplicationOptions, IContext } from '@nexiojs/common';
import { Context, Controller, createApplication, Get, Injectable } from '@nexiojs/core';
import { CloudflareAdapter } from '@nexiojs/serverless';

const adapter = new CloudflareAdapter();

@Injectable()
class Service {
	constructor() {}
}

@Controller('/health')
class HealthController {
	constructor(private readonly service: Service) {}

	@Get('/')
	health(@Context() ctx: IContext) {
		console.log(ctx.cloudflare);
		return 'OK';
	}
}

const options: ApplicationOptions = {
	adapter,
};

await createApplication(options);

export default {
	async fetch(request: Request, env: unknown, ctx: ExecutionContext) {
		const { pathname } = new URL(request.url);
		if (pathname === '/favicon.ico') return new Response();

		const res: Response = await adapter.handler(request, env, ctx);

		return res;
	},
} satisfies ExportedHandler<Env>;
