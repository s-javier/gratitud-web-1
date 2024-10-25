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

export default function RoleDeleteRelationPermission(props: {
  isShow: boolean
  close: () => void
  data: {
    roleId: string
    roleTitle: string
    permissionId: string
    permissionType: string
    permissionPath: string
  }
}) {
  const validateRequest = () => {
    if (!props.data?.roleId || !props.data?.permissionId) {
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
        title="Eliminación de relación: Rol - Permiso"
        close={props.close}
        footer={
          <>
            <Button
              variant="outlined"
              sx={{
                color: Color.CANCEL_BTN_TEXT,
                borderColor: Color.CANCEL_BTN_BORDER,
                '&:hover': {
                  backgroundColor: Color.CANCEL_BTN_HOVER_BG,
                  borderColor: Color.CANCEL_BTN_HOVER_BORDER,
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
                backgroundColor: Color.DELETE_BTN_BG,
                color: Color.DELETE_BTN_TEXT,
                '&:hover': {
                  backgroundColor: Color.DELETE_BTN_HOVER_BG,
                },
              }}
              onClick={async () => {
                if (validateRequest() === false) {
                  return
                }
                $loaderOverlay.set(true)
                const { data, error }: any = await actions.roleDeleteRelationPermission({
                  roleId: props.data.roleId ?? '',
                  permissionId: props.data.permissionId ?? '',
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
          El rol <strong>{props.data.roleTitle}</strong> está relacionado con el permiso{' '}
          <strong>
            {props.data.permissionPath} ({props.data.permissionType})
          </strong>
          .
        </p>
        <p class="text-center">¿Estás seguro que deseas eliminar la relación?</p>
      </Dialog>
    </Overlay>
  )
}
