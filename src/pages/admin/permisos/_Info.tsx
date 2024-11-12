import { createSignal, createEffect } from 'solid-js'
import { Button } from '@suid/material'
import AgGridSolid from 'solid-ag-grid'
import { IconButton } from '@suid/material'
import { Icon } from '@iconify-icon/solid'
import DeleteRelationRole from './_DeleteRelationRole'

import Dialog from '~/components/shared/Dialog'
import Overlay from '~/components/shared/Overlay'
import TableOptions from '~/components/shared/TableOptions'

export default function RoleInfo(props: {
  isShow: boolean
  close: () => void
  data: { id: string; path: string; type: string; roles: { roleId: string; roleTitle: string }[] }
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
    { field: 'roleTitle', headerName: 'Rol', minWidth: 250, maxWidth: 250 },
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
                setRolePermission({
                  roleId: p.data.roleId,
                  roleTitle: p.data.roleTitle,
                  permissionId: props.data.id,
                  permissionType: props.data.type,
                  permissionPath: props.data.path,
                })
                setIsDeleteRelationOpen(true)
              }}
            >
              <Icon icon="mdi:trash" width="100%" class="w-6" />
            </IconButton>
          </div>
        )
      },
      filter: false,
      sortable: false,
    },
  ]
  const [rolePermission, setRolePermission] = createSignal<any>({})
  const [isDeleteRelationOpen, setIsDeleteRelationOpen] = createSignal(false)

  createEffect(() => {
    setRowCount(props.data.roles?.length ?? 0)
  })

  return (
    <>
      <DeleteRelationRole
        isShow={isDeleteRelationOpen()}
        close={() => setIsDeleteRelationOpen(false)}
        data={rolePermission()}
      />
      <Overlay type="dialog" width="max-w-[346px]" isActive={props.isShow}>
        <Dialog
          title="Permiso"
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
          <div class="mb-4">
            <p class="font-bold">Ruta</p>
            <p>{props.data.path}</p>
          </div>
          <div class="mb-8">
            <p class="font-bold">Tipo</p>
            <p>{props.data.type}</p>
          </div>
          <div class="mb-2">
            <p class="text-sm text-gray-500">Estas viendo {rowCount()} roles.</p>
          </div>
          <div class="ag-theme-alpine">
            <AgGridSolid
              onGridReady={(params) => {
                setTable(params.api)
              }}
              onFilterChanged={() => {
                setRowCount(table()?.getRenderedNodes().length ?? props.data.roles.length)
              }}
              // @ts-ignore
              columnDefs={columnDefs}
              rowData={props.data.roles}
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
