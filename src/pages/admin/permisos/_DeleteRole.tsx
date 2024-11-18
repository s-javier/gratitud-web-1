import { actions } from 'astro:actions'
import { createRoot } from 'solid-js'
import { Button } from '@suid/material'
import { toast } from 'solid-sonner'

import { validateResponse } from '~/utils'
import { $loaderOverlay } from '~/stores'
import handleResponse from './handleResponse'
import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'
import CustomToaster from '~/components/shared/CustomToaster'

export default function PermissionDeleteRelationRole(props: {
  isShow: boolean
  close: () => void
  data: {
    permission: {
      id: string
      type: string
      path: string
    }
    role: {
      id: string
      title: string
    }
  }
}) {
  const validateRequest = () => {
    if (!props.data?.role?.id || !props.data?.permission?.id) {
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
        title="Eliminación de relación: Permiso - Rol"
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
                const { data, error }: any = await actions.roleDeletePermission({
                  roleId: props.data.role.id ?? '',
                  permissionId: props.data.permission.id ?? '',
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
          El permiso{' '}
          <strong>
            {props.data.permission?.path} ({props.data.permission?.type})
          </strong>{' '}
          está relacionado con el rol <strong>{props.data.role?.title}</strong>.
        </p>
        <p class="text-center">¿Estás seguro que deseas eliminar la relación?</p>
      </Dialog>
    </Overlay>
  )
}
