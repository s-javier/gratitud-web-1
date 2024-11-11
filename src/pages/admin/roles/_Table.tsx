import { createSignal, onMount } from 'solid-js'
import AgGridSolid from 'solid-ag-grid'

import type { CustomError, Permission, Role } from '~/types'
import { $permissions, $roles } from '~/stores'
import { validateResponse } from '~/utils'
import TableOptions from '~/components/shared/TableOptions'
import TableActions from '~/components/shared/TableActions'
import Info from './_Info'
import Edit from './_Edit'
import Delete from './_Delete'

export default function RoleTable(props: {
  data: {
    roles: { id: string; title: string; permissions: { view: any[]; api: any[] } }[]
    permissions: Permission[]
  }
  error: CustomError
}) {
  const [table, setTable] = createSignal<any>(null)
  const [rowCount, setRowCount] = createSignal(props.data.roles.length)
  const [isFilter, setIsFilter] = createSignal(false)
  const [defaultColDef, setDefaultColDef] = createSignal({
    flex: 1,
    headerClass: 'text-base',
    filter: false,
    floatingFilter: false,
    resizable: false,
  })
  const [role, setRole] = createSignal<any>({})
  const [isInfoOpen, setIsInfoOpen] = createSignal(false)
  const [isEditOpen, setIsEditOpen] = createSignal(false)
  const [isDeleteOpen, setIsDeleteOpen] = createSignal(false)
  const columnDefs = [
    { field: 'id', headerName: 'ID', minWidth: 150, maxWidth: 150 },
    { field: 'title', headerName: 'Rol', minWidth: 250 },
    {
      field: 'permissions',
      headerName: 'Permisos',
      minWidth: 130,
      maxWidth: 130,
      valueGetter: (p: any) => p.data.permissions.view.length + p.data.permissions.api.length,
    },
    {
      field: 'actions',
      pinned: 'right',
      maxWidth: 60,
      headerComponent: () => {
        return (
          <TableOptions
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
          <TableActions
            infoClick={() => {
              setRole(p.data)
              setIsInfoOpen(true)
            }}
            editClick={() => {
              setRole(p.data)
              setIsEditOpen(true)
            }}
            deleteClick={() => {
              setRole(p.data)
              setIsDeleteOpen(true)
            }}
          />
        )
      },
      filter: false,
      sortable: false,
    },
  ]

  onMount(() => {
    if (validateResponse(props.error)) {
      $roles.set(props.data.roles)
      $permissions.set(props.data.permissions)
    }
  })

  return (
    <>
      <Info isShow={isInfoOpen()} close={() => setIsInfoOpen(false)} data={role()} />
      <Edit isShow={isEditOpen()} close={() => setIsEditOpen(false)} data={role()} />
      <Delete isShow={isDeleteOpen()} close={() => setIsDeleteOpen(false)} data={role()} />
      <p class="mb-2 text-sm text-gray-500">
        Estas viendo {rowCount()} {rowCount() === 1 ? 'rol' : 'roles'}.
      </p>
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
    </>
  )
}
