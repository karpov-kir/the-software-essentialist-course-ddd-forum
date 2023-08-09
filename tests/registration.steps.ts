import { defineFeature, loadFeature } from 'jest-cucumber';
import path from 'path';

import { ApiClient, HttpClientResponse } from '../src/ApiClient.mjs';
import { CreateUserDto, GetUserDto } from '../src/userDto.mjs';
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
    let createUserDto: CreateUserDto;
    let expectedCreatedUserDto: GetUserDto;
    let createUserResponse: HttpClientResponse<GetUserDto>;

    given('I am a new user', () => {
      const user = UserObjectMother.defaultUser();

      createUserDto = UserObjectMother.toCreateUserDto(user);
      expectedCreatedUserDto = UserObjectMother.toGetUserDto(user);
    });

    when('I register with valid account details', async () => {
      createUserResponse = await apiClient.createUser(createUserDto);
    });

    then('I should be granted access to my account', async () => {
      expect(createUserResponse.status).toBe(200);
      expect(createUserResponse.data).toBe(expectedCreatedUserDto);
    });

    and('I should receive an email with login instructions', () => {
      expect(fakeEmailService.send).toBeCalled();
    });
  });
});
