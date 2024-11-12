import { actions } from 'astro:actions'
import { createEffect, createRoot, createSignal, Show } from 'solid-js'
import { Button } from '@suid/material'
import AgGridSolid from 'solid-ag-grid'
import { IconButton } from '@suid/material'
import { Icon } from '@iconify-icon/solid'
import { toast } from 'solid-sonner'

import { validateResponse } from '~/utils'
import { $loaderOverlay } from '~/stores'
import handleResponse from './handleResponse'
import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'
import TableOptions from '~/components/shared/TableOptions'
import CustomToaster from '~/components/shared/CustomToaster'
import DeleteRelation from './_DeleteRelation'

export default function UserInfo(props: {
  isShow: boolean
  close: () => void
  data: {
    id: string
    name: string
    email: string
    isActive: boolean
    relations: any[]
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
    { field: 'organizationTitle', headerName: 'Organización', minWidth: 200, maxWidth: 200 },
    { field: 'roleTitle', headerName: 'Rol' },
    { field: 'isVisible', headerName: 'Visible', minWidth: 100, maxWidth: 100 },
    {
      field: 'visibility',
      headerName: '',
      minWidth: 70,
      maxWidth: 70,
      cellRenderer: (p: any) => {
        return (
          <div class="flex flex-row justify-center items-center">
            <Show when={p.data.isVisible}>
              <IconButton
                class="!text-green-500 hover:!text-green-400"
                aria-label="menu"
                onClick={async () => await changeVisibility(p)}
              >
                <Icon icon="mdi:visibility-off" width="100%" class="w-6" />
              </IconButton>
            </Show>
            <Show when={!p.data.isVisible}>
              <IconButton
                class="!text-green-500 hover:!text-green-400"
                onClick={async () => await changeVisibility(p)}
              >
                <Icon icon="mdi:visibility" width="100%" class="w-6" />
              </IconButton>
            </Show>
          </div>
        )
      },
      filter: false,
      sortable: false,
    },
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
                setOrganizationUserRole({
                  organizationId: p.data.organizationId,
                  organizationTitle: p.data.organizationTitle,
                  userId: props.data.id,
                  userName: props.data.name,
                  roleId: p.data.roleId,
                  roleTitle: p.data.roleTitle,
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
  const [organizationUserRole, setOrganizationUserRole] = createSignal<any>({})
  const [isDeleteRelationOpen, setIsDeleteRelationOpen] = createSignal(false)

  createEffect(() => {
    setRowCount(props.data.relations?.length ?? 0)
  })

  const changeVisibility = async (p: any) => {
    if (validateRequestOfRelation(p) === false) {
      return
    }
    $loaderOverlay.set(true)
    const { data, error }: any = await actions.userEditVisibility({
      organizationId: p.data.organizationId,
      userId: props.data.id,
      roleId: p.data.roleId,
      isVisible: !p.data.isVisible,
    })
    if (validateResponse(error || data?.error || null) === false) {
      $loaderOverlay.set(false)
      return
    }
    handleResponse()
  }

  const validateRequestOfRelation = (p: any) => {
    if (!p.data?.organizationId || !props.data?.id || !p.data?.roleId) {
      toast.custom(
        (t) =>
          createRoot(() => (
            <CustomToaster
              id={t}
              type="error"
              title="Hubo un error"
              description="Por favor, inténtalo nuevamente o más tarde."
            />
          )),
        {
          duration: 5000,
        },
      )
      return false
    }
    return true
  }

  return (
    <>
      <DeleteRelation
        isShow={isDeleteRelationOpen()}
        close={() => setIsDeleteRelationOpen(false)}
        data={organizationUserRole()}
      />
      <Overlay type="dialog" width="max-w-3xl" isActive={props.isShow}>
        <Dialog
          title="Usuario"
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
            <p class="font-bold">Nombre(s)</p>
            <p>{props.data.name}</p>
          </div>
          <div class="mb-4">
            <p class="font-bold">Email</p>
            <p>{props.data.email}</p>
          </div>
          <div class="mb-8">
            <p class="font-bold">Activo</p>
            <p>
              {props.data.isActive ? (
                <span class="text-green-500">Sí</span>
              ) : (
                <span class="text-red-500">No</span>
              )}
            </p>
          </div>
          <p class="mb-2 text-sm text-gray-500">
            Estas viendo {rowCount()} {rowCount() === 1 ? 'relación' : 'relaciones'}.
          </p>
          <div class="ag-theme-alpine">
            <AgGridSolid
              onGridReady={(params) => {
                setTable(params.api)
              }}
              onFilterChanged={() => {
                setRowCount(table()?.getRenderedNodes().length ?? props.data.relations.length)
              }}
              // @ts-ignore
              columnDefs={columnDefs}
              rowData={props.data.relations}
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
