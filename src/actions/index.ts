import { code, login, logout } from './auth'
import {
  organizationChange,
  organizationCreate,
  organizationDelete,
  organizationUpdate,
} from './admin/organization'
import {
  roleCreate,
  roleCreateRelationPermission,
  roleDelete,
  roleDeletePermission,
  roleUpdate,
  roleUpdatePermissionPosition,
} from './admin/role'
import {
  userCreate,
  userCreateRelationOrganizationRole,
  userDelete,
  userDeleteRelationOrganizationRole,
  userUpdate,
  userUpdateVisibility,
} from './admin/user'
import { permissionCreate, permissionDelete, permissionUpdate } from './admin/permission'
import { menuPageCreate, menuPageDelete, menuPageUpdate } from './admin/menu-page'

import { gratitudeCreate, gratitudeDelete, gratitudeRemind, gratitudeUpdate } from './gratitude'

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
