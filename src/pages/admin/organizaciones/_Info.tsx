import { Button } from '@suid/material'

import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'
import { Color } from '~/enums'

export default function OrganizationInfo(props: {
  isShow: boolean
  close: () => void
  data: { id: string; title: string; isActive: boolean }
}) {
  return (
    <Overlay type="dialog" isActive={props.isShow}>
      <Dialog
        title="Organización"
        close={props.close}
        footer={
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
        }
      >
        <div class="mb-4">
          <p class="font-bold">ID</p>
          <p>{props.data.id}</p>
        </div>
        <div class="mb-4">
          <p class="font-bold">Título</p>
          <p>{props.data.title}</p>
        </div>
        <div>
          <p class="font-bold">Activa</p>
          <p>
            {props.data.isActive ? (
              <span class="text-green-500">Sí</span>
            ) : (
              <span class="text-red-500">No</span>
            )}
          </p>
        </div>
      </Dialog>
    </Overlay>
  )
}
