import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'
import { eq } from 'drizzle-orm'

import { Api, Error } from '~/enums'
import db from '~/db'
import { permissionTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'

export const permissionEdit = defineAction({
  accept: 'json',
  input: z.object({
    id: z.string().uuid(),
    path: z.string().min(4).max(100),
    type: z.string().regex(/^(api|view)$/),
  }),
  handler: async (input: any, context: ActionAPIContext) => {
    if (context.locals.userTokenError) {
      if (import.meta.env.DEV) {
        console.error('Problema con el token de usuario en actualización de permiso.')
      }
      return { error: handleErrorFromServer(context.locals.userTokenError) }
    }
    const permissionVerification = await verifyPermission(
      context.locals.roleId,
      Api.PERMISSION_UPDATE,
    )
    if (!permissionVerification.isSuccess) {
      if (import.meta.env.DEV) {
        console.error('Problema con el permiso del usuario en actualización de permiso.')
      }
      return { error: handleErrorFromServer(permissionVerification.error) }
    }
    try {
      await db
        .update(permissionTable)
        .set({ path: input.path, type: input.type })
        .where(eq(permissionTable.id, input.id))
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Actualización de permiso.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
  },
})
