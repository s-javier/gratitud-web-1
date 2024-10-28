import { defineAction, type ActionAPIContext } from 'astro:actions'
import { eq } from 'drizzle-orm'

import { Api, Error } from '~/enums'
import db from '~/db'
import { sessionTable } from '~/db/schema'
import { deleteUserTokenCookie, handleErrorFromServer } from '~/utils'
import { verifyPermission } from '~/utils/verify-permission'

export const logout = defineAction({
  handler: async (context: ActionAPIContext) => {
    if (context.locals.userTokenError) {
      if (import.meta.env.DEV) {
        console.error('Problema con el token de usuario en el cierre de sesión.')
      }
      return { error: handleErrorFromServer(context.locals.userTokenError) }
    }
    const permissionVerification = await verifyPermission(context.locals.roleId, Api.AUTH_SIGN_OUT)
    if (!permissionVerification.isSuccess) {
      if (import.meta.env.DEV) {
        console.error('Problema con el permiso del usuario en el cierre de sesión.')
      }
      return { error: handleErrorFromServer(permissionVerification.error) }
    }
    try {
      await db
        .update(sessionTable)
        .set({ isActive: false })
        .where(eq(sessionTable.id, context.locals.sessionId))
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Cierre de sesión.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
    deleteUserTokenCookie(context)
  },
})
