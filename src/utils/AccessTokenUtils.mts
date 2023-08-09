import jwt from 'jsonwebtoken';

const SECRET = 'shhhhh';

export class AccessTokenUtils {
  public static createAccessToken(
    payload: object = {},
    { expiresIn = '6h' }: { expiresIn?: number | string } = {},
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      return jwt.sign(payload, SECRET, { expiresIn }, (error, encoded) => {
        if (error) {
          return reject(error);
        }

        return resolve(encoded!);
      });
    });
  }

  public static verifyAccessToken(accessToken: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      jwt.verify(accessToken, SECRET, (error, _decoded) => {
        if (error) {
          return reject(error);
        }

        resolve(true);
      });
    });
  }
}
