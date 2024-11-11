import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'
import { eq } from 'drizzle-orm'

import { Api, Error } from '~/enums'
import db from '~/db'
import { menupageTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'

export const menuPageEdit = defineAction({
  accept: 'json',
  input: z.object({
    id: z.string().uuid(),
    permissionId: z
      .string()
      .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/),
    title: z.string().min(3).max(50),
    icon: z.string().min(3).max(50).optional(),
  }),
  handler: async (input: any, context: ActionAPIContext) => {
    if (context.locals.userTokenError) {
      if (import.meta.env.DEV) {
        console.error('Problema con el token de usuario en actualización de menuPage.')
      }
      return { error: handleErrorFromServer(context.locals.userTokenError) }
    }
    const permissionVerification = await verifyPermission(
      context.locals.roleId,
      Api.MENU_PAGE_UPDATE,
    )
    if (!permissionVerification.isSuccess) {
      if (import.meta.env.DEV) {
        console.error('Problema con el permiso del usuario en actualización de menuPage.')
      }
      return { error: handleErrorFromServer(permissionVerification.error) }
    }
    /******************************/
    try {
      await db
        .update(menupageTable)
        .set({
          permissionId: input.permissionId,
          title: input.title,
          icon: input.icon,
        })
        .where(eq(menupageTable.id, input.id))
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Actualización de menuPage.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
  },
})
