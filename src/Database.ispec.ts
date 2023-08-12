import { Database } from './Database.mjs';

const database = new Database();

describe(Database.name, () => {
  afterEach(async () => {
    if (database.isConnected()) {
      await database.disconnect();
    }
  });

  it('should connect and disconnect', async () => {
    expect(database.isConnected()).toBe(false);
    await expect(database.connect()).resolves.toBeUndefined();
    expect(database.isConnected()).toBe(true);
    await expect(database.disconnect()).resolves.toBeUndefined();
    expect(database.isConnected()).toBe(false);
  });

  it('should execute a query', async () => {
    await database.connect();
    await expect(database.getConnection().query`SELECT 1 AS one`).resolves.toEqual([{ one: 1 }]);
  });
});
