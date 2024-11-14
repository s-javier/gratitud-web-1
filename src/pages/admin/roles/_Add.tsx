import { createRoot, createSignal } from 'solid-js'
import { Portal } from 'solid-js/web'
import colors from 'tailwindcss/colors'
import { Button, ListItemIcon, Menu, MenuItem, TextField } from '@suid/material'
import { actions } from 'astro:actions'
import * as v from 'valibot'
import { toast } from 'solid-sonner'
import { Icon } from '@iconify-icon/solid'

import { $loaderOverlay } from '~/stores'
import { validateResponse } from '~/utils'
import handleResponse from './handleResponse'
import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'
import CustomToaster from '~/components/shared/CustomToaster'
import AddPermission from './_AddPermission'

export default function roleAdd() {
  const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null)
  const openMenu = () => Boolean(anchorEl())

  const [isAddOpen, setIsAddOpen] = createSignal(false)
  const [isAddPermissionOpen, setIsAddPermissionOpen] = createSignal(false)
  const [title, setTitle] = createSignal('')
  const [titleErrMsg, setTitleErrMsg] = createSignal('')

  const validateRequest = () => {
    const Schema = {
      title: v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.nonEmpty('Este campo es requerido.'),
        v.minLength(4, 'Escribe un poco más.'),
        v.maxLength(50, 'Escribe menos.'),
      ),
    }
    const titleErr = v.safeParse(Schema.title, title())
    setTitleErrMsg(titleErr.issues ? titleErr.issues[0].message : '')
    const verificationResult = v.safeParse(v.object(Schema), { title: title() })
    if (!verificationResult.success) {
      toast.custom(
        (t) =>
          createRoot(() => (
            <CustomToaster
              id={t}
              type="error"
              title="El formulario tiene algún error"
              description="Por favor, corrige el/los error/es para poder agregar un rol."
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
      <Button
        variant="contained"
        size="small"
        class={[
          '!text-[var(--o-btn-primary-text-color)]',
          '!bg-[var(--o-btn-primary-bg-color)]',
          'hover:!bg-[var(--o-btn-primary-bg-hover-color)]',
        ].join(' ')}
        onClick={(event: any) => setAnchorEl(event.currentTarget)}
      >
        Agregar
      </Button>
      <Menu
        anchorEl={anchorEl()}
        open={openMenu()}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            ['& .MuiAvatar-root']: {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
      >
        <MenuItem onClick={() => setIsAddOpen(true)}>
          <ListItemIcon>
            <Icon icon="mdi:card-account-details" width="100%" class="w-5" />
          </ListItemIcon>
          Rol
        </MenuItem>
        <MenuItem onClick={() => setIsAddPermissionOpen(true)}>
          <ListItemIcon>
            <Icon icon="mdi:lock" width="100%" class="w-5" />
          </ListItemIcon>
          Asociación con permiso
        </MenuItem>
      </Menu>
      <Portal>
        <Overlay type="dialog" isActive={isAddOpen()}>
          <Dialog
            title="Nuevo rol"
            close={() => setIsAddOpen(false)}
            footer={
              <>
                <Button
                  variant="outlined"
                  class={[
                    '!text-gray-700 !border-gray-300 hover:!bg-gray-50',
                    'hover:!border-[var(--o-btn-cancel-border-hover-color)]',
                  ].join(' ')}
                  onClick={() => setIsAddOpen(false)}
                >
                  Cerrar
                </Button>
                <Button
                  variant="contained"
                  class={[
                    '!text-[var(--o-btn-primary-text-color)]',
                    '!bg-[var(--o-btn-primary-bg-color)]',
                    'hover:!bg-[var(--o-btn-primary-bg-hover-color)]',
                    '!font-bold',
                  ].join(' ')}
                  onClick={async () => {
                    if (validateRequest() === false) {
                      return
                    }
                    $loaderOverlay.set(true)
                    const { data, error }: any = await actions.roleCreate({
                      title: title().trim(),
                    })
                    if (validateResponse(error || data?.error || null) === false) {
                      $loaderOverlay.set(false)
                      return
                    }
                    handleResponse()
                  }}
                >
                  Agregar
                </Button>
              </>
            }
          >
            <div class="space-y-4">
              <TextField
                label="Título*"
                variant="outlined"
                class="w-full"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: colors.gray[400],
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.yellow[400],
                    },
                  },
                  '& label.Mui-focused': {
                    color: colors.yellow[500],
                  },
                }}
                value={title()}
                onChange={(e) => {
                  setTitle(e.target.value)
                }}
                onFocus={() => {
                  setTitleErrMsg('')
                }}
                error={titleErrMsg() !== ''}
                helperText={titleErrMsg()}
              />
            </div>
          </Dialog>
        </Overlay>
        <AddPermission isShow={isAddPermissionOpen()} close={() => setIsAddPermissionOpen(false)} />
      </Portal>
    </>
  )
}
