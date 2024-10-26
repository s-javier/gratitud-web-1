import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'

import { Api, Error } from '~/enums'
import db from '~/db'
import { permissionTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'

export const permissionAdd = defineAction({
  accept: 'json',
  input: z.object({
    path: z.string().min(4).max(100),
    type: z.string().regex(/^(api|view)$/),
  }),
  handler: async (input: any, context: ActionAPIContext) => {
    if (context.locals.userTokenError) {
      if (import.meta.env.DEV) {
        console.error('Problema con el token de usuario en creación de permiso.')
      }
      return { error: handleErrorFromServer(context.locals.userTokenError) }
    }
    const permissionVerification = await verifyPermission(
      context.locals.roleId,
      Api.PERMISSION_CREATE,
    )
    if (!permissionVerification.isSuccess) {
      if (import.meta.env.DEV) {
        console.error('Problema con el permiso del usuario en creación de permiso.')
      }
      return { error: handleErrorFromServer(permissionVerification.error) }
    }
    try {
      await db.insert(permissionTable).values({
        path: input.path,
        type: input.type,
      })
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Creación de permiso.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
  },
})
