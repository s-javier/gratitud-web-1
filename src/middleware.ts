import { defineMiddleware, sequence } from 'astro:middleware'
import { asc, eq } from 'drizzle-orm'

import { Error, Page } from '~/enums'
import db from '~/db'
import {
  menuPageTable,
  organizationPersonRoleTable,
  organizationTable,
  permissionTable,
  personTable,
  rolePermissionTable,
} from './db/schema'
import { deleteUserTokenCookie, handleErrorFromServer } from '~/utils'
import { verifyUserToken } from './utils/verify-user-token'
import { verifyPermission } from './utils/verify-permission'

const isPrivatePage = (pathname: string) => {
  /* El startsWith es para que se verifique solo las vista, por esto no sirve el includes */
  if (pathname.startsWith('/admin') || pathname.startsWith('/gratitud')) {
    return true
  }
  return false
}

const auth = defineMiddleware(async (context, next) => {
  if (
    context.url.pathname === Page.SIGN_IN ||
    context.url.pathname === Page.ADMIN_WELCOME ||
    isPrivatePage(context.url.pathname) ||
    context.url.pathname.includes('_server-islands') ||
    context.url.pathname.includes('_actions')
  ) {
    if (!context.cookies.get('token')?.value) {
      if (context.url.pathname === Page.SIGN_IN) {
        return next()
      } else if (isPrivatePage(context.url.pathname)) {
        return context.redirect(Page.SIGN_IN, 302)
      } else {
        context.locals.userTokenError = Error.NOT_USER_TOKEN
        return next()
      }
    }
    await verifyUserToken(context)
    if (context.locals.userTokenError) {
      if (
        [Error.USER_TOKEN_NOT_FOUND, Error.SESSION_IS_DISABLED, Error.SESSION_IS_EXPIRED].includes(
          context.locals.userTokenError as Error,
        )
      ) {
        deleteUserTokenCookie(context)
      }
      if (context.url.pathname === Page.SIGN_IN) {
        return next()
      } else if (isPrivatePage(context.url.pathname)) {
        return context.redirect(Page.SIGN_IN, 302)
      }
    } else {
      if (context.url.pathname === Page.SIGN_IN) {
        return context.redirect(Page.ADMIN_WELCOME, 302)
      }
    }
    /* ↓ Verificación de permisos para vistas */
    if (context.url.pathname !== Page.ADMIN_WELCOME && isPrivatePage(context.url.pathname)) {
      const { isSuccess } = await verifyPermission(context.locals.roleId, context.url.pathname)
      if (!isSuccess) {
        if (import.meta.env.DEV) {
          console.error('Problema con el permiso del usuario en el middleware.')
        }
        return context.redirect(Page.ADMIN_WELCOME, 302)
      }
    }
  }
  return next()
})

const getMenu = defineMiddleware(async (context, next) => {
  if (isPrivatePage(context.url.pathname)) {
    try {
      context.locals.menu = await db
        .select({
          title: menuPageTable.title,
          // sort: menuPageTable.sort,
          icon: menuPageTable.icon,
          path: permissionTable.path,
        })
        .from(menuPageTable)
        .innerJoin(permissionTable, eq(menuPageTable.permissionId, permissionTable.id))
        .innerJoin(rolePermissionTable, eq(permissionTable.id, rolePermissionTable.permissionId))
        .where(eq(rolePermissionTable.roleId, context.locals.roleId))
        .orderBy(asc(menuPageTable.sort))
      if (context.locals.menu.length === 0) {
        if (import.meta.env.DEV) {
          console.error('El usuario no tiene páginas.')
        }
        context.locals.menu = []
      }
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Consulta de páginas del usuario.')
      }
      context.locals.menuErrorHandled = handleErrorFromServer(Error.DB)
      return next()
    }
    /* ▼ Name de usuario */
    try {
      const query = await db
        .select({ name: personTable.name })
        .from(personTable)
        .where(eq(personTable.id, context.locals.userId))
      // if (query.length === 0) {
      //   return error(400, Error.USER_NOT_FOUND)
      // }
      context.locals.user = { name: query[0].name }
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Consulta de usuario. ')
      }
      context.locals.menuErrorHandled = handleErrorFromServer(Error.DB)
    }
    /* ▲ Name de usuario */
    try {
      context.locals.organizations = await db
        .select({
          id: organizationTable.id,
          title: organizationTable.title,
          isSelected: organizationPersonRoleTable.isSelected,
        })
        .from(organizationTable)
        .innerJoin(
          organizationPersonRoleTable,
          eq(organizationTable.id, organizationPersonRoleTable.organizationId),
        )
        .where(eq(organizationPersonRoleTable.personId, context.locals.userId))
      if (context.locals.organizations.length === 0) {
        if (import.meta.env.DEV) {
          console.error('El usuario no tiene organizaciones.')
        }
        context.locals.menuErrorHandled = handleErrorFromServer(Error.USER_WITHOUT_ORGANIZATION)
      }
    } catch {
      if (import.meta.env.DEV) {
        console.error('Error en DB. Consulta de organizaciones del usuario.')
      }
      context.locals.menuErrorHandled = handleErrorFromServer(Error.DB)
    }
  }
  // @ts-ignore
  return next()
})

export const onRequest = sequence(auth, getMenu)
