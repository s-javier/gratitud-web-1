import { actions } from 'astro:actions'
import { createRoot } from 'solid-js'
import { Button } from '@suid/material'
import { toast } from 'solid-sonner'

import { validateResponse } from '~/utils'
import handleResponse from './handleResponse'
import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'
import CustomToaster from '~/components/shared/CustomToaster'
import { $loaderOverlay } from '~/stores'

export default function GratitudeDelete(props: {
  isShow: boolean
  close: () => void
  data: { id: string; title: string; description: string }
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
              class={[
                '!text-gray-700 !border-gray-300 hover:!bg-gray-50',
                'hover:!border-[var(--o-btn-cancel-border-hover-color)]',
              ].join(' ')}
              onClick={props.close}
            >
              Cerrar
            </Button>
            <Button
              variant="contained"
              class="!text-white !bg-red-500 hover:!bg-red-400 !font-bold"
              onClick={async () => {
                if (validateRequest() === false) {
                  return
                }
                $loaderOverlay.set(true)
                const { data, error }: any = await actions.gratitudeDelete(props.data.id ?? '')
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
        {props.data.title ? (
          <p class="text-center">
            ¿Estás seguro que deseas eliminar el agradecimiento con título{' '}
            <span class="font-bold">{props.data.title}</span> cuya descripción es "
            <span class="font-bold">{props.data.description}"</span>?
          </p>
        ) : (
          <p class="text-center">
            ¿Estás seguro que deseas eliminar el agradecimiento "
            <span class="font-bold">{props.data.description}</span>"?
          </p>
        )}
      </Dialog>
    </Overlay>
  )
}
