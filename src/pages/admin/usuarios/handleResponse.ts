import { navigate } from 'astro:transitions/client'
import { toast } from 'solid-sonner'

import { Page } from '~/enums'

export default () => {
  toast.dismiss()
  navigate(Page.ADMIN_USERS, { history: 'replace' })
}
