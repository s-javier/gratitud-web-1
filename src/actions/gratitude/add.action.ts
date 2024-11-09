import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'

import { Api, Error } from '~/enums'
import db from '~/db'
import { gratitudeTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'

export const gratitudeAdd = defineAction({
  accept: 'json',
  input: z.object({
    title: z.string().min(4).max(100).optional(),
    description: z.string().min(4).max(400),
    isMaterialized: z.boolean(),
  }),
  handler: async (input: any, context: ActionAPIContext) => {
    if (context.locals.userTokenError) {
      if (import.meta.env.DEV) {
        console.error('Problema con el token de usuario en creación de agradecimiento.')
      }
      return { error: handleErrorFromServer(context.locals.userTokenError) }
    }
    const permissionVerification = await verifyPermission(
      context.locals.roleId,
      Api.GRATITUDE_CREATE,
    )
    if (!permissionVerification.isSuccess) {
      if (import.meta.env.DEV) {
        console.error('Problema con el permiso del usuario en creación de agradecimiento.')
      }
      return { error: handleErrorFromServer(permissionVerification.error) }
    }
    /******************************/
    try {
      await db.insert(gratitudeTable).values({
        personId: context.locals.userId,
        title: input.title,
        description: input.description,
        isMaterialized: input.isMaterialized,
      })
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Creación de agradecimiento.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
  },
})
