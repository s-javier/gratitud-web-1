import { createEffect, createSignal } from 'solid-js'
import { Portal } from 'solid-js/web'
import { IconButton } from '@suid/material'
import AgGridSolid from 'solid-ag-grid'
import { Icon } from '@iconify-icon/solid'

import TableOptions from '~/components/shared/TableOptions'
import DeleteRole from './_DeleteRole'

export default function PermissionInfoRoles(props: {
  permission: { id: string; type: string; path: string }
  roles: any[]
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
                  permission: {
                    id: props.permission.id,
                    type: props.permission.type,
                    path: props.permission.path,
                  },
                  role: {
                    id: p.data.roleId,
                    title: p.data.roleTitle,
                  },
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
    setRowCount(props.roles?.length ?? 0)
  })

  return (
    <>
      <Portal>
        <DeleteRole
          isShow={isDeleteRelationOpen()}
          close={() => setIsDeleteRelationOpen(false)}
          data={rolePermission()}
        />
      </Portal>
      <div class="mb-2">
        <p class="text-sm text-gray-500">Estás viendo {rowCount()} roles.</p>
      </div>
      <div class="ag-theme-alpine">
        <AgGridSolid
          onGridReady={(params) => {
            setTable(params.api)
          }}
          onFilterChanged={() => {
            setRowCount(table()?.getRenderedNodes().length ?? props.roles.length)
          }}
          // @ts-ignore
          columnDefs={columnDefs}
          rowData={props.roles}
          defaultColDef={defaultColDef()}
          rowSelection="single"
          domLayout="autoHeight"
        />
      </div>
    </>
  )
}
