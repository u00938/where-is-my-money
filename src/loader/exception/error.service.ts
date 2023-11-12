import {
  ErrorCode,
  ENTITY_CONFLICT, 
  ENTITY_NOT_FOUND,
  UNAUTHORIZED_USER, 
  SERVER_ERROR
} from "./error.code";

export const EntityNotFoundException = (message?: string): ServiceException => {
  return new ServiceException(ENTITY_NOT_FOUND, message);
};

export const EntityConflictException = (message?: string): ServiceException => {
  return new ServiceException(ENTITY_CONFLICT, message);
};

export const UnauthorizedUserException = (message?: string): ServiceException => {
  return new ServiceException(UNAUTHORIZED_USER, message);
};

export const ServerErrorException = (message?: string): ServiceException => {
  return new ServiceException(SERVER_ERROR, message);
};

export class ServiceException extends Error {
  readonly errorCode: ErrorCode;

  constructor(errorCode: ErrorCode, message?: string) {
    if (!message) {
      message = errorCode.message;
    }

    super(message);

    this.errorCode = errorCode;
  }
}