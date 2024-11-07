import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'

import { Api, Error } from '~/enums'
import db from '~/db'
import { menuPageTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'

export const menuPageAdd = defineAction({
  accept: 'json',
  input: z.object({
    permissionId: z
      .string()
      .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/),
    title: z.string().min(3).max(50),
    sort: z.number(),
    icon: z.string().min(3).max(50).optional(),
  }),
  handler: async (input: any, context: ActionAPIContext) => {
    if (context.locals.userTokenError) {
      if (import.meta.env.DEV) {
        console.error('Problema con el token de usuario en creación de menuPage.')
      }
      return { error: handleErrorFromServer(context.locals.userTokenError) }
    }
    const permissionVerification = await verifyPermission(
      context.locals.roleId,
      Api.MENU_PAGE_CREATE,
    )
    if (!permissionVerification.isSuccess) {
      if (import.meta.env.DEV) {
        console.error('Problema con el permiso del usuario en creación de menuPage.')
      }
      return { error: handleErrorFromServer(permissionVerification.error) }
    }
    try {
      await db.insert(menuPageTable).values({
        permissionId: input.permissionId,
        title: input.title,
        sort: input.sort,
        icon: input.icon,
      })
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Creación de menuPage.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
  },
})
