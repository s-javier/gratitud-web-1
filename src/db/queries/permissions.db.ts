import { and, eq } from 'drizzle-orm'

import { CacheData } from '~/enums'
import db from '~/db'
import { permissionTable, rolePermissionTable, roleTable } from '~/db/schema'
import { cache } from '~/utils/cache'

export const getPermissionsFromDB = async (roleId: string, path: string) => {
  let permissions: any[] = []
  if (cache.has(JSON.stringify({ data: CacheData.PERMISSIONS, roleId, path }))) {
    permissions = cache.get(JSON.stringify({ data: CacheData.PERMISSIONS, roleId, path })) as any[]
  } else {
    permissions = await db
      .select({ permissionId: permissionTable.id })
      .from(roleTable)
      .innerJoin(rolePermissionTable, eq(roleTable.id, rolePermissionTable.roleId))
      .innerJoin(permissionTable, eq(rolePermissionTable.permissionId, permissionTable.id))
      .where(and(eq(roleTable.id, roleId), eq(permissionTable.path, path)))
    cache.set(JSON.stringify({ data: CacheData.PERMISSIONS, roleId, path }), permissions)
  }
  return permissions
}
