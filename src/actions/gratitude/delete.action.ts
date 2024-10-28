import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'
import { eq } from 'drizzle-orm'

import { Api, Error } from '~/enums'
import db from '~/db'
import { gratitudeTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'

export const gratitudeDelete = defineAction({
  accept: 'json',
  input: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/),
  handler: async (input: any, context: ActionAPIContext) => {
    if (context.locals.userTokenError) {
      if (import.meta.env.DEV) {
        console.error('Problema con el token de usuario en eliminación de agradecimiento.')
      }
      return { error: handleErrorFromServer(context.locals.userTokenError) }
    }
    const permissionVerification = await verifyPermission(
      context.locals.roleId,
      Api.GRATITUDE_DELETE,
    )
    if (!permissionVerification.isSuccess) {
      if (import.meta.env.DEV) {
        console.error('Problema con el permiso del usuario en eliminación de agradecimiento.')
      }
      return { error: handleErrorFromServer(permissionVerification.error) }
    }
    try {
      await db.delete(gratitudeTable).where(eq(gratitudeTable.id, input))
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Eliminación de agradecimiento.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
  },
})