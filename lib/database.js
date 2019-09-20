const path = require('path');
const { mkdirp } = require('./files');
const DocumentCollection = require('./document-collection');

const Database = {
  connectionPromise: null,

  collections: {},

  connect(dir) {
    this.connectionPromise = mkdirp(dir).then(() => dir);
    return this.connectionPromise;
  },

  close() {
    this.connectionPromise = null;
    this.collections = {};
  },

  getCollection(name) {
    if(!this.connectionPromise) {
      return Promise.reject(new NoConnectionError());
    }

    const collection = this.collections[name];

    if(collection) {
      return Promise.resolve(collection);
    }

    return this.connectionPromise
      .then(dir => {
        const collectionPath = path.join(dir, name);
        return mkdirp(collectionPath).then(() => collectionPath);
      })
      .then(path => {
        const collection = new DocumentCollection(path);
        this.collections[name] = collection;
        return collection;
      });
  }
};

class NoConnectionError extends Error {
  constructor() {
    super('Cannot access collection until Database.connect has been called');
  }
}

Database.NoConnectionError = NoConnectionError;

module.exports = Database;