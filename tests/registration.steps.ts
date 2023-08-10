import { defineFeature, loadFeature } from 'jest-cucumber';
import path from 'path';

import { CompositionRoot } from '../src/CompositionRoot.mjs';
import { UserDto } from '../src/shared/dto/UserDto.mjs';
import { ApiClient } from '../src/shared/http/ApiClient.mjs';
import { HttpDriverResponse } from '../src/shared/http/HttpDriver.mjs';
import { toUserDto, User } from '../src/shared/models/User.mjs';
import { FakeEmailService } from './FakeEmailService.mjs';
import { UserObjectMother } from './UserObjectMother.mjs';

const feature = loadFeature(path.resolve(__dirname, './registration.feature'));

const fakeEmailService = new FakeEmailService();
const webServer = new CompositionRoot({ emailService: fakeEmailService }).getWebServer();
const apiClient = new ApiClient('http://localhost:3000');

defineFeature(feature, (test) => {
  beforeAll(async () => {
    await webServer.start();
  });

  afterAll(async () => {
    await webServer.stop();
  });

  test('Successful registration', ({ given, when, then, and }) => {
    let newUser: User;
    let signUpResponse: HttpDriverResponse<UserDto>;

    given('I am a new user', () => {
      newUser = UserObjectMother.defaultUser();
    });

    when('I register with valid account details', async () => {
      signUpResponse = await apiClient.signUp(UserObjectMother.toSignUpDto({ user: newUser }));
    });

    then('I should be granted access to my account', async () => {
      await apiClient.signIn(UserObjectMother.toSignInDto({ user: newUser }), {
        useAccessTokenForFutureRequests: true,
      });

      const profileResponse = await apiClient.getProfile();

      expect(signUpResponse.status).toBe(200);
      expect(signUpResponse.data).toBe(toUserDto(newUser));
      expect(profileResponse.status).toBe(200);
      expect(profileResponse.data).toEqual(toUserDto(newUser));
    });

    and('I should receive an email with login instructions', () => {
      expect(fakeEmailService.sendEmail).toBeCalledWith(newUser.email, expect.any(String));
    });
  });
});
