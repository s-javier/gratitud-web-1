import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'
import { and, eq } from 'drizzle-orm'

import { Api, Error } from '~/enums'
import db from '~/db'
import { rolePermissionTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'

export const roleDeleteRelationPermission = defineAction({
  accept: 'json',
  input: z.object({
    roleId: z
      .string()
      .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/),
    permissionId: z
      .string()
      .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/),
  }),
  handler: async (input: any, context: ActionAPIContext) => {
    if (context.locals.userTokenError) {
      if (import.meta.env.DEV) {
        console.error(
          'Problema con el token de usuario en la eliminación de la relación: rol - permiso.',
        )
      }
      return { error: handleErrorFromServer(context.locals.userTokenError) }
    }
    const permissionVerification = await verifyPermission(
      context.locals.roleId,
      Api.ROLE_DELETE_RELATION_PERMISSION,
    )
    if (!permissionVerification.isSuccess) {
      if (import.meta.env.DEV) {
        console.error(
          'Problema con el permiso del usuario en la eliminación de la relación: rol - permiso.',
        )
      }
      return { error: handleErrorFromServer(permissionVerification.error) }
    }
    /******************************/
    try {
      await db
        .delete(rolePermissionTable)
        .where(
          and(
            eq(rolePermissionTable.roleId, input.roleId),
            eq(rolePermissionTable.permissionId, input.permissionId),
          ),
        )
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Eliminación de la relación: rol - permiso.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
  },
})
