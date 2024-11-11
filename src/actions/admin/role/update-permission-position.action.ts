import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'
import { and, eq } from 'drizzle-orm'

import { Api, Error } from '~/enums'
import db from '~/db'
import { rolePermissionTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'

export const roleUpdatePermissionPosition = defineAction({
  accept: 'json',
  input: z.object({
    roleId: z.string().uuid(),
    targetPermissionId: z.string().uuid(),
    targetSort: z.number(),
    affectedPermissionId: z.string().uuid(),
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
            eq(rolePermissionTable.roleId, input.roleId),
            eq(rolePermissionTable.permissionId, input.targetPermissionId),
          ),
        )
      await db
        .update(rolePermissionTable)
        .set({ sort: input.targetSort })
        .where(
          and(
            eq(rolePermissionTable.roleId, input.roleId),
            eq(rolePermissionTable.permissionId, input.affectedPermissionId),
          ),
        )
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Actualización de posiciones de permisos en rol.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
  },
})
