import { asc, eq } from 'drizzle-orm'

import db from '~/db'
import { menuPageTable, permissionTable, rolePermissionTable } from '~/db/schema'
import { CacheData } from '~/enums'
import { cache } from '~/utils/cache'

export const getMenuFromDB = async (roleId: string) => {
  let menu: any[] = []
  if (cache.has(JSON.stringify({ data: CacheData.MENU, roleId }))) {
    menu = cache.get(JSON.stringify({ data: CacheData.MENU, roleId })) as any[]
  } else {
    menu = await db
      .select({
        title: menuPageTable.title,
        // sort: menuPageTable.sort,
        icon: menuPageTable.icon,
        path: permissionTable.path,
      })
      .from(menuPageTable)
      .innerJoin(permissionTable, eq(menuPageTable.permissionId, permissionTable.id))
      .innerJoin(rolePermissionTable, eq(permissionTable.id, rolePermissionTable.permissionId))
      .where(eq(rolePermissionTable.roleId, roleId))
      .orderBy(asc(menuPageTable.sort))
    cache.set(JSON.stringify({ data: CacheData.MENU, roleId }), menu)
  }
  return menu
}
