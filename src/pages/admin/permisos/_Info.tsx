import { createSignal, createEffect } from 'solid-js'
import { Button } from '@suid/material'
import AgGridSolid from 'solid-ag-grid'
import { IconButton } from '@suid/material'
import DeleteIcon from '@suid/icons-material/Delete'
import DeleteRelationRole from './_DeleteRelationRole'

import { Color } from '~/enums'
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
              sx={{
                color: Color.DELETE_BTN_BG,
                '&:hover': {
                  color: Color.DELETE_BTN_HOVER_BG,
                },
              }}
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
              <DeleteIcon />
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
        <div
          class={[
            'o-dialog',
            'pointer-events-auto flex w-full flex-col overflow-hidden rounded-xl',
            'border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800',
            'dark:shadow-neutral-700/70',
          ].join(' ')}
          style="max-height: calc(100vh - 32px)"
        >
          <header
            class={[
              'o-dialog-header',
              'flex items-center justify-between border-b px-4 py-3',
              'dark:border-neutral-700',
            ].join(' ')}
          >
            <h3 id="hire-modal-label" class="text-lg font-semibold text-white">
              Permiso
            </h3>
            <button
              type="button"
              class={[
                'o-dialog-header-close-btn',
                'inline-flex size-8 items-center justify-center gap-x-2 rounded-full',
                'border border-transparent focus:outline-none',
                'disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-700',
                'dark:text-neutral-400 dark:hover:bg-neutral-600 dark:focus:bg-neutral-600',
              ].join(' ')}
              aria-label="Close"
              onClick={props.close}
            >
              <span class="sr-only">Close</span>
              <svg
                class="size-4 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </header>
          <main class="overflow-y-auto p-4 pb-8">
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
          </main>
          <footer
            class={[
              'flex items-center justify-center gap-x-2 border-t px-4 py-3',
              'dark:border-neutral-700',
            ].join(' ')}
          >
            <Button
              variant="outlined"
              sx={{
                color: Color.CANCEL_BTN_TEXT,
                borderColor: Color.CANCEL_BTN_BORDER,
                '&:hover': {
                  backgroundColor: Color.CANCEL_BTN_HOVER_BG,
                  borderColor: Color.CANCEL_BTN_HOVER_BORDER,
                },
              }}
              onClick={props.close}
            >
              Cerrar
            </Button>
          </footer>
        </div>
      </Overlay>
    </>
  )
}
