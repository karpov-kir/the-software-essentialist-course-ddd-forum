import { PasswordUtils } from './PasswordUtils.mjs';

const plainPassword = 'Test';
const anotherPlainPassword = 'Test 2';

describe(PasswordUtils.name, () => {
  it('should hash password', async () => {
    await expect(PasswordUtils.hashPassword(plainPassword)).resolves.not.toEqual(plainPassword);
  });

  it(`should compare "${plainPassword}" with its hashed version`, async () => {
    await expect(
      PasswordUtils.comparePassword({
        plainPassword,
        hashedPassword: await PasswordUtils.hashPassword(plainPassword),
      }),
    ).resolves.toEqual(true);
  });

  it(`should compare "${anotherPlainPassword}" with "${plainPassword}" hashed version`, async () => {
    await expect(
      PasswordUtils.comparePassword({
        plainPassword: anotherPlainPassword,
        hashedPassword: await PasswordUtils.hashPassword(plainPassword),
      }),
    ).resolves.toEqual(false);
  });
});
