import { navigate } from 'astro:transitions/client'
import { createRoot } from 'solid-js'
import { toast } from 'solid-sonner'

import type { CustomError } from '~/types'
import CustomToaster from '~/components/shared/CustomToaster'

export const validateResponse = (error: CustomError): boolean => {
  if (!error) {
    return true
  }
  if (error.isNotify) {
    toast.custom(
      (t) =>
        createRoot(() => (
          <CustomToaster id={t} type="error" title={error.title} description={error.message} />
        )),
      {
        duration: 5000,
      },
    )
    return false
  }
  if (error.isRedirect) {
    navigate(error.path!, { history: 'replace' })
    return false
  }
  if (error.code) {
    toast.custom(
      (t) =>
        createRoot(() => (
          <CustomToaster
            id={t}
            type="error"
            title="Hubo un error"
            description="Por favor, inténtalo de nuevo o más tarde."
          />
        )),
      {
        duration: 5000,
      },
    )
    return false
  }
  return true
}
