import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'

import { Api, Error } from '~/enums'
import db from '~/db'
import { roleTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'

export const roleAdd = defineAction({
  accept: 'json',
  input: z.object({
    title: z.string().min(4).max(50),
  }),
  handler: async (input: any, context: ActionAPIContext) => {
    if (context.locals.userTokenError) {
      if (import.meta.env.DEV) {
        console.error('Problema con el token de usuario en creación de rol.')
      }
      return { error: handleErrorFromServer(context.locals.userTokenError) }
    }
    const permissionVerification = await verifyPermission(context.locals.roleId, Api.ROLE_CREATE)
    if (!permissionVerification.isSuccess) {
      if (import.meta.env.DEV) {
        console.error('Problema con el permiso del usuario en creación de rol.')
      }
      return { error: handleErrorFromServer(permissionVerification.error) }
    }
    try {
      await db.insert(roleTable).values({ title: input.title })
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Creación de rol.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
  },
})
