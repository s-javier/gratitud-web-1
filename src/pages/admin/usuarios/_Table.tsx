import { createSignal, onMount } from 'solid-js'
import AgGridSolid from 'solid-ag-grid'

import type { CustomError, Organization, Role, User } from '~/types'
import { $organizations, $users, $roles } from '~/stores'
import { validateResponse } from '~/utils'
import TableOptions from '~/components/shared/TableOptions'
import TableActions from '~/components/shared/TableActions'
import Info from './_Info'
import Edit from './_Edit'
import Delete from './_Delete'

export default function UserTable(props: {
  data: { organizations: Organization[]; users: User[]; roles: Role[] }
  error: CustomError
}) {
  const [table, setTable] = createSignal<any>(null)
  const [rowCount, setRowCount] = createSignal(props.data.users.length)
  const [isFilter, setIsFilter] = createSignal(false)
  const [defaultColDef, setDefaultColDef] = createSignal({
    flex: 1,
    headerClass: 'text-base',
    filter: false,
    floatingFilter: false,
    resizable: false,
  })
  const [user, setUser] = createSignal<any>({})
  const [isInfoOpen, setIsInfoOpen] = createSignal(false)
  const [isEditOpen, setIsEditOpen] = createSignal(false)
  const [isDeleteOpen, setIsDeleteOpen] = createSignal(false)
  const columnDefs = [
    { field: 'name', headerName: 'Nombre', minWidth: 200 },
    { field: 'email', headerName: 'Email', minWidth: 280 },
    {
      field: 'organizations',
      headerName: 'Organizaciones',
      minWidth: 170,
      maxWidth: 170,
      valueGetter: (p: any) => p.data.relations.length,
    },
    { field: 'isActive', headerName: 'Activo', minWidth: 100, maxWidth: 100 },
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
              setUser(p.data)
              setIsInfoOpen(true)
            }}
            editClick={() => {
              setUser(p.data)
              setIsEditOpen(true)
            }}
            deleteClick={() => {
              setUser(p.data)
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
      $organizations.set(props.data.organizations)
      $users.set(props.data.users)
      $roles.set(props.data.roles)
    }
  })

  return (
    <>
      <Info isShow={isInfoOpen()} close={() => setIsInfoOpen(false)} data={user()} />
      <Edit isShow={isEditOpen()} close={() => setIsEditOpen(false)} data={user()} />
      <Delete isShow={isDeleteOpen()} close={() => setIsDeleteOpen(false)} data={user()} />
      <p class="mb-2 text-sm text-gray-500">
        Estas viendo {rowCount()} {rowCount() === 1 ? 'usuario' : 'usuarios'}.
      </p>
      <div class="ag-theme-alpine">
        <AgGridSolid
          onGridReady={(params) => {
            setTable(params.api)
          }}
          onFilterChanged={() => {
            setRowCount(table()?.getRenderedNodes().length ?? props.data.users.length)
          }}
          // @ts-ignore
          columnDefs={columnDefs}
          rowData={props.data.users}
          defaultColDef={defaultColDef()}
          rowSelection="single"
          domLayout="autoHeight"
        />
      </div>
    </>
  )
}
