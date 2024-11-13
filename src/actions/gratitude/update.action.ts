import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'
import { eq } from 'drizzle-orm'

import { Api, Error } from '~/enums'
import db from '~/db'
import { gratitudeTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'

export const gratitudeUpdate = defineAction({
  accept: 'json',
  input: z.object({
    id: z.string().uuid(),
    title: z.string().min(4).max(100).optional(),
    description: z.string().min(4).max(400),
    isMaterialized: z.boolean(),
  }),
  handler: async (input: any, context: ActionAPIContext) => {
    if (context.locals.userTokenError) {
      if (import.meta.env.DEV) {
        console.error('Problema con el token de usuario en actualización de agradecimiento.')
      }
      return { error: handleErrorFromServer(context.locals.userTokenError) }
    }
    const permissionVerification = await verifyPermission(
      context.locals.roleId,
      Api.GRATITUDE_UPDATE,
    )
    if (!permissionVerification.isSuccess) {
      if (import.meta.env.DEV) {
        console.error('Problema con el permiso del usuario en actualización de agradecimiento.')
      }
      return { error: handleErrorFromServer(permissionVerification.error) }
    }
    /******************************/
    try {
      await db
        .update(gratitudeTable)
        .set({
          title: input.title,
          description: input.description,
          isMaterialized: input.isMaterialized,
        })
        .where(eq(gratitudeTable.id, input.id))
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Actualización de agradecimiento.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
  },
})
