import { actions } from 'astro:actions'
import { createRoot } from 'solid-js'
import { Button } from '@suid/material'
import { toast } from 'solid-sonner'

import { Color } from '~/enums'
import { validateResponse } from '~/utils'
import handleResponse from './handleResponse'
import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'
import CustomToaster from '~/components/shared/CustomToaster'
import { $loaderOverlay } from '~/stores'

export default function OrganizationDelete(props: {
  isShow: boolean
  close: () => void
  data: { id: string; title: string }
}) {
  const validateRequest = () => {
    if (!props.data?.id) {
      toast.custom(
        (t) =>
          createRoot(() => (
            <CustomToaster
              id={t}
              type="error"
              title="Hubo un error"
              description="Por favor, inténtalo nuevamente o más tarde."
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

  return (
    <Overlay type="dialog" isActive={props.isShow}>
      <Dialog
        title="Eliminación de organización"
        close={props.close}
        footer={
          <>
            <Button
              variant="outlined"
              sx={{
                color: Color.BTN_CANCEL_TEXT,
                borderColor: Color.BTN_CANCEL_BORDER,
                '&:hover': {
                  backgroundColor: Color.BTN_CANCEL_BG_HOVER,
                  borderColor: Color.BTN_CANCEL_BORDER_HOVER,
                },
              }}
              onClick={props.close}
            >
              Cerrar
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{
                backgroundColor: Color.BTN_DELETE_BG,
                color: Color.BTN_DELETE_TEXT,
                '&:hover': {
                  backgroundColor: Color.BTN_DELETE_BG_HOVER,
                },
              }}
              onClick={async () => {
                if (validateRequest() === false) {
                  return
                }
                $loaderOverlay.set(true)
                const { data, error }: any = await actions.organizationDelete(props.data.id ?? '')
                if (validateResponse(error || data?.error || null) === false) {
                  $loaderOverlay.set(false)
                  return
                }
                handleResponse()
              }}
            >
              Sí, eliminar
            </Button>
          </>
        }
      >
        <p class="text-center">
          ¿Estás seguro que deseas eliminar la organización{' '}
          <span class="font-bold">{props.data.title}</span>?
        </p>
      </Dialog>
    </Overlay>
  )
}
