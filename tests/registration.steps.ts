import { defineFeature, loadFeature } from 'jest-cucumber';
import path from 'path';

const feature = loadFeature(path.resolve(__dirname, './registration.feature'));

const fakeEmailService = new FakeEmailService();
const webServer = new WebServer();
const httpDriver = new HttpDriver('http://localhost:3000');

defineFeature(feature, (test) => {
  beforeAll(async () => {
    await webServer.start();
  });

  afterAll(async () => {
    await webServer.stop();
  });

  test('Successful registration', ({ given, when, then, and }) => {
    let createUserDto: CreateUserDto;
    let expectedUser: User;
    let response: Response;

    given('I am a new user', () => {
      createUserDto = new UserDtoDirector.createRandom(new UserDtoBuilder());
      expectedUser = new UserDirector.createFromDto(new UserBuilder(), createUserDto);
    });

    when('I register with valid account details', async () => {
      response = await httpDriver.post('/users/new', createUserDto);
    });

    then('I should be granted access to my account', () => {
      expect(response.status).toBe(200);
      expect(response.body).toBe(expectedUser);
    });

    and('I should receive an email with login instructions', () => {
      expect(fakeEmailService.send).toBeCalled();
    });
  });
});
