import { FastifyReply, FastifyRequest } from 'fastify';

export interface Controller {
  handle: (request: FastifyRequest<any>, reply: FastifyReply) => Promise<unknown>;
}
