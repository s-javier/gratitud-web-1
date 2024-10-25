import 'dotenv/config'
// @ts-ignore
import { drizzle } from 'drizzle-orm/connect'

import {
  menuPageTable,
  organizationPersonRoleTable,
  organizationTable,
  permissionTable,
  personTable,
  rolePermissionTable,
  roleTable,
} from './schema'
import { Api, Page } from '../enums'

async function main() {
  const db = await drizzle('node-postgres', process.env.DB_URL!)

  const rootOrganizationId = '793158ce-660e-404a-a5db-9ed5b6deec13'
  const rootUserId = '7b407a72-769c-4e8b-b0e8-4611c6c65b87'
  const superadminRoleId = '88f6af71-5675-4d8e-8ec6-7523b154bb8a'
  const administratorRoleId = 'f972309c-8c6b-48db-b83b-753d5bd2a099'
  await db.insert(organizationTable).values({
    id: rootOrganizationId,
    title: 'Admin',
    isActive: true,
    slug: 'admin',
  })
  await db.insert(personTable).values({
    id: rootUserId,
    firstName: 'Javier',
    lastName: 'Salamanca',
    email: 'javier.salamanca.candia@gmail.com',
    isActive: true,
  })
  await db.insert(roleTable).values([
    { id: superadminRoleId, title: 'Súperadmin' },
    { id: administratorRoleId, title: 'Admin' },
  ])
  await db.insert(organizationPersonRoleTable).values({
    organizationId: rootOrganizationId,
    personId: rootUserId,
    roleId: superadminRoleId,
    isSelected: true,
    isVisible: true,
  })

  const permissionOrganizationChangeId = 'e992ec03-72ba-4b5d-89fe-86bc96473623'
  const permissionAdminOrganizationId = 'cce180eb-1b1e-4077-afd9-933a892db6a7'
  const permissionAdminRolesId = '2b0d1f01-d04e-4410-b926-d0b2b322dd27'
  const permissionAdminUsersId = '77e71a14-4abf-4229-b082-eb2d8c67762e'
  const permissionAdminPermissionsId = '75f99f87-9a29-44b3-9e2d-141a244735cf'
  const permissionAdminPagesId = '25825194-4f17-4767-96f8-bebde4305d76'

  const permissions: (typeof permissionTable.$inferInsert)[] = [
    { id: permissionAdminOrganizationId, type: 'view', path: Page.ADMIN_ORGANIZATIONS },
    { id: permissionAdminRolesId, type: 'view', path: Page.ADMIN_ROLES },
    { id: permissionAdminUsersId, type: 'view', path: Page.ADMIN_USERS },
    { id: permissionAdminPermissionsId, type: 'view', path: Page.ADMIN_PERMISSIONS },
    { id: permissionAdminPagesId, type: 'view', path: Page.ADMIN_MENU_PAGES },

    { type: 'api', path: Api.ORGANIZATION_ALL },
    { type: 'api', path: Api.ORGANIZATION_CREATE },
    { type: 'api', path: Api.ORGANIZATION_DELETE },
    { type: 'api', path: Api.ORGANIZATION_UPDATE },
    { id: permissionOrganizationChangeId, type: 'api', path: Api.ORGANIZATION_CHANGE },

    { type: 'api', path: Api.ROLE_ALL },
    { type: 'api', path: Api.ROLE_CREATE },
    { type: 'api', path: Api.ROLE_CREATE_RELATION_PERMISSION },
    { type: 'api', path: Api.ROLE_DELETE },
    { type: 'api', path: Api.ROLE_DELETE_RELATION_PERMISSION },
    { type: 'api', path: Api.ROLE_UPDATE },

    { type: 'api', path: Api.USER_ALL },
    { type: 'api', path: Api.USER_CREATE },
    { type: 'api', path: Api.USER_CREATE_RELATION_ORGANIZATION_ROLE },
    { type: 'api', path: Api.USER_DELETE },
    { type: 'api', path: Api.USER_DELETE_RELATION_ORGANIZATION_ROLE },
    { type: 'api', path: Api.USER_UPDATE },
    { type: 'api', path: Api.USER_UPDATE_RELATION_ORGANIZATION_ROLE_VISIBILITY },

    { type: 'api', path: Api.PERMISSION_ALL },
    { type: 'api', path: Api.PERMISSION_CREATE },
    { type: 'api', path: Api.PERMISSION_DELETE },
    { type: 'api', path: Api.PERMISSION_UPDATE },

    { type: 'api', path: Api.MENU_PAGE_ALL },
    { type: 'api', path: Api.MENU_PAGE_CREATE },
    { type: 'api', path: Api.MENU_PAGE_DELETE },
    { type: 'api', path: Api.MENU_PAGE_UPDATE },
  ]

  /* ▼ Inserciones en tablas: permission y role_permission */
  const permissionsInserted = await db
    .insert(permissionTable)
    .values(permissions)
    .returning({ insertedPermissionId: permissionTable.id })
  const roleAndPermissionsToInsert = permissionsInserted.map((permission: any) => ({
    roleId: superadminRoleId,
    permissionId: permission.insertedPermissionId,
  }))
  await db.insert(rolePermissionTable).values(roleAndPermissionsToInsert)
  /* ▲ Inserciones en tablas: permission y role_permission */

  /* ↓ Inserciones en tablas: menu_page */
  await db.insert(menuPageTable).values([
    {
      permissionId: permissionAdminOrganizationId,
      title: 'Organizaciones',
      sort: 1,
      icon: 'mdi:home-city-outline',
    },
    {
      permissionId: permissionAdminRolesId,
      title: 'Roles',
      sort: 2,
      icon: 'mdi:card-account-details',
    },
    {
      permissionId: permissionAdminPermissionsId,
      title: 'Permisos',
      sort: 3,
      icon: 'mdi:lock',
    },
    {
      permissionId: permissionAdminUsersId,
      title: 'Usuarios',
      sort: 4,
      icon: 'mdi:account-group',
    },
    {
      permissionId: permissionAdminPagesId,
      title: 'Páginas de menú',
      sort: 5,
      icon: 'mdi:file-document-multiple-outline',
    },
  ])
}

main()

/* bun tsx src/db/populate.ts */
