jest.mock('../lib/database', () => {
  return {
    getCollection: jest.fn()
  };
});
// jest automock for ES6 classes
// theAutomaticMock.mock.instances[index].methodName.mock.calls.
jest.mock('../lib/document-collection');

const Model = require('../lib/model');
const Schema = require('../lib/schema');
const { getCollection } = require('../lib/database');
const DocumentCollection = require('../lib/document-collection');

const mockCollection = new DocumentCollection('test');
getCollection.mockResolvedValue(mockCollection);

describe('Model', () => {

  // arrange
  const schemaConfig = {
    // doesn't actually mater as long as passed to schema:
    name: {
      type: String,
      required: true
    }
  };

  // act
  const Cats = new Model('cats', schemaConfig);

  // write some tests
  it('creates a schema and document collection', () => {

    // assert:
    
    // Cats.schema should be an instance of Schema, 
    expect(Cats.schema).toBeInstanceOf(Schema);
    // with schemaConfig as saved schema
    expect(Cats.schema.schema).toBe(schemaConfig);

    // Cats.collectionPromise should be Promise that resolves
    // to an instance of DocumentCollection
    // (with collection.folder ending in "cats")
    const getCollectionCalls = getCollection.mock.calls;
    expect(getCollectionCalls.length).toBe(1); 
    expect(getCollection.mock.calls[0][0]).toBe('cats');

    expect(Cats.collectionPromise).not.toBeNull();
    return Cats.collectionPromise.then(collection => {
      expect(collection).toBe(mockCollection);
    });
    
  });

  it('creates a model', () => {
    const pojo = {
      name: 'test'
    };

    mockCollection.save.mockResolvedValue(pojo);
    
    return Cats.create(pojo)
      .then(created => {
        expect(created).toEqual(pojo);
      });
  });

  // test rest of model methods. 
});