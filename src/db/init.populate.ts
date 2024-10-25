import 'dotenv/config'
import { drizzle } from 'drizzle-orm/connect'
import { eq } from 'drizzle-orm'

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

  await db.insert(menuPageTable).values([
    {
      permissionId: '500d8f84-51c4-4ffb-8cdb-5925cfe1dab0',
      title: 'Idiomas',
      sort: 1,
      icon: 'mdi:translate',
    },
    {
      permissionId: '5412aed7-2932-4e4b-875d-cbb21a1acc4c',
      title: 'Empresa',
      sort: 2,
      icon: 'mdi:domain',
    },
    {
      permissionId: '801c1b92-72ea-4091-a819-12013319e4a1',
      title: 'Sucursales',
      sort: 3,
      icon: 'mdi:store',
    },
    {
      permissionId: '39ded382-d06c-4632-87c9-e8570bbce176',
      title: 'Secciones',
      sort: 4,
      icon: 'mdi:book-outline',
    },
    {
      permissionId: '9706f435-25a0-491e-9112-d83d8436cc90',
      title: 'Categorías',
      sort: 5,
      icon: 'mdi:label',
    },
    {
      permissionId: 'c63fff37-3838-4ace-9540-c87d314d9306',
      title: 'Productos',
      sort: 6,
      icon: 'mdi:food-fork-drink',
    },
    {
      permissionId: '753a454a-c0ea-422e-b12e-31f3134914f7',
      title: 'QRs',
      sort: 7,
      icon: 'mdi:qrcode',
    },
    {
      permissionId: '37b83e49-d867-4efa-bcbe-1753302e6056',
      title: 'Reservas',
      sort: 8,
      icon: 'mdi:calendar',
    },
    {
      permissionId: 'cb8d59f0-7b46-429f-8369-9800c91f93fc',
      title: 'Configuración de reservas',
      sort: 9,
      icon: 'mdi:cog',
    },
  ])
}

main()

/* bun tsx src/db/populate.ts */
