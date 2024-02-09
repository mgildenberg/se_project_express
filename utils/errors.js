// used ChatGPT to generate common express errors & match required format

const SUCCESS = 200; // Bad Request

const VALIDATION_ERROR = 400; // Bad Request
const CAST_ERROR = 400; // Bad Request
const DOCUMENT_NOT_FOUND_ERROR = 404; // Not Found
const MONGOOSE_ERROR = 500; // Internal Server Error
const DUPLICATE_KEY_ERROR = 409; // Conflict
const UNAUTHORIZED_ERROR = 401; // Unauthorized
const FORBIDDEN_ERROR = 403; // Forbidden
const NOT_FOUND_ERROR = 404; // Not Found
const METHOD_NOT_ALLOWED_ERROR = 405; // Method Not Allowed
const REQUEST_TIMEOUT_ERROR = 408; // Request Timeout
const CONFLICT_ERROR = 409; // Conflict
const PAYLOAD_TOO_LARGE_ERROR = 413; // Payload Too Large
const UNSUPPORTED_MEDIA_TYPE_ERROR = 415; // Unsupported Media Type
const TOO_MANY_REQUESTS_ERROR = 429; // Too Many Requests
const INTERNAL_SERVER_ERROR = 500; // Internal Server Error
const NOT_IMPLEMENTED_ERROR = 501; // Not Implemented
const BAD_GATEWAY_ERROR = 502; // Bad Gateway
const SERVICE_UNAVAILABLE_ERROR = 503; // Service Unavailable
const GATEWAY_TIMEOUT_ERROR = 504; // Gateway Timeout

module.exports = {
  SUCCESS,
  VALIDATION_ERROR,
  CAST_ERROR,
  DOCUMENT_NOT_FOUND_ERROR,
  MONGOOSE_ERROR,
  DUPLICATE_KEY_ERROR,
  UNAUTHORIZED_ERROR,
  FORBIDDEN_ERROR,
  NOT_FOUND_ERROR,
  METHOD_NOT_ALLOWED_ERROR,
  REQUEST_TIMEOUT_ERROR,
  CONFLICT_ERROR,
  PAYLOAD_TOO_LARGE_ERROR,
  UNSUPPORTED_MEDIA_TYPE_ERROR,
  TOO_MANY_REQUESTS_ERROR,
  INTERNAL_SERVER_ERROR,
  NOT_IMPLEMENTED_ERROR,
  BAD_GATEWAY_ERROR,
  SERVICE_UNAVAILABLE_ERROR,
  GATEWAY_TIMEOUT_ERROR,
};
