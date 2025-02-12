import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'
import { and, eq } from 'drizzle-orm'

import { Api, CacheData, Error } from '~/enums'
import db from '~/db'
import { organizationPersonRoleTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'
import { cache } from '~/utils/cache'

export const organizationChange = defineAction({
  accept: 'json',
  input: z.string().uuid(),
  handler: async (input: any, context: ActionAPIContext) => {
    if (context.locals.userTokenError) {
      if (import.meta.env.DEV) {
        console.error('Problema con el token de usuario en cambio de organización.')
      }
      return { error: handleErrorFromServer(context.locals.userTokenError) }
    }
    const permissionVerification = await verifyPermission(
      context.locals.roleId,
      Api.ORGANIZATION_CHANGE,
    )
    if (!permissionVerification.isSuccess) {
      if (import.meta.env.DEV) {
        console.error('Problema con el permiso del usuario en cambio de organización.')
      }
      return { error: handleErrorFromServer(permissionVerification.error) }
    }
    /******************************/
    if (context.locals.organizationId === input) {
      return
    }
    try {
      const query = await db
        .select({ isSelected: organizationPersonRoleTable.isSelected })
        .from(organizationPersonRoleTable)
        .where(
          and(
            eq(organizationPersonRoleTable.organizationId, input),
            eq(organizationPersonRoleTable.personId, context.locals.userId),
          ),
        )
      if (query.length === 0) {
        if (import.meta.env.DEV) {
          console.error('El usuario no pertenece a la organización que desea cambiarse.')
        }
        return { error: handleErrorFromServer(Error.USER_NOT_ASSOCIATED_CHANGE_ORGANIZATION) }
      }
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Consulta de relación de usuario con organización.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
    try {
      await db
        .update(organizationPersonRoleTable)
        .set({ isSelected: true })
        .where(
          and(
            eq(organizationPersonRoleTable.organizationId, input),
            eq(organizationPersonRoleTable.personId, context.locals.userId),
          ),
        )
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Actualización de nueva selección usuario-organización.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
    try {
      await db
        .update(organizationPersonRoleTable)
        .set({ isSelected: false })
        .where(
          and(
            eq(organizationPersonRoleTable.organizationId, context.locals.organizationId),
            eq(organizationPersonRoleTable.personId, context.locals.userId),
          ),
        )
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Actualización de vieja selección usuario-organización.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
    cache.delete(JSON.stringify({ data: CacheData.PERMISSIONS, roleId: context.locals.roleId }))
    cache.delete(JSON.stringify({ data: CacheData.MENU, roleId: context.locals.roleId }))
    cache.delete(
      JSON.stringify({ data: CacheData.ORGANIZATIONS_TO_CHANGE, userId: context.locals.userId }),
    )
  },
})
