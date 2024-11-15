import { login } from './auth/login.action'
import { code } from './auth/code.action'
import { logout } from './auth/logout.action'
import { organizationChange } from './admin/organization/change.action'
import { organizationCreate } from './admin/organization/create.action'
import { organizationDelete } from './admin/organization/delete.action'
import { organizationUpdate } from './admin/organization/update.action'
import { roleCreate } from './admin/role/create.action'
import { roleCreateRelationPermission } from './admin/role/create-relation.action'
import { roleDelete } from './admin/role/delete.action'
import { roleDeletePermission } from './admin/role/delete-permission.action'
import { roleUpdate } from './admin/role/update.action'
import { roleUpdatePermissionPosition } from './admin/role/update-permission-position.action'
import { userCreate } from './admin/user/create.action'
import { userCreateRelationOrganizationRole } from './admin/user/create-relation.action'
import { userDelete } from './admin/user/delete.action'
import { userDeleteRelationOrganizationRole } from './admin/user/delete-relation.action'
import { userUpdate } from './admin/user/update.action'
import { userUpdateVisibility } from './admin/user/update-visibility.action'
import { permissionDelete } from './admin/permission/delete.action'
import { permissionCreate } from './admin/permission/create.action'
import { permissionUpdate } from './admin/permission/update.action'
import { menuPageCreate } from './admin/menu-page/create.action'
import { menuPageDelete } from './admin/menu-page/delete.action'
import { menuPageUpdate } from './admin/menu-page/update.action'

import { gratitudeCreate } from './gratitude/create.action'
import { gratitudeUpdate } from './gratitude/update.action'
import { gratitudeDelete } from './gratitude/delete.action'
import { gratitudeRemind } from './gratitude/remind.action'

export const server = {
  login,
  code,
  logout,

  organizationChange,
  organizationCreate,
  organizationDelete,
  organizationUpdate,

  roleCreate,
  roleCreateRelationPermission,
  roleDelete,
  roleDeletePermission,
  roleUpdate,
  roleUpdatePermissionPosition,

  userCreate,
  userCreateRelationOrganizationRole,
  userDelete,
  userDeleteRelationOrganizationRole,
  userUpdate,
  userUpdateVisibility,

  permissionCreate,
  permissionDelete,
  permissionUpdate,

  menuPageCreate,
  menuPageDelete,
  menuPageUpdate,

  gratitudeCreate,
  gratitudeUpdate,
  gratitudeDelete,
  gratitudeRemind,
}
