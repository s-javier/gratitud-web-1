import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'
import { eq } from 'drizzle-orm'

import { Api, Error } from '~/enums'
import db from '~/db'
import { personTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'

export const userDelete = defineAction({
  accept: 'json',
  input: z.string().uuid(),
  handler: async (input: any, context: ActionAPIContext) => {
    if (context.locals.userTokenError) {
      if (import.meta.env.DEV) {
        console.error('Problema con el token de usuario en eliminación de usuario.')
      }
      return { error: handleErrorFromServer(context.locals.userTokenError) }
    }
    const permissionVerification = await verifyPermission(context.locals.roleId, Api.USER_DELETE)
    if (!permissionVerification.isSuccess) {
      if (import.meta.env.DEV) {
        console.error('Problema con el permiso del usuario en eliminación de usuario.')
      }
      return { error: handleErrorFromServer(permissionVerification.error) }
    }
    try {
      await db.delete(personTable).where(eq(personTable.id, input))
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Eliminación de usuario.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
  },
})
