
class CastError extends Error {
  constructor(expectedType, providedValue) {
    super(`Cannot cast ${providedValue} to ${expectedType}`);
    this.expectedType = expectedType;
    this.providedValue = providedValue;
  }
}

class ModelError extends Error {
  constructor(schemaErrors) {
    super('Model had schema errors:\n' + schemaErrors.join('\n'));
    this.schemaErrors = schemaErrors;
  }
}

module.exports = {
  CastError,
  ModelError
};