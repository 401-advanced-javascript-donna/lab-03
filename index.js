const DocumentCollection = require('./lib/document-collection');

const documents = new DocumentCollection('./documents');

// write some code to exercise your document collection
const sampleData = {
  key: 'value',
  sample: true
};

documents.save(sampleData);
