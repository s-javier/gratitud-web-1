import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'

import { Api, CacheData, Error } from '~/enums'
import db from '~/db'
import { organizationTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'
import { cache } from '~/utils/cache'

export const organizationCreate = defineAction({
  accept: 'json',
  input: z.object({
    title: z.string().min(4).max(100),
    isActive: z.boolean(),
  }),
  handler: async (input: any, context: ActionAPIContext) => {
    if (context.locals.userTokenError) {
      if (import.meta.env.DEV) {
        console.error('Problema con el token de usuario en creación de organización.')
      }
      return { error: handleErrorFromServer(context.locals.userTokenError) }
    }
    const permissionVerification = await verifyPermission(
      context.locals.roleId,
      Api.ORGANIZATION_CREATE,
    )
    if (!permissionVerification.isSuccess) {
      if (import.meta.env.DEV) {
        console.error('Problema con el permiso del usuario en creación de organización.')
      }
      return { error: handleErrorFromServer(permissionVerification.error) }
    }
    /******************************/
    try {
      await db.insert(organizationTable).values({
        title: input.title,
        isActive: input.isActive,
      })
      cache.delete(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL }))
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Creación de organización.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
  },
})
