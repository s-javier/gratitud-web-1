import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'
import { eq, inArray } from 'drizzle-orm'

import { Api, Error } from '~/enums'
import db from '~/db'
import { gratitudeTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'

export const gratitudeRemind = defineAction({
  accept: 'json',
  input: z.array(z.string().uuid()).min(1),
  handler: async (input: any, context: ActionAPIContext) => {
    if (context.locals.userTokenError) {
      if (import.meta.env.DEV) {
        console.error('Problema con el token de usuario en actualización de recordación.')
      }
      return { error: handleErrorFromServer(context.locals.userTokenError) }
    }
    const permissionVerification = await verifyPermission(
      context.locals.roleId,
      Api.GRATITUDE_UPDATE,
    )
    if (!permissionVerification.isSuccess) {
      if (import.meta.env.DEV) {
        console.error('Problema con el permiso del usuario en actualización de recordación.')
      }
      return { error: handleErrorFromServer(permissionVerification.error) }
    }
    try {
      await db
        .update(gratitudeTable)
        .set({
          isRemind: true,
        })
        .where(inArray(gratitudeTable.id, input))
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Actualización de recordación.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
  },
})
