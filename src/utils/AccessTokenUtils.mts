import jwt from 'jsonwebtoken';
import z from 'zod';

import { AccessTokenPayloadDto } from '../modules/user/dto/UserDto.mjs';
import { User } from '../modules/user/models/User.mjs';

const SECRET = 'shhhhh';

const accessTokenPayloadSchema = z.object({
  id: z.number(),
  email: z.string().email(),
});

export class AccessTokenUtils {
  public static createAccessToken(
    user: User,
    { expiresIn = '6h' }: { expiresIn?: number | string } = {},
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      return jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        SECRET,
        { expiresIn },
        (error, encoded) => {
          if (error) {
            return reject(error);
          }

          return resolve(encoded!);
        },
      );
    });
  }

  public static verifyAndDecodeAccessToken(accessToken: string): Promise<AccessTokenPayloadDto> {
    return new Promise((resolve, reject) => {
      jwt.verify(accessToken, SECRET, (error, decoded) => {
        if (error) {
          return reject(error);
        }

        try {
          resolve(accessTokenPayloadSchema.parse(decoded));
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}
