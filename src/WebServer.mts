import Fastify, {
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RouteGenericInterface,
  RouteHandlerMethod,
} from 'fastify';

export class WebServer {
  #isListening = false;

  public isListening() {
    return this.#isListening;
  }

  private fastify = Fastify({
    logger: true,
  });

  public async start() {
    const address = await this.fastify.listen({ port: 3000 });
    this.#isListening = true;
    console.log(`Server is listening on ${address}`);
  }

  public async stop(): Promise<void> {
    await this.fastify.close();
    this.#isListening = false;
  }

  public addGetRoute<RouteGeneric extends RouteGenericInterface = RouteGenericInterface>(
    path: string,
    handler: RouteHandlerMethod<RawServerBase, RawRequestDefaultExpression, RawReplyDefaultExpression, RouteGeneric>,
  ) {
    this.fastify.get<RouteGeneric>(path, handler);
  }

  public addPostRoute<RouteGeneric extends RouteGenericInterface = RouteGenericInterface>(
    path: string,
    handler: RouteHandlerMethod<RawServerBase, RawRequestDefaultExpression, RawReplyDefaultExpression, RouteGeneric>,
  ) {
    this.fastify.post<RouteGeneric>(path, handler);
  }

  public addPutRoute<RouteGeneric extends RouteGenericInterface = RouteGenericInterface>(
    path: string,
    handler: RouteHandlerMethod<RawServerBase, RawRequestDefaultExpression, RawReplyDefaultExpression, RouteGeneric>,
  ) {
    this.fastify.put<RouteGeneric>(path, handler);
  }
}
