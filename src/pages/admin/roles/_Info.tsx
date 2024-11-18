import { Button } from '@suid/material'

import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'
import InfoPermissionView from './_InfoPermissionView'
import InfoPermissionApi from './_InfoPermissionApi'

export default function RoleInfo(props: {
  isShow: boolean
  close: () => void
  data: {
    id: string
    title: string
    permissions: {
      view: { permissionId: string; permissionPath: string }[]
      api: { permissionId: string; permissionPath: string }[]
    }
  }
}) {
  return (
    <>
      <Overlay type="dialog" width="max-w-[570px]" isActive={props.isShow}>
        <Dialog
          title="Rol"
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
          <div class="space-y-4 mb-8">
            <div class="">
              <p class="font-bold">ID</p>
              <p>{props.data.id}</p>
            </div>
            <div class="">
              <p class="font-bold">Título</p>
              <p>{props.data.title}</p>
            </div>
          </div>
          <div class="mb-8">
            <h2 class="mb-3 text-lg font-bold">Vistas</h2>
            <InfoPermissionView
              id={props.data.id}
              title={props.data.title}
              permissions={props.data.permissions?.view}
            />
          </div>
          <div>
            <h2 class="mb-3 text-lg font-bold">API</h2>
            <InfoPermissionApi
              id={props.data.id}
              title={props.data.title}
              permissions={props.data.permissions?.api}
            />
          </div>
        </Dialog>
      </Overlay>
    </>
  )
}
