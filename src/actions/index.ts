import { login } from './auth/login.action'
import { code } from './auth/code.action'
import { logout } from './auth/sign-out.action'

export const server = {
  login,
  code,
  logout,
}
