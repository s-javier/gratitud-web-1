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

export default function UserDeleteRelation(props: {
  isShow: boolean
  close: () => void
  data: {
    organizationId: string
    organizationTitle: string
    userId: string
    userName: string
    roleId: string
    roleTitle: string
  }
}) {
  const validateRequest = () => {
    if (!props.data?.organizationId || !props.data?.userId || !props.data?.roleId) {
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
    <Overlay type="dialog" isActive={props.isShow} zIndex="z-[1500]">
      <Dialog
        title="Eliminación de relación: Organización - Usuario - Rol"
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
                const { data, error }: any = await actions.userDeleteRelationOrganizationRole({
                  organizationId: props.data.organizationId ?? '',
                  userId: props.data.userId ?? '',
                  roleId: props.data.roleId ?? '',
                })
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
        <p class="text-center mb-4">
          La organización <strong>{props.data.organizationTitle}</strong> está relacionada con el{' '}
          usuario <strong>{props.data.userName}</strong> y el rol{' '}
          <strong>{props.data.roleTitle}</strong>.
        </p>
        <p class="text-center">¿Estás seguro que deseas eliminar la relación?</p>
      </Dialog>
    </Overlay>
  )
}
