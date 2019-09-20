jest.mock('../lib/files', () => {
  return {
    mkdirp: jest.fn()
  };
});

const Database = require('../lib/database');
const DocumentCollection = require('../lib/document-collection');

// for setting up mock expectations
const { mkdirp } = require('../lib/files');


describe('Database', () => {

  const dbPath = './dbpath';

  it('connect sets connection promise', () => {
    // arrange
    mkdirp.mockResolvedValueOnce();

    // act
    return Database.connect(dbPath)
      // assert
      .then(() => {
        const mkdirpCalls = mkdirp.mock.calls;
        expect(mkdirpCalls.length).toBe(1); 
        expect(mkdirpCalls[0][0]).toBe(dbPath);

        // const connectionPromise = Database.connectionPromise;
        const { connectionPromise } = Database;
        expect(connectionPromise).not.toBeNull();
        return connectionPromise;
      })
      .then(path => {
        expect(path).toBe(dbPath);
      });
  });

  it('creates collection path and caches DocumentCollection', () => {
    // arrange
    mkdirp.mockClear();
    mkdirp.mockResolvedValueOnce();
    mkdirp.mockResolvedValueOnce();

    return Database.connect(dbPath)
      .then(() => {
        // act
        return Database.getCollection('test');
      })
      .then(collection => {
        // assert
        const mkdirpCalls = mkdirp.mock.calls;
        expect(mkdirpCalls.length).toBe(2); 
        expect(mkdirpCalls[0][0]).toBe(dbPath);
        expect(mkdirpCalls[1][0]).toBe('dbpath/test');

        expect(collection).toBeInstanceOf(DocumentCollection);
        expect(collection.folder).toBe('dbpath/test');
        expect(Database.collections.test).toBe(collection);

        return Database.getCollection('test')
          .then(secondTimeCollection => {
            expect(mkdirpCalls.length).toBe(2); 
            expect(secondTimeCollection).toBe(collection);
          });
      });
  });

  it('close resets connectionPromise and collections', () => {
    Database.close();
    expect(Database.connectionPromise).toBeNull();
    expect(Database.collections).toEqual({});
  });

  it('rejects if getCollection called before connect', () => {
    Database.close();
    expect.assertions(1);
    return Database.getCollection('test')
      .catch(err => {
        expect(err).toBeInstanceOf(Database.NoConnectionError);
      });
  });
});