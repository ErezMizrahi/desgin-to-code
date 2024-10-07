import fastifyPlugin from 'fastify-plugin'
import sensible, { FastifySensibleOptions } from '@fastify/sensible'
import { FastifyInstance } from 'fastify'

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
const sensiblePlugin = async (fastify: FastifyInstance) => {
  fastify.register(sensible)
}

export default fastifyPlugin<FastifySensibleOptions>(sensiblePlugin);
