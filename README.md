# NexioJS 🐇

NexioJS is a framework for building scalable and fast web applications with Bun and Node.js. It provides a powerful set of features that make it easy to build REST and GraphQL APIs, as well as front-end applications.

## Features

- **Dependency Injection:** NexioJS comes with a built-in dependency injection system that makes it easy to manage and test your code.
- **Built-in support for Bun and Node.js:** NexioJS supports both Bun and Node.js, so you can choose the platform that best suits your needs.
- **Powerful routing system:** NexioJS's routing system is based on path-to-regexp, which makes it easy to define routes and handle requests.
- **Flexible middleware and interceptor system:** NexioJS's middleware and interceptor system allow you to add custom logic to your application, such as authentication, authorization, and logging.
- **Built-in support for GraphQL:** NexioJS comes with built-in support for GraphQL, making it easy to build APIs that expose your data in a flexible and efficient way.
- **Full TypeScript support:** NexioJS is fully written in TypeScript, so you can take advantage of all the benefits of static typing.

## Getting started

### Install

Install NexioJS using npm or yarn:

```bash
npm install @nexiojs/core @nexiojs/node-adapter 
```

### Create an application

Create a new file `index.ts` and add the following code:

```typescript
import { createApplication } from '@nexiojs/core';
import { NodeAdapter } from '@nexiojs/node-adapter';

createApplication({
  adapter: NodeAdapter,
  port: 3000,
});
```

### Run the application

Run the following command to start the application:

```bash
bun index.ts
```


## Example

See the examples folder for examples of how to use NexioJS to build different types of applications.

