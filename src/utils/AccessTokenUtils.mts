import jwt from 'jsonwebtoken';
import { AccessTokenPayloadDto } from 'src/UserDto.mjs';

const SECRET = 'shhhhh';

export class AccessTokenUtils {
  public static createAccessToken(
    accessTokenPayloadDto: AccessTokenPayloadDto,
    { expiresIn = '6h' }: { expiresIn?: number | string } = {},
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      return jwt.sign(accessTokenPayloadDto, SECRET, { expiresIn }, (error, encoded) => {
        if (error) {
          return reject(error);
        }

        return resolve(encoded!);
      });
    });
  }

  public static verifyAndDecodeAccessToken(accessToken: string): Promise<AccessTokenPayloadDto> {
    return new Promise((resolve, reject) => {
      jwt.verify(accessToken, SECRET, (error, decoded) => {
        if (error) {
          return reject(error);
        }

        if (!decoded || typeof decoded !== 'object' || !decoded.email) {
          return reject(new Error('Invalid access token'));
        }

        resolve({
          email: decoded.email,
        });
      });
    });
  }
}
