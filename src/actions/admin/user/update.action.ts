import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'
import { eq } from 'drizzle-orm'

import { Api, CacheData, Error } from '~/enums'
import db from '~/db'
import { personTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'
import { cache } from '~/utils/cache'

export const userUpdate = defineAction({
  accept: 'json',
  input: z.object({
    id: z.string().uuid(),
    name: z.string().min(2).max(100),
    email: z.string().email(),
    isActive: z.boolean(),
  }),
  handler: async (input: any, context: ActionAPIContext) => {
    if (context.locals.userTokenError) {
      if (import.meta.env.DEV) {
        console.error('Problema con el token de usuario en actualización de usuario.')
      }
      return { error: handleErrorFromServer(context.locals.userTokenError) }
    }
    const permissionVerification = await verifyPermission(context.locals.roleId, Api.USER_UPDATE)
    if (!permissionVerification.isSuccess) {
      if (import.meta.env.DEV) {
        console.error('Problema con el permiso del usuario en actualización de usuario.')
      }
      return { error: handleErrorFromServer(permissionVerification.error) }
    }
    /******************************/
    try {
      await db
        .update(personTable)
        .set({
          name: input.name,
          email: input.email,
          isActive: input.isActive,
        })
        .where(eq(personTable.id, input.id))
      cache.delete(JSON.stringify({ data: CacheData.USERS_ALL }))
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Actualización de usuario.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
  },
})
