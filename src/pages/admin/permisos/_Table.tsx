import { createSignal, onMount } from 'solid-js'
import AgGridSolid from 'solid-ag-grid'

import type { CustomError, Permission, Role } from '~/types'
import { $permissions, $rolePermission, $roles } from '~/stores'
import { validateResponse } from '~/utils'
import TableOptions from '~/components/shared/TableOptions'
import TableActions from '~/components/shared/TableActions'
import Info from './_Info'
import Edit from './_Edit'
import Delete from './_Delete'

export default function PermissionTable(props: {
  data: {
    roles: Role[]
    rolePermission: { roleId: string; permissionId: string }[]
    permissions: Permission[]
  }
  error: CustomError
}) {
  const [table, setTable] = createSignal<any>(null)
  const [rowCount, setRowCount] = createSignal(props.data.permissions.length)
  const [isFilter, setIsFilter] = createSignal(false)
  const [defaultColDef, setDefaultColDef] = createSignal({
    flex: 1,
    headerClass: 'text-base',
    filter: false,
    floatingFilter: false,
    resizable: false,
  })
  const [permission, setPermission] = createSignal<any>({})
  const [isInfoOpen, setIsInfoOpen] = createSignal(false)
  const [isEditOpen, setIsEditOpen] = createSignal(false)
  const [isDeleteOpen, setIsDeleteOpen] = createSignal(false)
  const columnDefs = [
    { field: 'id', headerName: 'ID', minWidth: 150, maxWidth: 150 },
    { field: 'path', headerName: 'Ruta', minWidth: 289 },
    { field: 'type', headerName: 'Tipo', minWidth: 100, maxWidth: 100 },
    {
      field: 'roles',
      headerName: 'Roles',
      minWidth: 100,
      maxWidth: 100,
      valueGetter: (p: any) => p.data.roles.length,
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
              setPermission(p.data)
              setIsInfoOpen(true)
            }}
            editClick={() => {
              setPermission(p.data)
              setIsEditOpen(true)
            }}
            deleteClick={() => {
              setPermission(p.data)
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
      $permissions.set(props.data.permissions)
      $rolePermission.set(props.data.rolePermission)
      $roles.set(props.data.roles)
    }
  })

  return (
    <>
      <Info isShow={isInfoOpen()} close={() => setIsInfoOpen(false)} data={permission()} />
      <Edit isShow={isEditOpen()} close={() => setIsEditOpen(false)} data={permission()} />
      <Delete isShow={isDeleteOpen()} close={() => setIsDeleteOpen(false)} data={permission()} />
      <p class="mb-2 text-sm text-gray-500">
        Estás viendo {rowCount()} {rowCount() === 1 ? 'permiso' : 'permisos'}.
      </p>
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
    </>
  )
}
