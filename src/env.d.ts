/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    IsAdminAndWithoutUserTokenAndPermissionsProblems: boolean
    menuErrorHandled: any
    // menu: {
    //   user: {
    //     firstName: string
    //   }
    //   organizations: any[]
    //   pages: any[]
    // }
    user: { firstName: string }
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
