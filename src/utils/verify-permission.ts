import { and, eq } from 'drizzle-orm'

import { Error } from '~/enums'
import db from '~/db'
import { permissionTable, rolePermissionTable, roleTable } from '~/db/schema'

export const verifyPermission = async (
  roleId: string,
  path: string,
): Promise<{ isSuccess: boolean; error?: string }> => {
  try {
    const query = await db
      .select({ permissionId: permissionTable.id })
      .from(roleTable)
      .innerJoin(rolePermissionTable, eq(roleTable.id, rolePermissionTable.roleId))
      .innerJoin(permissionTable, eq(rolePermissionTable.permissionId, permissionTable.id))
      .where(and(eq(roleTable.id, roleId), eq(permissionTable.path, path)))
    if (query.length === 0) {
      if (import.meta.env.DEV) {
        console.error('El usuario no tiene permiso para realizar esta operación.')
      }
      return {
        isSuccess: false,
        error: Error.USER_WITHOUT_PERMISSION,
      }
    }
  } catch {
    if (import.meta.env.DEV) {
      console.error('Error en DB. Verificación de permisos.')
    }
    return {
      isSuccess: false,
      error: Error.DB,
    }
  }
  return {
    isSuccess: true,
  }
}
