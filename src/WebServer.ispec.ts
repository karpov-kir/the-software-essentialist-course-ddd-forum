import { WebServer } from './WebServer.mjs';

let webServer: WebServer;

describe(WebServer, () => {
  beforeEach(() => {
    webServer = new WebServer();

    webServer.addRoute({
      method: 'GET',
      path: '/',
      isProtected: false,
      handler: () => {
        return 'OK';
      },
    });
  });

  afterEach(async () => {
    if (webServer.isListening()) {
      await webServer.stop();
    }
  });

  it('should start the server', async () => {
    await webServer.start();

    const response = await fetch('http://localhost:3000');

    expect(response.status).toBe(200);
    expect(webServer.isListening()).toBeTruthy();
  });

  it('should stop the server', async () => {
    await webServer.start();
    await webServer.stop();

    await expect(fetch('http://localhost:3000')).rejects.toThrow();
    expect(webServer.isListening()).toBeFalsy();
  });
});
