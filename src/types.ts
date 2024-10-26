import { Api, Error, Page } from '~/enums'

export type CustomError = {
  isNotify?: boolean
  title?: string
  message?: string
  isRedirect?: boolean
  path?: Page
  code?: string
} | null

export type Organization = {
  id: string
  title: string
  isActive: boolean
}

export type Permission = {
  id: string
  path: string
  type: string
  roles: {
    roleId: string
    roleTitle: string
  }[]
}

export type ViewPage = {
  id: string
  title: string
  isMenu: boolean
  menuTitle?: string
  menuOrder: number
  menuIcon?: string
  path: string
  permissionId: string
}

export type Role = {
  id: string
  title: string
  permissions?: {
    permissionId: string
    permissionPath: string
    permissionType: string
  }[]
}

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  relations: {
    organizationId: string
    organizationTitle: string
    roleId: string
    roleTitle: string
    isVisible: string
  }[]
}

export type Language = {
  id: string
  code: string
  isDefault: boolean
  isActive: boolean
}

export type Branch = {
  id: string
  title: string
  slug: string
  region: number
  comuna: string
  address: string
  imageUrl: string | null
  isActive: boolean
}

export type Rrss = {
  facebook?: string
  instagram?: string
  tiktok?: string
  x?: string
  youtube?: string
} | null
