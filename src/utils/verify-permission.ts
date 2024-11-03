import { Error } from '~/enums'
import { getPermissionsFromDB } from '~/db/queries'

export const verifyPermission = async (
  roleId: string,
  path: string,
): Promise<{ isSuccess: boolean; error?: string }> => {
  let query: any[] = []
  try {
    query = await getPermissionsFromDB(roleId)
  } catch {
    if (import.meta.env.DEV) {
      console.error('Error en DB. Verificación de permisos.')
    }
    return {
      isSuccess: false,
      error: Error.DB,
    }
  }
  if (query.length === 0) {
    if (import.meta.env.DEV) {
      console.error('El usuario no tiene permisos asignados.')
    }
    return {
      isSuccess: false,
      error: Error.USER_WITHOUT_PERMISSIONS,
    }
  }
  if (!query.includes(path)) {
    return {
      isSuccess: false,
      error: Error.USER_WITHOUT_PERMISSION,
    }
  }
  return {
    isSuccess: true,
  }
}
