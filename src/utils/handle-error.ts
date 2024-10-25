import { Api, Error, Page } from '~/enums'
import type { CustomError } from '~/types'

export const handleErrorFromServer = (error: any, apiRoute?: string): CustomError => {
  // console.log('-- handleErrorFromServer --')
  // console.log(error)
  if (!error) {
    return null
  }
  if ([Error.DB].includes(error)) {
    return {
      isNotify: true,
      title: 'Hubo un error',
      message: 'Por favor, inténtalo de nuevo o más tarde.',
    }
  }
  if (
    apiRoute === Api.AUTH_SIGN_IN &&
    [Error.USER_NOT_FOUND, Error.USER_IS_DISABLED].includes(error)
  ) {
    return null
  }
  if (
    apiRoute === Api.AUTH_VERIFY_CODE &&
    [
      Error.CODE_IS_DISABLED,
      Error.CODE_NOT_FOUND,
      Error.CODE_IS_EXPIRED,
      Error.SESSION_IS_DISABLED,
      Error.SESSION_IS_EXPIRED,
    ].includes(error)
  ) {
    return {
      isNotify: true,
      title: 'Código inválido',
      message: 'Reingresa tu email para obtener otro código.',
    }
  }
  if (
    [
      Error.NOT_USER_TOKEN,
      Error.USER_TOKEN_NOT_FOUND,
      Error.SESSION_IS_DISABLED,
      Error.SESSION_IS_EXPIRED,
    ].includes(error)
  ) {
    return {
      isRedirect: true,
      path: Page.SIGN_IN,
    }
  }
  if ([Error.USER_WITHOUT_PERMISSION].includes(error)) {
    return {
      isRedirect: true,
      path: Page.ADMIN_WELCOME,
    }
  }
  if (Error.LANGUAGE_IS_DEFAULT === error) {
    return {
      isNotify: true,
      title: 'Hubo un error',
      message: 'No puedes eliminar un idioma por defecto.',
    }
  }
  if (Error.LANGUAGE_NECESSARY_DEFAULT === error) {
    return {
      isNotify: true,
      title: 'Hubo un error',
      message: 'El idioma que está editando ya no es por defecto. Al menos 1 debe serlo.',
    }
  }
  if (Error.ROLE_PERMISSION_ALREADY_EXISTS === error) {
    return {
      isNotify: true,
      title: 'Hubo un error',
      message: 'La relación rol con permiso ya existe.',
    }
  }
  if (Error.ORGANIZATION_USER_ROLE_ALREADY_EXISTS === error) {
    return {
      isNotify: true,
      title: 'Hubo un error',
      message: 'La relación organización, usuario y rol ya existe.',
    }
  }
  return {
    isNotify: true,
    title: 'Hubo un error',
    message: 'Por favor, inténtalo de nuevo o más tarde.',
  }
  // if (error.code === 'ECONNREFUSED') {
  //   return {
  //     isNotify: true,
  //     message: 'Por favor, verifica tu conexión a internet e intentélo nuevamente.',
  //   }
  // }
  // return {
  //   isData: true,
  //   data: JSON.stringify(error.response?.data),
  // }
}
