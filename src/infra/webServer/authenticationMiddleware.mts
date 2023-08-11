import { preHandlerAsyncHookHandler } from 'fastify';

import { UnauthorizedError } from '../../shared/errors/UnauthorizedError.mjs';
import { AccessTokenUtils } from '../../utils/AccessTokenUtils.mjs';

export const authenticationMiddleware: preHandlerAsyncHookHandler = async (request) => {
  const { authorization } = request.headers;
  const parts = authorization?.split(' ');

  if (!parts || parts.length !== 2) {
    throw new UnauthorizedError('Missing authorization header or invalid format');
  }

  const [scheme, accessToken] = parts;

  if (scheme !== 'Bearer') {
    throw new UnauthorizedError('Invalid authorization header schema');
  }

  try {
    const { email } = await AccessTokenUtils.verifyAndDecodeAccessToken(accessToken);
    request.currentUserEmail = email;
  } catch (error) {
    throw new UnauthorizedError(`Invalid access token`);
  }
};
