import { createSignal, onMount } from 'solid-js'
import AgGridSolid from 'solid-ag-grid'
import { Icon } from '@iconify-icon/solid'

import type { CustomError, ViewPage, Permission } from '~/types'
import { validateResponse } from '~/utils'
import { $permissions } from '~/stores'
import TableOptions from '~/components/shared/TableOptions'
import TableActions from '~/components/shared/TableActions'
import Info from './_Info'
import Edit from './_Edit'
import Delete from './_Delete'

export default function PageTable(props: {
  data: { pages: ViewPage[]; permissions: Permission[] }
  error: CustomError
}) {
  const [table, setTable] = createSignal<any>(null)
  const [rowCount, setRowCount] = createSignal(props.data.pages.length)
  const [isFilter, setIsFilter] = createSignal(false)
  const [defaultColDef, setDefaultColDef] = createSignal({
    flex: 1,
    headerClass: 'text-base',
    filter: false,
    floatingFilter: false,
    resizable: false,
  })
  const [menuPage, setMenuPage] = createSignal<any>({})
  const [isInfoOpen, setIsInfoOpen] = createSignal(false)
  const [isEditOpen, setIsEditOpen] = createSignal(false)
  const [isDeleteOpen, setIsDeleteOpen] = createSignal(false)
  const columnDefs = [
    { field: 'title', headerName: 'Página', minWidth: 200, maxWidth: 200 },
    { field: 'path', headerName: 'Ruta', minWidth: 200 },
    { field: 'sort', headerName: 'Posición', minWidth: 100, maxWidth: 100 },
    {
      field: 'icon',
      headerName: 'Ícono',
      minWidth: 100,
      maxWidth: 100,
      cellRenderer: (p: any) => {
        return (
          <div class="h-full flex flex-row items-center">
            <Icon icon={p.data.icon as string} width="100%" class="w-5 text-gray-400" />
          </div>
        )
      },
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
              setMenuPage(p.data)
              setIsInfoOpen(true)
            }}
            editClick={() => {
              setMenuPage(p.data)
              setIsEditOpen(true)
            }}
            deleteClick={() => {
              setMenuPage(p.data)
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
    }
  })

  return (
    <>
      <Info isShow={isInfoOpen()} close={() => setIsInfoOpen(false)} data={menuPage()} />
      <Edit
        isShow={isEditOpen()}
        close={() => setIsEditOpen(false)}
        data={menuPage()}
        permissions={props.data.permissions}
      />
      <Delete isShow={isDeleteOpen()} close={() => setIsDeleteOpen(false)} data={menuPage()} />
      <p class="mb-2 text-sm text-gray-500">
        Estas viendo {rowCount()} {rowCount() === 1 ? 'página' : 'páginas'} de menú.
      </p>
      <div class="ag-theme-alpine">
        <AgGridSolid
          onGridReady={(params) => {
            setTable(params.api)
          }}
          onFilterChanged={() => {
            setRowCount(table()?.getRenderedNodes().length ?? props.data.pages.length)
          }}
          // @ts-ignore
          columnDefs={columnDefs}
          rowData={props.data.pages}
          defaultColDef={defaultColDef()}
          rowSelection="single"
          domLayout="autoHeight"
        />
      </div>
    </>
  )
}
