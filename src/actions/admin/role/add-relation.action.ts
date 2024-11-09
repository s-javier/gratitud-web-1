import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'

import { Api, Error } from '~/enums'
import db from '~/db'
import { rolePermissionTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'

export const roleAddRelationPermission = defineAction({
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
          'Problema con el token de usuario en la creación de la relación: rol - permiso.',
        )
      }
      return { error: handleErrorFromServer(context.locals.userTokenError) }
    }
    const permissionVerification = await verifyPermission(
      context.locals.roleId,
      Api.ROLE_CREATE_RELATION_PERMISSION,
    )
    if (!permissionVerification.isSuccess) {
      if (import.meta.env.DEV) {
        console.error(
          'Problema con el permiso del usuario en creación de la relación: rol - permiso.',
        )
      }
      return { error: handleErrorFromServer(permissionVerification.error) }
    }
    /******************************/
    try {
      await db
        .insert(rolePermissionTable)
        .values({ roleId: input.roleId, permissionId: input.permissionId })
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Creación de la relación: rol - permiso.')
      }
      if (err.message.includes('duplicate key value violates unique constraint')) {
        return { error: handleErrorFromServer(Error.ROLE_PERMISSION_ALREADY_EXISTS) }
      } else {
        return { error: handleErrorFromServer(Error.DB) }
      }
    }
  },
})
