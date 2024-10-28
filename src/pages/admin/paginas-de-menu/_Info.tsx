import { Button } from '@suid/material'
import { Icon } from '@iconify-icon/solid'

import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'

export default function RoleInfo(props: {
  isShow: boolean
  close: () => void
  data: {
    title: string
    path: string
    sort: string
    icon: string
  }
}) {
  return (
    <Overlay type="dialog" isActive={props.isShow}>
      <Dialog
        title="Página de menú"
        close={props.close}
        footer={
          <Button
            variant="outlined"
            class={[
              '!m-auto',
              '!text-gray-700 !border-gray-300 hover:!bg-gray-50',
              'hover:!border-[var(--o-btn-cancel-border-hover-color)]',
            ].join(' ')}
            onClick={props.close}
          >
            Cerrar
          </Button>
        }
      >
        <div class="mb-4">
          <p class="font-bold">Título</p>
          <p>{props.data.title}</p>
        </div>
        <div class="mb-4">
          <p class="font-bold">Ruta</p>
          <p>{props.data.path}</p>
        </div>
        <div class="mb-4">
          <p class="font-bold">Posición en el menú</p>
          <p>{props.data.sort}</p>
        </div>
        <div class="mb-4">
          <p class="font-bold">Ícono</p>
          <p>
            {props.data.icon ? (
              <Icon
                icon={props.data.icon as string}
                width="100%"
                class="w-5 text-gray-400 left-5 absolute o-active"
              />
            ) : (
              <span class="text-gray-400">Sin ícono</span>
            )}
          </p>
        </div>
      </Dialog>
    </Overlay>
  )
}
