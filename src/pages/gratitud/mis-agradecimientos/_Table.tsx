import { createSignal, onMount } from 'solid-js'
import AgGridSolid from 'solid-ag-grid'

import type { CustomError, Organization } from '~/types'
import { validateResponse } from '~/utils'
import TableOptions from '~/components/shared/TableOptions'
import TableActions from '~/components/shared/TableActions'
import Info from './_Info'
import Edit from './_Edit'
import Delete from './_Delete'

export default function OrganizationTable(props: { data: Organization[]; error: CustomError }) {
  const [table, setTable] = createSignal<any>(null)
  const [rowCount, setRowCount] = createSignal(props.data.length)
  const [isFilter, setIsFilter] = createSignal(false)
  const [defaultColDef, setDefaultColDef] = createSignal({
    flex: 1,
    headerClass: 'text-base',
    filter: false,
    floatingFilter: false,
    resizable: false,
  })
  const [gratitude, setGratitude] = createSignal<any>({})
  const [isInfoOpen, setIsInfoOpen] = createSignal(false)
  const [isEditOpen, setIsEditOpen] = createSignal(false)
  const [isDeleteOpen, setIsDeleteOpen] = createSignal(false)
  const columnDefs = [
    { field: 'title', headerName: 'Título' },
    { field: 'description', headerName: 'Descripción', minWidth: 200 },
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
              setGratitude(p.data)
              setIsInfoOpen(true)
            }}
            editClick={() => {
              setGratitude(p.data)
              setIsEditOpen(true)
            }}
            deleteClick={() => {
              setGratitude(p.data)
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
    validateResponse(props.error)
  })

  return (
    <>
      <Info isShow={isInfoOpen()} close={() => setIsInfoOpen(false)} data={gratitude()} />
      <Edit isShow={isEditOpen()} close={() => setIsEditOpen(false)} data={gratitude()} />
      <Delete isShow={isDeleteOpen()} close={() => setIsDeleteOpen(false)} data={gratitude()} />
      <p class="mb-2 text-sm text-gray-500">
        Estas viendo {rowCount()} {rowCount() === 1 ? 'agradecimiento' : 'agradecimientos'}.
      </p>
      <div class="ag-theme-alpine">
        <AgGridSolid
          onGridReady={(params) => {
            setTable(params.api)
          }}
          onFilterChanged={() => {
            setRowCount(table()?.getRenderedNodes().length ?? props.data.length)
          }}
          // @ts-ignore
          columnDefs={columnDefs}
          rowData={props.data}
          defaultColDef={defaultColDef()}
          rowSelection="single"
          domLayout="autoHeight"
        />
      </div>
    </>
  )
}
