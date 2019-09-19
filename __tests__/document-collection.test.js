const DocumentCollection = require('../lib/document-collection');
const path = require('path');

jest.mock('../lib/files.js', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  readdir: jest.fn(),
}));

// for setting up mock expectations
const { readFile, writeFile, readdir } = require('../lib/files');

describe('Document Collection', () => {
  // TODO
  it('writes a new object to a new file', () => {
    const sampleData = {
      key: 'value',
      sample: true
    };

    const writePromise = Promise.resolve(sampleData);
    writeFile.mockReturnValueOnce(writePromise);

    const directory = 'documents';
    const documents = new DocumentCollection(directory);

    return documents.save(sampleData)
      .then(object => {
        expect(path.dirname(writeFile.mock.calls[0][0])).toBe(directory);
        expect(writeFile.mock.calls[0][1]).toBe(JSON.stringify(sampleData));
        expect(object._id).toEqual(expect.any(String));
      });

  });

  it('reads an object from file', () => {
    const sampleData = {
      key: 'value',
      sample: true,
      _id: 'boo'
    };
    const readPromise = Promise.resolve(JSON.stringify(sampleData));
    readFile.mockReturnValueOnce(readPromise);

    const directory = 'documents';
    const documents = new DocumentCollection(directory);

    const id = sampleData._id;

    return documents.get(id)
      .then(object => {
        expect(readFile.mock.calls[0][0]).toBe(`${directory}/${id}.json`);
        expect(object._id).toEqual('boo');
      });
  });

  it('reads all objects from a directory', () => {
    const sampleData = {
      key: 'value',
      sample: true,
      _id: 'boo'
    };
    const readDirPromise = Promise.resolve(['boo.json']);
    readdir.mockReturnValueOnce(readDirPromise);

    const readPromise = Promise.resolve(JSON.stringify(sampleData));
    readFile.mockReturnValueOnce(readPromise);

    const directory = 'documents';
    const documents = new DocumentCollection(directory);

    return documents.getAll()
      .then(array => {
        expect(readdir.mock.calls[0][0]).toBe(directory);
        expect(readFile.mock.calls[0][0]).toBe(`${directory}/${sampleData._id}.json`);
        expect(array[0]._id).toBe(sampleData._id);
      });
  });
});
