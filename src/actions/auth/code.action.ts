import { defineAction, type ActionAPIContext } from 'astro:actions'
import { z } from 'astro:schema'
import { and, eq, ne } from 'drizzle-orm'

import { Api, Error } from '~/enums'
import db from '~/db'
import { sessionTable } from '~/db/schema'
import { dayjs, handleErrorFromServer, setUserTokenCookie } from '~/utils'

export const code = defineAction({
  accept: 'json',
  input: z.string().regex(/^[0-9]{6}$/),
  handler: async (input: any, context: ActionAPIContext) => {
    let session
    try {
      const query = await db
        .select({
          id: sessionTable.id,
          personId: sessionTable.personId,
          codeExpiresAt: sessionTable.codeExpiresAt,
          codeIsActive: sessionTable.codeIsActive,
        })
        .from(sessionTable)
        .where(eq(sessionTable.code, input))
      if (query.length === 0) {
        if (import.meta.env.DEV) {
          console.error('Sesión no encontrada.')
        }
        return { error: handleErrorFromServer(Error.CODE_NOT_FOUND, Api.AUTH_VERIFY_CODE) }
      }
      session = query[0]
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Obtener sesión.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
    if (session.codeIsActive === false) {
      if (import.meta.env.DEV) {
        console.error('Sesión ya utilizada.')
      }
      return { error: handleErrorFromServer(Error.CODE_IS_DISABLED, Api.AUTH_VERIFY_CODE) }
    }
    if (dayjs.utc().isAfter(session.codeExpiresAt)) {
      if (import.meta.env.DEV) {
        console.error('Sesión expirada.')
      }
      return { error: handleErrorFromServer(Error.CODE_IS_EXPIRED, Api.AUTH_VERIFY_CODE) }
    }
    /* ↓ Desactivar código y activar sesión */
    try {
      await db
        .update(sessionTable)
        .set({ isActive: true, codeIsActive: false })
        .where(eq(sessionTable.id, session.id))
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Desactivar código y activar sesión.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
    /* ▼ Desactivar las sesiones activas del usuario que excedan las MAX_ACTIVE_SESSIONS más nuevas */
    let sessions
    try {
      sessions = await db
        .select({ id: sessionTable.id })
        .from(sessionTable)
        .where(
          and(
            and(ne(sessionTable.id, session.id), eq(sessionTable.isActive, true)),
            eq(sessionTable.personId, session.personId),
          ),
        )
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Consulta de sesiones.')
      }
      return { error: handleErrorFromServer(Error.DB) }
    }
    if (sessions.length > parseInt(import.meta.env.MAX_ACTIVE_SESSIONS ?? '1')) {
      try {
        await db
          .update(sessionTable)
          .set({ isActive: false })
          .where(
            eq(sessionTable.id, sessions[parseInt(import.meta.env.MAX_ACTIVE_SESSIONS ?? '1')].id),
          )
      } catch {
        if (import.meta.env.DEV) {
          console.error('Error en DB. Desactivar la sesión activa número MAX_ACTIVE_SESSIONS + 1.')
        }
        return { error: handleErrorFromServer(Error.DB) }
      }
    }
    /* ▲ Desactivar las sesiones activas del usuario que excedan las MAX_ACTIVE_SESSIONS más nuevas */
    setUserTokenCookie(context, session.id)
  },
})
