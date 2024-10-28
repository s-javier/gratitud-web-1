import { navigate } from 'astro:transitions/client'
import { toast } from 'solid-sonner'

import { Page } from '~/enums'

export default () => {
  toast.dismiss()
  navigate(Page.GRATITUDE_MY, { history: 'replace' })
}
