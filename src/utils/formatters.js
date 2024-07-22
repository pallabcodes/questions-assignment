const { ValidationError } = require('yup');

// TODO: This could be used as middleware on any routes as needed
const parseValidationErrors = (error) => {
  if (error instanceof ValidationError) {
    const errorsMap = error.inner.reduce((messagesMap, validationResult) => {
      if (!messagesMap[validationResult.path]) {
        messagesMap[validationResult.path] = {
          key: validationResult.path,
          messages: validationResult.errors,
        };
      } else {
        messagesMap[validationResult.path].messages.push(
          validationResult.errors[0]
        );
      }

      return messagesMap;
    }, {});

    return { message: 'Validation failed', errors: Object.values(errorsMap) };
  }

  return { message: 'Unable to process your request at the moment!' };
};

module.exports = { parseValidationErrors };
