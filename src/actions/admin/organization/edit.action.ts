import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'
import { eq } from 'drizzle-orm'

import { Api, Error } from '~/enums'
import db from '~/db'
import { organizationTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'

export const organizationEdit = defineAction({
  accept: 'json',
  input: z.object({
    id: z.string().uuid(),
    title: z.string().min(1).min(4).max(100),
    isActive: z.boolean(),
  }),
  handler: async (input: any, context: ActionAPIContext) => {
    if (context.locals.userTokenError) {
      if (import.meta.env.DEV) {
        console.error('Problema con el token de usuario en actualización de organización.')
      }
      return { error: handleErrorFromServer(context.locals.userTokenError) }
    }
    const permissionVerification = await verifyPermission(
      context.locals.roleId,
      Api.ORGANIZATION_UPDATE,
    )
    if (!permissionVerification.isSuccess) {
      if (import.meta.env.DEV) {
        console.error('Problema con el permiso del usuario en actualización de organización.')
      }
      return { error: handleErrorFromServer(permissionVerification.error) }
    }
    try {
      await db
        .update(organizationTable)
        .set({
          title: input.title,
          isActive: input.isActive,
        })
        .where(eq(organizationTable.id, input.id))
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Actualización de organización.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
  },
})
