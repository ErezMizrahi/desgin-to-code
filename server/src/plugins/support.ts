import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin'

export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
const supportPlugin = async (fastify: FastifyInstance, opts: SupportPluginOptions) => {
  fastify.decorate('someSupport', function () {
    return 'hugs'
  })
}

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    someSupport(): string;
  }
}

export default fastifyPlugin<SupportPluginOptions>(supportPlugin);