/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    IsAdminAndWithoutUserTokenAndPermissionsProblems: boolean
    menuErrorHandled: any
    user: { name: string }
    organizations: any[]
    menu: any[]
    errorHandled: any
    data: any
    userTokenError: string
    sessionId: string
    userId: string
    organizationId: string
    roleId: string
  }
}
