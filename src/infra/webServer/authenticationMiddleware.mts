import { preHandlerAsyncHookHandler } from 'fastify';

import { AccessTokenUtils } from '../../modules/user/utils/AccessTokenUtils.mjs';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError.mjs';

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
    const { id, email } = await AccessTokenUtils.verifyAndDecodeAccessToken(accessToken);
    request.currentUserId = id;
    request.currentUserEmail = email;
  } catch (error) {
    throw new UnauthorizedError(`Invalid access token`);
  }
};
