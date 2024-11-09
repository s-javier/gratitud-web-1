import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'

import { Api, Error } from '~/enums'
import db from '~/db'
import { organizationPersonRoleTable } from '~/db/schema'
import { handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'

export const userAddRelationOrganizationRole = defineAction({
  accept: 'json',
  input: z.object({
    organizationId: z
      .string()
      .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/),
    userId: z
      .string()
      .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/),
    roleId: z
      .string()
      .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/),
    isVisible: z.boolean(),
  }),
  handler: async (input: any, context: ActionAPIContext) => {
    if (context.locals.userTokenError) {
      if (import.meta.env.DEV) {
        console.error(
          'Problema con el token de usuario en la creación de la relación: organización - usuario - rol.',
        )
      }
      return { error: handleErrorFromServer(context.locals.userTokenError) }
    }
    const permissionVerification = await verifyPermission(
      context.locals.roleId,
      Api.USER_CREATE_RELATION_ORGANIZATION_ROLE,
    )
    if (!permissionVerification.isSuccess) {
      if (import.meta.env.DEV) {
        console.error(
          'Problema con el permiso del usuario en creación de la relación: organización - usuario - rol.',
        )
      }
      return { error: handleErrorFromServer(permissionVerification.error) }
    }
    /******************************/
    try {
      await db.insert(organizationPersonRoleTable).values({
        organizationId: input.organizationId,
        personId: input.userId,
        roleId: input.roleId,
        isVisible: input.isVisible,
        isSelected: false,
      })
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Creación de la relación: organización - usuario - rol.')
      }
      if (err.message.includes('duplicate key value violates unique constraint')) {
        return { error: handleErrorFromServer(Error.ORGANIZATION_USER_ROLE_ALREADY_EXISTS) }
      } else {
        return { error: handleErrorFromServer(Error.DB) }
      }
    }
  },
})
