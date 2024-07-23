const RESPONSE_STATUS = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  SUCCESS: 'SUCCESS',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

const RESPONSE_MESSAGE = {
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INCREMENT_LOGIN_ATTEMPTS: 'INCREMENT_LOGIN_ATTEMPTS',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
};

module.exports = { RESPONSE_STATUS, RESPONSE_MESSAGE };