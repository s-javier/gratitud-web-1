import { createSignal, createEffect } from 'solid-js'
import { Button } from '@suid/material'
import AgGridSolid from 'solid-ag-grid'
import { IconButton } from '@suid/material'
import DeleteIcon from '@suid/icons-material/Delete'

import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'
import TableOptions from '~/components/shared/TableOptions'
import DeleteRelationPermission from './_DeleteRelationPermission'

export default function RoleInfo(props: {
  isShow: boolean
  close: () => void
  data: {
    id: string
    title: string
    permissions: { permissionId: string; permissionPath: string; permissionType: string }[]
  }
}) {
  const [table, setTable] = createSignal<any>(null)
  const [rowCount, setRowCount] = createSignal(0)
  const [isFilter, setIsFilter] = createSignal(false)
  const [defaultColDef, setDefaultColDef] = createSignal({
    flex: 1,
    headerClass: 'text-base',
    filter: false,
    floatingFilter: false,
    resizable: false,
  })
  const columnDefs = [
    { field: 'permissionPath', headerName: 'Permiso', minWidth: 250, maxWidth: 250 },
    { field: 'permissionType', headerName: 'Tipo', minWidth: 100 },
    {
      field: 'actions',
      pinned: 'right',
      maxWidth: 60,
      headerComponent: () => {
        return (
          <TableOptions
            positionClass="-ml-2"
            isFilter={isFilter()}
            handleGlobalFilter={(value) => {
              setIsFilter(value)
              setDefaultColDef({
                ...defaultColDef(),
                filter: value,
                floatingFilter: value,
              })
            }}
          />
        )
      },
      cellRenderer: (p: any) => {
        return (
          <div class="flex flex-row justify-center items-center">
            <IconButton
              class="!text-red-500 hover:!text-red-400"
              onClick={() => {
                setPermissionRole({
                  roleId: props.data.id,
                  roleTitle: props.data.title,
                  permissionId: p.data.permissionId,
                  permissionType: p.data.permissionType,
                  permissionPath: p.data.permissionPath,
                })
                setIsDeleteRelationOpen(true)
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        )
      },
      filter: false,
      sortable: false,
    },
  ]
  const [permissionRole, setPermissionRole] = createSignal<any>({})
  const [isDeleteRelationOpen, setIsDeleteRelationOpen] = createSignal(false)

  createEffect(() => {
    setRowCount(props.data.permissions?.length ?? 0)
  })

  return (
    <>
      <DeleteRelationPermission
        isShow={isDeleteRelationOpen()}
        close={() => setIsDeleteRelationOpen(false)}
        data={permissionRole()}
      />
      <Overlay type="dialog" width="max-w-[470px]" isActive={props.isShow}>
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
          <div class="mb-4">
            <p class="font-bold">ID</p>
            <p>{props.data.id}</p>
          </div>
          <div class="mb-8">
            <p class="font-bold">Título</p>
            <p>{props.data.title}</p>
          </div>
          <div class="mb-2">
            <p class="text-sm text-gray-500">Estas viendo {rowCount()} permisos.</p>
          </div>
          <div class="ag-theme-alpine">
            <AgGridSolid
              onGridReady={(params) => {
                setTable(params.api)
              }}
              onFilterChanged={() => {
                setRowCount(table()?.getRenderedNodes().length ?? props.data.permissions.length)
              }}
              // @ts-ignore
              columnDefs={columnDefs}
              rowData={props.data.permissions}
              defaultColDef={defaultColDef()}
              rowSelection="single"
              domLayout="autoHeight"
            />
          </div>
        </Dialog>
      </Overlay>
    </>
  )
}
