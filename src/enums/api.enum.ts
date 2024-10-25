export enum Api {
  SITE_HIRE = '/site/hire',

  AUTH_SIGN_IN = '/auth/sign-in',
  AUTH_SIGN_OUT = '/auth/sign-out',
  AUTH_VERIFY_CODE = '/auth/verify-code',
  AUTH_VERIFY_USER_TOKEN = '/auth/verify-user-token',

  PERMISSION_VERIFY_PAGE_ACCESS = '/permission/verify-page-access',
  PERMISSION_ALL = '/permission/all',
  PERMISSION_CREATE = '/permission/create',
  PERMISSION_DELETE = '/permission/delete',
  PERMISSION_UPDATE = '/permission/update',

  // ADMIN_GRAL_MENU = '/admin-gral/menu',

  ORGANIZATION_CHANGE = '/organization/change',
  ORGANIZATION_ALL = '/organization/all',
  ORGANIZATION_CREATE = '/organization/create',
  ORGANIZATION_DELETE = '/organization/delete',
  ORGANIZATION_UPDATE = '/organization/update',

  ROLE_ALL = '/role/all',
  ROLE_CREATE = '/role/create',
  ROLE_CREATE_RELATION_PERMISSION = '/role/create-relation-permission',
  ROLE_DELETE = '/role/delete',
  ROLE_DELETE_RELATION_PERMISSION = '/role/delete-relation-permission',
  ROLE_UPDATE = '/role/update',

  USER_ALL = '/user/all',
  USER_CREATE = '/user/create',
  USER_CREATE_RELATION_ORGANIZATION_ROLE = '/user/create-relation-organization-role',
  USER_DELETE = '/user/delete',
  USER_DELETE_RELATION_ORGANIZATION_ROLE = '/user/delete-relation-organization-role',
  USER_UPDATE = '/user/update',
  USER_UPDATE_RELATION_ORGANIZATION_ROLE_VISIBILITY = '/user/update-relation-organization-role-visibility',

  MENU_PAGE_ALL = '/menu-page/all',
  MENU_PAGE_CREATE = '/menu-page/create',
  MENU_PAGE_DELETE = '/menu-page/delete',
  MENU_PAGE_UPDATE = '/menu-page/update',

  LANGUAGE_BY_ORGANIZATION = '/language/by-organization',
  LANGUAGE_CREATE = '/language/create',
  LANGUAGE_DELETE = '/language/delete',
  LANGUAGE_UPDATE = '/language/update',

  COMPANY_BY_ORGANIZATION = '/company/by-organization',
  COMPANY_UPDATE = '/company/update',

  BRANCH_BY_ORGANIZATION = '/branch/by-organization',
  BRANCH_CREATE = '/branch/create',
  BRANCH_DELETE = '/branch/delete',
  BRANCH_UPDATE = '/branch/update',

  SECTION_BY_ORGANIZATION = '/section/by-organization',
  SECTION_CREATE = '/section/create',
  SECTION_DELETE = '/section/delete',
  SECTION_UPDATE = '/section/update',
}
