import { actions } from 'astro:actions'
import { createEffect, createRoot, createSignal } from 'solid-js'
import { Portal } from 'solid-js/web'
import colors from 'tailwindcss/colors'
import { Button, ListItemIcon, Menu, MenuItem, TextField } from '@suid/material'
import * as v from 'valibot'
import { toast } from 'solid-sonner'
import { Icon } from '@iconify-icon/solid'
import { useStore } from '@nanostores/solid'
import { Combobox } from '@kobalte/core/combobox'

import { $loaderOverlay, $permissions, $roles } from '~/stores'
import { validateResponse } from '~/utils'
import handleResponse from './handleResponse'
import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'
import CustomToaster from '~/components/shared/CustomToaster'

export default function RoleAdd() {
  const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null)
  const openMenu = () => Boolean(anchorEl())

  const [isDialogOpen, setIsDialogOpen] = createSignal(false)
  const [isDialogRelationOpen, setIsDialogRelationOpen] = createSignal(false)
  const [title, setTitle] = createSignal('')
  const [titleErrMsg, setTitleErrMsg] = createSignal('')
  const [roleId, setRoleId] = createSignal<any>({})
  const [roleIdErrMsg, setRoleIdErrMsg] = createSignal('')
  const [permissionId, setPermissionId] = createSignal<any>({})
  const [permissionIdErrMsg, setPermissionIdErrMsg] = createSignal('')

  const roles = useStore($roles)
  const permissions = useStore($permissions)

  createEffect(() => {
    if (roleId().id) {
      setRoleIdErrMsg('')
    }
    if (permissionId().id) {
      setPermissionIdErrMsg('')
    }
  })

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

  const validateRequestOfRelation = () => {
    const Schema = {
      roleId: v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.nonEmpty('Este campo es requerido.'),
        v.regex(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
          'El valor de este campo es inválido.',
        ),
      ),
      permissionId: v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.nonEmpty('Este campo es requerido.'),
        v.regex(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
          'El valor de este campo es inválido.',
        ),
      ),
    }
    const roleIdErr = v.safeParse(Schema.roleId, roleId().id ?? '')
    setRoleIdErrMsg(roleIdErr.issues ? roleIdErr.issues[0].message : '')
    const permissionIdErr = v.safeParse(Schema.permissionId, permissionId().id ?? '')
    setPermissionIdErrMsg(permissionIdErr.issues ? permissionIdErr.issues[0].message : '')
    const verificationResult = v.safeParse(v.object(Schema), {
      roleId: roleId().id,
      permissionId: permissionId().id,
    })
    if (!verificationResult.success) {
      toast.custom(
        (t) =>
          createRoot(() => (
            <CustomToaster
              id={t}
              type="error"
              title="El formulario tiene algún error"
              description="Por favor, corrige el/los error/es para poder agregar una relación de rol con permiso."
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
        <MenuItem onClick={() => setIsDialogOpen(true)}>
          <ListItemIcon>
            <Icon icon="mdi:card-account-details" width="100%" class="w-5" />
          </ListItemIcon>
          Rol
        </MenuItem>
        <MenuItem onClick={() => setIsDialogRelationOpen(true)}>
          <ListItemIcon>
            <Icon icon="mdi:relation-many-to-many" width="100%" class="w-5" />
          </ListItemIcon>
          Relación
        </MenuItem>
      </Menu>
      <Portal>
        <Overlay type="dialog" isActive={isDialogOpen()}>
          <Dialog
            title="Nuevo rol"
            close={() => setIsDialogOpen(false)}
            footer={
              <>
                <Button
                  variant="outlined"
                  class={[
                    '!text-gray-700 !border-gray-300 hover:!bg-gray-50',
                    'hover:!border-[var(--o-btn-cancel-border-hover-color)]',
                  ].join(' ')}
                  onClick={() => setIsDialogOpen(false)}
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
                    const { data, error }: any = await actions.roleAdd({
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
                      borderColor: colors.pink[300],
                    },
                  },
                  '& label.Mui-focused': {
                    color: colors.pink[500],
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
      </Portal>
      <Portal>
        <Overlay type="dialog" isActive={isDialogRelationOpen()}>
          <Dialog
            title="Nueva relación"
            close={() => setIsDialogRelationOpen(false)}
            footer={
              <>
                <Button
                  variant="outlined"
                  class={[
                    '!text-gray-700 !border-gray-300 hover:!bg-gray-50',
                    'hover:!border-[var(--o-btn-cancel-border-hover-color)]',
                  ].join(' ')}
                  onClick={() => setIsDialogRelationOpen(false)}
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
                    if (validateRequestOfRelation() === false) {
                      return
                    }
                    $loaderOverlay.set(true)
                    const { data, error }: any = await actions.roleAddRelationPermission({
                      roleId: roleId().id.trim(),
                      permissionId: permissionId().id.trim(),
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
              <div>
                <div
                  class={['text-sm', roleIdErrMsg() ? 'text-[#d32f2f]' : 'text-gray-700'].join(' ')}
                >
                  Rol
                </div>
                <Combobox
                  options={roles()}
                  // @ts-ignore
                  optionValue="id"
                  // @ts-ignore
                  optionTextValue="title" /* Sirve para filtrar */
                  // @ts-ignore
                  optionLabel="title"
                  // @ts-ignore
                  value={roleId()}
                  onChange={setRoleId}
                  // onInputChange={(value) => setRoleId(value ?? '')}
                  validationState={roleIdErrMsg() ? 'invalid' : 'valid'}
                  itemComponent={(props) => (
                    // @ts-ignore
                    <Combobox.Item item={props.item} class="combobox__item">
                      {/* @ts-ignore */}
                      <Combobox.ItemLabel>{props.item.rawValue.title}</Combobox.ItemLabel>
                      <Combobox.ItemIndicator class="combobox__item-indicator">
                        <Icon icon="mdi:check" width="100%" class="w-4" />
                      </Combobox.ItemIndicator>
                    </Combobox.Item>
                  )}
                >
                  <Combobox.Control class="combobox__control w-full border-[1px] o-combobox-control">
                    <Combobox.Input class="combobox__input w-full" />
                    <Combobox.Trigger class="combobox__trigger">
                      <Combobox.Icon class="combobox__icon">
                        <Icon
                          icon="radix-icons:caret-sort"
                          width="100%"
                          class="w-6 text-gray-400"
                        />
                      </Combobox.Icon>
                    </Combobox.Trigger>
                  </Combobox.Control>
                  <Combobox.ErrorMessage
                    class="text-xs text-[#d32f2f] px-[14px] pt-[3px]"
                    style="font-family: Roboto, Helvetica, Arial, sans-serif"
                  >
                    {roleIdErrMsg()}
                  </Combobox.ErrorMessage>
                  <Combobox.Portal>
                    <Combobox.Content class="combobox__content">
                      <Combobox.Listbox class="combobox__listbox" />
                    </Combobox.Content>
                  </Combobox.Portal>
                </Combobox>
              </div>
              <div>
                <div
                  class={[
                    'text-sm',
                    permissionIdErrMsg() ? 'text-[#d32f2f]' : 'text-gray-700',
                  ].join(' ')}
                >
                  Permiso
                </div>
                <Combobox
                  options={permissions()}
                  // @ts-ignore
                  optionValue="id"
                  // @ts-ignore
                  optionTextValue="path" /* Sirve para filtrar */
                  // @ts-ignore
                  optionLabel="path"
                  // @ts-ignore
                  value={permissionId()}
                  onChange={setPermissionId}
                  // onInputChange={(value) => setPermissionId(value ?? '')}
                  validationState={permissionIdErrMsg() ? 'invalid' : 'valid'}
                  itemComponent={(props) => (
                    // @ts-ignore
                    <Combobox.Item item={props.item} class="combobox__item">
                      {/* @ts-ignore */}
                      <Combobox.ItemLabel>
                        {props.item.rawValue.type} - {props.item.rawValue.path}
                      </Combobox.ItemLabel>
                      <Combobox.ItemIndicator class="combobox__item-indicator">
                        <Icon icon="mdi:check" width="100%" class="w-4" />
                      </Combobox.ItemIndicator>
                    </Combobox.Item>
                  )}
                >
                  <Combobox.Control class="combobox__control w-full border-[1px] o-combobox-control">
                    <Combobox.Input class="combobox__input w-full" />
                    <Combobox.Trigger class="combobox__trigger">
                      <Combobox.Icon class="combobox__icon">
                        <Icon
                          icon="radix-icons:caret-sort"
                          width="100%"
                          class="w-6 text-gray-400"
                        />
                      </Combobox.Icon>
                    </Combobox.Trigger>
                  </Combobox.Control>
                  <Combobox.ErrorMessage
                    class="text-xs text-[#d32f2f] px-[14px] pt-[3px]"
                    style="font-family: Roboto, Helvetica, Arial, sans-serif"
                  >
                    {permissionIdErrMsg()}
                  </Combobox.ErrorMessage>
                  <Combobox.Portal>
                    <Combobox.Content class="combobox__content">
                      <Combobox.Listbox class="combobox__listbox" />
                    </Combobox.Content>
                  </Combobox.Portal>
                </Combobox>
              </div>
            </div>
          </Dialog>
        </Overlay>
      </Portal>
    </>
  )
}
