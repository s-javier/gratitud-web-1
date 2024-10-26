import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'
import { and, eq } from 'drizzle-orm'

import { Api, Error } from '~/enums'
import db from '~/db'
import { organizationPersonRoleTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'

export const organizationChange = defineAction({
  accept: 'json',
  input: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/),
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
  },
})
