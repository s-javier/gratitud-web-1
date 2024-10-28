import { navigate } from 'astro:transitions/client'
import { toast } from 'solid-sonner'

import { Page } from '~/enums'

export default () => {
  toast.dismiss()
  navigate(Page.GRATITUDE_ASK_AND_YOU_SHALL_RECEIVE, { history: 'replace' })
}
