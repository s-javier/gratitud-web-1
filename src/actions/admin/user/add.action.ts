import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'

import { Api, Error } from '~/enums'
import db from '~/db'
import { personTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'

export const userAdd = defineAction({
  accept: 'json',
  input: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    isActive: z.boolean(),
  }),
  handler: async (input: any, context: ActionAPIContext) => {
    if (context.locals.userTokenError) {
      if (import.meta.env.DEV) {
        console.error('Problema con el token de usuario en creación de usuario.')
      }
      return { error: handleErrorFromServer(context.locals.userTokenError) }
    }
    const permissionVerification = await verifyPermission(context.locals.roleId, Api.USER_CREATE)
    if (!permissionVerification.isSuccess) {
      if (import.meta.env.DEV) {
        console.error('Problema con el permiso del usuario en creación de usuario.')
      }
      return { error: handleErrorFromServer(permissionVerification.error) }
    }
    /******************************/
    try {
      await db.insert(personTable).values({
        name: input.name,
        email: input.email,
        isActive: input.isActive,
      })
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Creación de usuario.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
  },
})
