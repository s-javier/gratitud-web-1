export enum Error {
  DB = 'database error',
  USER_NOT_FOUND = 'user not found',
  USER_IS_DISABLED = 'user is disabled',
  USER_WITHOUT_PERMISSION = "user don't have permission",
  USER_WITHOUT_PERMISSIONS = "user don't have permissions",
  EMAIL_WITH_CODE = 'email with code',
  CODE_NOT_FOUND = 'code not found',
  CODE_IS_DISABLED = 'code is disabled',
  CODE_IS_EXPIRED = 'code is expired',
  NOT_USER_TOKEN = 'not token',
  USER_TOKEN_NOT_FOUND = 'token not found',
  SESSION_IS_DISABLED = 'session is disabled',
  SESSION_IS_EXPIRED = 'session is expired',
  ORG_ROLE_NOT_FOUND = 'org role not found',
  USER_WITHOUT_ORGANIZATION = 'user without organization',
  USER_NOT_ASSOCIATED_CHANGE_ORGANIZATION = 'user not associated with the change in organization',
  USER_NOT_ASSOCIATED_CURRENT_ORGANIZATION = 'user not associated with current organization',
  LANGUAGE_IS_DEFAULT = 'language is default',
  LANGUAGE_NECESSARY_DEFAULT = 'language necessary default',
  ROLE_PERMISSION_ALREADY_EXISTS = 'role permission already exists',
  ORGANIZATION_USER_ROLE_ALREADY_EXISTS = 'organization user role already exists',
}
