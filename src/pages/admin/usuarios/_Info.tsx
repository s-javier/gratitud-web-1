import { actions } from 'astro:actions'
import { createEffect, createRoot, createSignal, Show } from 'solid-js'
import { Button } from '@suid/material'
import AgGridSolid from 'solid-ag-grid'
import { IconButton } from '@suid/material'
import DeleteIcon from '@suid/icons-material/Delete'
import VisibilityIcon from '@suid/icons-material/Visibility'
import VisibilityOffIcon from '@suid/icons-material/VisibilityOff'
import { toast } from 'solid-sonner'

import { Color } from '~/enums'
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
    firstName: string
    lastName: string
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
                aria-label="menu"
                sx={{
                  color: '#22c55e', // Color del texto
                  '&:hover': {
                    color: '#4ade80',
                  },
                }}
                onClick={async () => await changeVisibility(p)}
              >
                <VisibilityOffIcon />
              </IconButton>
            </Show>
            <Show when={!p.data.isVisible}>
              <IconButton
                sx={{
                  color: '#22c55e', // Color del texto
                  '&:hover': {
                    color: '#4ade80',
                  },
                }}
                onClick={async () => await changeVisibility(p)}
              >
                <VisibilityIcon />
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
              sx={{
                color: Color.DELETE_BTN_BG,
                '&:hover': {
                  color: Color.DELETE_BTN_HOVER_BG,
                },
              }}
              onClick={() => {
                setOrganizationUserRole({
                  organizationId: p.data.organizationId,
                  organizationTitle: p.data.organizationTitle,
                  userId: props.data.id,
                  userName: props.data.firstName + ' ' + props.data.lastName,
                  roleId: p.data.roleId,
                  roleTitle: p.data.roleTitle,
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
          }
        >
          <div class="mb-4">
            <p class="font-bold">Nombre(s)</p>
            <p>{props.data.firstName}</p>
          </div>
          <div class="mb-4">
            <p class="font-bold">Apellido(s)</p>
            <p>{props.data.lastName}</p>
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
