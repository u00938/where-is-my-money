class ErrorCodeVo {
  readonly status;
  readonly message;

  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}

export type ErrorCode = ErrorCodeVo;

export const ENTITY_NOT_FOUND = new ErrorCodeVo(404, 'Entity Not Found');
export const ENTITY_CONFLICT = new ErrorCodeVo(404, 'Duplicated');
export const UNAUTHORIZED_USER = new ErrorCodeVo(401, 'Unauthorized');
export const SERVER_ERROR = new ErrorCodeVo(500, `서버에 문제가 발생했습니다`);