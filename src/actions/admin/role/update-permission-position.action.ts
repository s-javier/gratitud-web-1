import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'
import { and, eq } from 'drizzle-orm'

import { Api, CacheData, Error } from '~/enums'
import db from '~/db'
import { rolePermissionTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'
import { cache } from '~/utils/cache'

export const roleUpdatePermissionPosition = defineAction({
  accept: 'json',
  input: z.object({
    id: z.string().uuid(),
    targetId: z.string().uuid(),
    targetSort: z.number(),
    affectedId: z.string().uuid(),
    affectedSort: z.number(),
  }),
  handler: async (input: any, context: ActionAPIContext) => {
    if (context.locals.userTokenError) {
      if (import.meta.env.DEV) {
        console.error(
          'Problema con el token de usuario en actualización de posiciones de permisos en rol.',
        )
      }
      return { error: handleErrorFromServer(context.locals.userTokenError) }
    }
    const permissionVerification = await verifyPermission(
      context.locals.roleId,
      Api.ROLE_UPDATE_PERMISSION_POSITION,
    )
    if (!permissionVerification.isSuccess) {
      if (import.meta.env.DEV) {
        console.error(
          'Problema con el permiso del usuario en actualización de posiciones de permisos en rol.',
        )
      }
      return { error: handleErrorFromServer(permissionVerification.error) }
    }
    /******************************/
    try {
      await db
        .update(rolePermissionTable)
        .set({ sort: input.affectedSort })
        .where(
          and(
            eq(rolePermissionTable.roleId, input.id),
            eq(rolePermissionTable.permissionId, input.targetId),
          ),
        )
      await db
        .update(rolePermissionTable)
        .set({ sort: input.targetSort })
        .where(
          and(
            eq(rolePermissionTable.roleId, input.id),
            eq(rolePermissionTable.permissionId, input.affectedId),
          ),
        )
      cache.delete(JSON.stringify({ data: CacheData.MENU, roleId: context.locals.roleId }))
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Actualización de posiciones de permisos en rol.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
  },
})
