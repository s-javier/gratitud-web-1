import { login } from './auth/login.action'
import { code } from './auth/code.action'
import { logout } from './auth/sign-out.action'
import { organizationChange } from './admin/organization/change.action'
import { organizationAdd } from './admin/organization/add.action'
import { organizationDelete } from './admin/organization/delete.action'
import { organizationEdit } from './admin/organization/edit.action'
import { roleAdd } from './admin/role/add.action'
import { roleAddRelationPermission } from './admin/role/add-relation.action'
import { roleDelete } from './admin/role/delete.action'
import { roleDeleteRelationPermission } from './admin/role/delete-relation.action'
import { roleEdit } from './admin/role/edit.action'
import { roleUpdatePermissionPosition } from './admin/role/update-permission-position.action'
import { userAdd } from './admin/user/add.action'
import { userAddRelationOrganizationRole } from './admin/user/add-relation.action'
import { userDelete } from './admin/user/delete.action'
import { userDeleteRelationOrganizationRole } from './admin/user/delete-relation.action'
import { userEdit } from './admin/user/edit.action'
import { userEditVisibility } from './admin/user/edit-visibility.action'
import { permissionDelete } from './admin/permission/delete.action'
import { permissionAdd } from './admin/permission/add.action'
import { permissionEdit } from './admin/permission/edit.action'
import { menuPageAdd } from './admin/menu-page/add.action'
import { menuPageDelete } from './admin/menu-page/delete.action'
import { menuPageEdit } from './admin/menu-page/edit.action'

import { gratitudeAdd } from './gratitude/add.action'
import { gratitudeEdit } from './gratitude/edit.action'
import { gratitudeDelete } from './gratitude/delete.action'
import { gratitudeRemind } from './gratitude/remind.action'

export const server = {
  login,
  code,
  logout,

  organizationChange,
  organizationAdd,
  organizationDelete,
  organizationEdit,

  roleAdd,
  roleAddRelationPermission,
  roleDelete,
  roleDeleteRelationPermission,
  roleEdit,
  roleUpdatePermissionPosition,

  userAdd,
  userAddRelationOrganizationRole,
  userDelete,
  userDeleteRelationOrganizationRole,
  userEdit,
  userEditVisibility,

  permissionAdd,
  permissionDelete,
  permissionEdit,

  menuPageAdd,
  menuPageDelete,
  menuPageEdit,

  gratitudeAdd,
  gratitudeEdit,
  gratitudeDelete,
  gratitudeRemind,
}
