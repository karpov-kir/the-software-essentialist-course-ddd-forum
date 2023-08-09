import { defineFeature, loadFeature } from 'jest-cucumber';
import path from 'path';

import { ApiClient, HttpClientResponse } from '../src/ApiClient.mjs';
import { toUserDto, User } from '../src/User.mjs';
import { UserDto } from '../src/UserDto.mjs';
import { UserObjectMother } from '../src/UserObjectMother.mjs';
import { WebServer } from '../src/WebServer.mjs';

const feature = loadFeature(path.resolve(__dirname, './registration.feature'));

const fakeEmailService = new FakeEmailService();
const webServer = new WebServer();
const apiClient = new ApiClient('http://localhost:3000');

defineFeature(feature, (test) => {
  beforeAll(async () => {
    await webServer.start();
  });

  afterAll(async () => {
    await webServer.stop();
  });

  test('Successful registration', ({ given, when, then, and }) => {
    const newUserPassword = 'Test';
    let newUser: User;
    let signUpResponse: HttpClientResponse<UserDto>;

    given('I am a new user', () => {
      newUser = UserObjectMother.defaultUser();
    });

    when('I register with valid account details', async () => {
      signUpResponse = await apiClient.signUp(
        UserObjectMother.toSignUpDto({ user: newUser, password: newUserPassword }),
      );
    });

    then('I should be granted access to my account', async () => {
      const {
        data: { token },
      } = await apiClient.signIn(UserObjectMother.toSignInDto(newUser));
      const profileResponse = await apiClient.getProfile();

      expect(profileResponse.status).toBe(200);
      expect(profileResponse.data).toEqual(toUserDto(newUser));
      expect(signUpResponse.status).toBe(200);
      expect(signUpResponse.data).toBe(toUserDto(newUser));
    });

    and('I should receive an email with login instructions', () => {
      expect(fakeEmailService.send).toBeCalled();
    });
  });
});
