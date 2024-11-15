import { createEffect, createSignal } from 'solid-js'
import { Portal } from 'solid-js/web'
import { IconButton } from '@suid/material'
import AgGridSolid from 'solid-ag-grid'
import { Icon } from '@iconify-icon/solid'

import TableOptions from '~/components/shared/TableOptions'
import DeletePermission from './_DeletePermission'

export default function RoleInfoApi(props: { id: string; title: string; permissions: any[] }) {
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
    { field: 'permissionPath', headerName: 'Permiso' },
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
                  roleId: props.id,
                  roleTitle: props.title,
                  permissionId: p.data.permissionId,
                  permissionType: 'api',
                  permissionPath: p.data.permissionPath,
                })
                setIsDeleteRelationOpen(true)
              }}
            >
              <Icon icon="mdi:delete" width="100%" class="w-6" />
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
    setRowCount(props.permissions?.length ?? 0)
  })

  return (
    <>
      <Portal>
        <DeletePermission
          isShow={isDeleteRelationOpen()}
          close={() => setIsDeleteRelationOpen(false)}
          data={permissionRole()}
        />
      </Portal>
      <p class="mb-2 text-sm text-gray-500">Estas viendo {rowCount()} permisos.</p>
      <div class="ag-theme-alpine">
        <AgGridSolid
          onGridReady={(params) => {
            setTable(params.api)
          }}
          onFilterChanged={() => {
            setRowCount(table()?.getRenderedNodes().length ?? props.permissions.length)
          }}
          // @ts-ignore
          columnDefs={columnDefs}
          rowData={props.permissions}
          defaultColDef={defaultColDef()}
          rowSelection="single"
          domLayout="autoHeight"
        />
      </div>
    </>
  )
}
