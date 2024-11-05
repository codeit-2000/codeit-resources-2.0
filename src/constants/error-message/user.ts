const LOGIN_ERROR_MESSAGES: { [key: string]: string } = {
  UserAlreadyAuthenticatedException: "이미 로그인 한 상태입니다.",
  NotAuthorizedException: "아이디 또는 비밀번호가 잘못되었습니다.",
  UserNotFoundException: "해당 사용자를 찾을 수 없습니다.",
  UserNotConfirmedException: "이메일 인증이 완료되지 않았습니다.",
  PasswordResetRequiredException: "비밀번호를 재설정해야 합니다.",
  TooManyFailedAttemptsException:
    "로그인 시도가 너무 많아 계정이 잠겼습니다. 잠시 후 다시 시도해주세요.",
  LimitExceededException: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
  UnknownError: "로그인 중 알 수 없는 오류가 발생했습니다.",
};

const ADD_MEMBER_ERROR_MESSAGE: { [key: string]: string } = {
  UsernameExistsException: "이미 존재하는 이메일입니다.",
  TooManyRequestsException:
    "많은 요청이 발생했습니다. 잠시 후 다시 시도하세요.",
  LimitExceededException:
    "AWS 요청 한도를 초과했습니다. 나중에 다시 시도하세요.",
  NotAuthorizedException: "요청 권한이 없습니다.",
  ServiceErrorException:
    "AWS Cognito 내부 오류로 인해 요청이 처리되지 않았습니다.",
  UnknownError: "멤버 추가 중 알 수 없는 오류가 발생했습니다.",
};

const EMAIL_EDIT_ERROR_MESSAGE: { [key: string]: string } = {
  AliasExistsException: "이미 존재하는 이메일입니다.",
  NotAuthorizedException: "해당 요청을 수행할 권한이 없습니다.",
  TooManyRequestsException:
    "많은 요청이 발생했습니다. 잠시 후 다시 시도하세요.",
  InternalErrorException:
    "AWS Cognito 내부 오류로 인해 요청이 처리되지 않았습니다.",
};

const ROLE_ERROR_MESSAGE: { [key: string]: string } = {
  UserNotFoundException: "존재하지 않은 유저입니다.",
  NotAuthorizedException: "해당 요청을 수행할 권한이 없습니다.",
  ResourceNotFoundException: "해당 그룹이 존재하지 않습니다.",
  TooManyRequestsException:
    "많은 요청이 발생했습니다. 잠시 후 다시 시도하세요.",
  InternalErrorException:
    "AWS Cognito 내부 오류로 인해 요청이 처리되지 않았습니다.",
};

const CONFIRM_ERROR_MESSAGE: { [key: string]: string } = {
  UserNotFoundException: "존재하지 않은 유저입니다.",
  NotAuthorizedException: "해당 요청을 수행할 권한이 없습니다.",
  TooManyRequestsException:
    "많은 요청이 발생했습니다. 잠시 후 다시 시도하세요.",
  InternalErrorException:
    "AWS Cognito 내부 오류로 인해 요청이 처리되지 않았습니다.",
};

const PASSWORD_ERROR_MESSAGE: { [key: string]: string } = {
  UserNotFoundException: "존재하지 않은 사용자입니다.",
  CodeMismatchException: "인증 코드가 올바르지 않습니다",
  ExpiredCodeException: "인증 코드의 유효 기간이 만료되었습니다.",
  NotAuthorizedException: "권한이 없습니다.",
  LimitExceededException:
    "시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.",
  TooManyFailedAttemptsException:
    "너무 많은 실패한 시도가 있었습니다. 잠시 후 다시 시도해주세요.",
  InternalErrorException:
    "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
};

export {
  LOGIN_ERROR_MESSAGES,
  ADD_MEMBER_ERROR_MESSAGE,
  EMAIL_EDIT_ERROR_MESSAGE,
  ROLE_ERROR_MESSAGE,
  CONFIRM_ERROR_MESSAGE,
  PASSWORD_ERROR_MESSAGE,
};
