import { Error } from '~/enums'
import { getPermissionsFromDB } from '~/db/queries'

export const verifyPermission = async (
  roleId: string,
  path: string,
): Promise<{ isSuccess: boolean; error?: string }> => {
  try {
    const query = await getPermissionsFromDB(roleId, path)
    if (query.length === 0) {
      if (import.meta.env.DEV) {
        console.error('El usuario no tiene permiso para realizar esta operación.')
      }
      return {
        isSuccess: false,
        error: Error.USER_WITHOUT_PERMISSION,
      }
    }
  } catch {
    if (import.meta.env.DEV) {
      console.error('Error en DB. Verificación de permisos.')
    }
    return {
      isSuccess: false,
      error: Error.DB,
    }
  }
  return {
    isSuccess: true,
  }
}
