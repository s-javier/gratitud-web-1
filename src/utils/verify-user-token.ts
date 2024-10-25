import { and, eq } from 'drizzle-orm'

import { Error } from '~/enums'
import db from '~/db'
import { organizationPersonRoleTable, sessionTable } from '~/db/schema'
import { dayjs } from './dayjs'

export const verifyUserToken = async (context: any): Promise<void> => {
  const userToken = context.cookies.get('token')?.value
  let session
  try {
    const query = await db
      .select({
        personId: sessionTable.personId,
        expiresAt: sessionTable.expiresAt,
        isActive: sessionTable.isActive,
      })
      .from(sessionTable)
      .where(eq(sessionTable.id, userToken))
    if (query.length === 0) {
      if (import.meta.env.DEV) {
        console.error('userToken no encontrado.')
      }
      context.locals.userTokenError = Error.USER_TOKEN_NOT_FOUND
      return
    }
    session = query[0]
  } catch {
    if (import.meta.env.DEV) {
      console.error('Error en DB. Consulta session por userToken.')
    }
    context.locals.userTokenError = Error.DB
    return
  }
  if (session.isActive === false) {
    if (import.meta.env.DEV) {
      console.error('userToken no está activo.')
    }
    context.locals.userTokenError = Error.SESSION_IS_DISABLED
    return
  }
  if (dayjs.utc().isAfter(session.expiresAt)) {
    if (import.meta.env.DEV) {
      console.error('userToken expiró.')
    }
    context.locals.userTokenError = Error.SESSION_IS_EXPIRED
    return
  }
  let userOrgRole
  try {
    const query = await db
      .select({
        organizationId: organizationPersonRoleTable.organizationId,
        roleId: organizationPersonRoleTable.roleId,
      })
      .from(organizationPersonRoleTable)
      .where(
        and(
          eq(organizationPersonRoleTable.personId, session.personId),
          eq(organizationPersonRoleTable.isSelected, true),
        ),
      )
    if (query.length === 0) {
      if (import.meta.env.DEV) {
        console.log('El usuario no está vinculado a una organización ni a un rol.')
      }
      context.locals.userTokenError = Error.ORG_ROLE_NOT_FOUND
      return
    }
    userOrgRole = query[0]
  } catch {
    if (import.meta.env.DEV) {
      console.error('Error en DB. Consulta si usuario está asociado a una organización y un rol.')
    }
    context.locals.userTokenError = Error.DB
    return
  }
  // TODO: Verificar si ip e user_agent de la request coinciden con el de la session
  context.locals.sessionId = userToken ?? ''
  context.locals.userId = session.personId
  context.locals.organizationId = userOrgRole.organizationId
  context.locals.roleId = userOrgRole.roleId
  /* Esto asume que una persona solo puede tener un rol en una organización */
}
