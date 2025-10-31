const memoryDB = require('../services/memoryDB');

// Mock mongoose models with our in-memory DB
function createModel(name, schema) {
  return {
    find: (query) => memoryDB[`find${name}s`](query || {}),
    findOne: (query) => memoryDB[`find${name}`](query || {}),
    create: (data) => memoryDB[`create${name}`](data),
    findOneAndUpdate: (query, update, options) => 
      memoryDB[`update${name}`](query, update, options),
    deleteMany: () => ({}),
    estimatedDocumentCount: () => Promise.resolve(0)
  };
}

// Initialize in-memory database with sample data
async function initializeSampleData() {
  // Add sample data here if needed
  console.log('In-memory database initialized');
}

module.exports = async function connectDB() {
  console.log('Using in-memory database');
  await initializeSampleData();
  return {
    connection: {
      on: (event, callback) => {
        if (event === 'connected') callback();
      }
    },
    model: (name, schema) => createModel(name, schema)
  };
};
