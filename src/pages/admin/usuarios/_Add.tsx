import { createEffect, createRoot, createSignal } from 'solid-js'
import { Portal } from 'solid-js/web'
import { Button, ListItemIcon, Menu, MenuItem, TextField } from '@suid/material'
import { actions } from 'astro:actions'
import * as v from 'valibot'
import { toast } from 'solid-sonner'
import { Icon } from '@iconify-icon/solid'
import { useStore } from '@nanostores/solid'
import { Combobox } from '@kobalte/core/combobox'

import type { User } from '~/types'
import { Color } from '~/enums'
import { $loaderOverlay, $organizations, $roles, $users } from '~/stores'
import { validateResponse } from '~/utils'
import handleResponse from './handleResponse'
import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'
import YellowSwitch from '~/components/shared/Switch'
import CustomToaster from '~/components/shared/CustomToaster'

export default function UserAdd() {
  const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null)
  const openMenu = () => Boolean(anchorEl())

  const [isDialogOpen, setIsDialogOpen] = createSignal(false)
  const [isDialogRelationOpen, setIsDialogRelationOpen] = createSignal(false)
  const [firstName, setFirstName] = createSignal('')
  const [firstNameErrMsg, setFirstNameErrMsg] = createSignal('')
  const [lastName, setLastName] = createSignal('')
  const [lastNameErrMsg, setLastNameErrMsg] = createSignal('')
  const [email, setEmail] = createSignal('')
  const [emailErrMsg, setEmailErrMsg] = createSignal('')
  const [isActive, setIsActive] = createSignal(true)
  const [isActiveErrMsg, setIsActiveErrMsg] = createSignal('')
  const [organizationId, setOrganizationId] = createSignal<any>({})
  const [organizationIdErrMsg, setOrganizationIdErrMsg] = createSignal('')
  const [userId, setUserId] = createSignal<any>({})
  const [userIdErrMsg, setUserIdErrMsg] = createSignal('')
  const [roleId, setRoleId] = createSignal<any>({})
  const [roleIdErrMsg, setRoleIdErrMsg] = createSignal('')
  const [isVisible, setIsVisible] = createSignal(true)
  const [isVisibleErrMsg, setIsVisibleErrMsg] = createSignal('')

  const organizations = useStore($organizations)
  const users = useStore($users)
  const roles = useStore($roles)

  createEffect(() => {
    if (organizationId().id) {
      setOrganizationIdErrMsg('')
    }
    if (userId().id) {
      setUserIdErrMsg('')
    }
    if (roleId().id) {
      setRoleIdErrMsg('')
    }
  })

  const validateRequest = () => {
    const Schema = {
      firstName: v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.nonEmpty('Este campo es requerido.'),
        v.minLength(2, 'Escribe un poco más.'),
        v.maxLength(50, 'Escribe menos.'),
      ),
      lastName: v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.nonEmpty('Este campo es requerido.'),
        v.minLength(2, 'Escribe un poco más.'),
        v.maxLength(50, 'Escribe menos.'),
      ),
      email: v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.nonEmpty('Este campo es requerido.'),
        v.email('El valor de este campo es inválido.'),
      ),
      isActive: v.boolean('El valor de este campo es inválido.'),
    }
    const firstNameErr = v.safeParse(Schema.firstName, firstName())
    setFirstNameErrMsg(firstNameErr.issues ? firstNameErr.issues[0].message : '')
    const lastNameErr = v.safeParse(Schema.firstName, lastName())
    setLastNameErrMsg(lastNameErr.issues ? lastNameErr.issues[0].message : '')
    const emailErr = v.safeParse(Schema.email, email())
    setEmailErrMsg(emailErr.issues ? emailErr.issues[0].message : '')
    const isActiveErr = v.safeParse(Schema.isActive, isActive())
    setIsActiveErrMsg(isActiveErr.issues ? isActiveErr.issues[0].message : '')
    const verificationResult = v.safeParse(v.object(Schema), {
      firstName: firstName(),
      lastName: lastName(),
      email: email(),
      isActive: isActive(),
    })
    if (!verificationResult.success) {
      toast.custom(
        (t) =>
          createRoot(() => (
            <CustomToaster
              id={t}
              type="error"
              title="El formulario tiene algún error"
              description="Por favor, corrige el/los error/es para poder agregar un usuario."
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
      organizationId: v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.nonEmpty('Este campo es requerido.'),
        v.regex(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
          'El valor de este campo es inválido.',
        ),
      ),
      userId: v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.nonEmpty('Este campo es requerido.'),
        v.regex(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
          'El valor de este campo es inválido.',
        ),
      ),
      roleId: v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.nonEmpty('Este campo es requerido.'),
        v.regex(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
          'El valor de este campo es inválido.',
        ),
      ),
      isVisible: v.boolean('El valor de este campo es inválido.'),
    }
    const organizationIdErr = v.safeParse(Schema.organizationId, organizationId().id ?? '')
    setOrganizationIdErrMsg(organizationIdErr.issues ? organizationIdErr.issues[0].message : '')
    const userIdErr = v.safeParse(Schema.userId, userId().id ?? '')
    setUserIdErrMsg(userIdErr.issues ? userIdErr.issues[0].message : '')
    const roleIdErr = v.safeParse(Schema.roleId, roleId().id ?? '')
    setRoleIdErrMsg(roleIdErr.issues ? roleIdErr.issues[0].message : '')
    const isVisibleErr = v.safeParse(Schema.isVisible, isVisible())
    setIsVisibleErrMsg(isVisibleErr.issues ? isVisibleErr.issues[0].message : '')
    const verificationResult = v.safeParse(v.object(Schema), {
      organizationId: organizationId().id,
      userId: userId().id,
      roleId: roleId().id,
      isVisible: isVisible(),
    })
    if (!verificationResult.success) {
      toast.custom(
        (t) =>
          createRoot(() => (
            <CustomToaster
              id={t}
              type="error"
              title="El formulario tiene algún error"
              description="Por favor, corrige el/los error/es para poder agregar una relación de organiación, usuario y rol."
            />
          )),
        {
          duration: 5000,
        },
      )
      return false
    }
    /* ▼ Verificación de si organización y usuario ya están relacionados */
    const user = users().find((u: User) => u.id === userId().id)
    const organization = user?.relations.find(
      (relation: any) => relation.organizationId === organizationId().id,
    )
    if (organization) {
      toast.custom(
        (t) =>
          createRoot(() => (
            <CustomToaster
              id={t}
              type="error"
              title="El formulario tiene algún error"
              description="La relación entre la organización y el usuario ya existe."
            />
          )),
        {
          duration: 5000,
        },
      )
      return false
    }
    /* ▲ Verificación de si organización y usuario ya están relacionados */
    return true
  }

  return (
    <>
      <Button
        onClick={(event: any) => setAnchorEl(event.currentTarget)}
        aria-controls={openMenu() ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu() ? 'true' : undefined}
        variant="contained"
        size="small"
        sx={{
          backgroundColor: Color.PRIMARY_BTN_BG,
          color: Color.PRIMARY_BTN_TEXT,
          '&:hover': {
            backgroundColor: Color.PRIMARY_BTN_HOVER_BG,
          },
        }}
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
            <Icon icon="mdi:person" width="100%" class="w-5" />
          </ListItemIcon>
          Usuario
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
            title="Nueva usuario"
            close={() => setIsDialogOpen(false)}
            footer={
              <>
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
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cerrar
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: Color.PRIMARY_BTN_BG,
                    color: Color.PRIMARY_BTN_TEXT,
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: Color.PRIMARY_BTN_HOVER_BG,
                    },
                  }}
                  onClick={async () => {
                    if (validateRequest() === false) {
                      return
                    }
                    $loaderOverlay.set(true)
                    const { data, error }: any = await actions.userAdd({
                      firstName: firstName().trim(),
                      lastName: lastName().trim(),
                      email: email().trim(),
                      isActive: isActive(),
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
                label="Nombre(s)*"
                variant="outlined"
                class="w-full"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: Color.TEXT_FIELD_HOVER_BORDER,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: Color.TEXT_FIELD_FOCUS_BORDER,
                    },
                  },
                  '& label.Mui-focused': {
                    color: Color.TEXT_FIELD_FOCUS_LABEL,
                  },
                }}
                value={firstName()}
                onChange={(e) => {
                  setFirstName(e.target.value)
                }}
                onFocus={() => {
                  setFirstNameErrMsg('')
                }}
                error={firstNameErrMsg() !== ''}
                helperText={firstNameErrMsg()}
              />
              <TextField
                label="Apellido(s)*"
                variant="outlined"
                class="w-full"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: Color.TEXT_FIELD_HOVER_BORDER,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: Color.TEXT_FIELD_FOCUS_BORDER,
                    },
                  },
                  '& label.Mui-focused': {
                    color: Color.TEXT_FIELD_FOCUS_LABEL,
                  },
                }}
                value={lastName()}
                onChange={(e) => {
                  setLastName(e.target.value)
                }}
                onFocus={() => {
                  setLastNameErrMsg('')
                }}
                error={lastNameErrMsg() !== ''}
                helperText={lastNameErrMsg()}
              />
              <TextField
                label="Email*"
                variant="outlined"
                class="w-full"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: Color.TEXT_FIELD_HOVER_BORDER,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: Color.TEXT_FIELD_FOCUS_BORDER,
                    },
                  },
                  '& label.Mui-focused': {
                    color: Color.TEXT_FIELD_FOCUS_LABEL,
                  },
                }}
                value={email()}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                onFocus={() => {
                  setEmailErrMsg('')
                }}
                error={emailErrMsg() !== ''}
                helperText={emailErrMsg()}
              />
              <div class="flex flex-row items-center">
                <YellowSwitch
                  checked={isActive() ?? false}
                  onChange={(e, value) => setIsActive(value)}
                />
                <span class="ml-2">{isActive() ? 'Activo' : 'Inactivo'}</span>
                {isActiveErrMsg() !== '' && (
                  <span class="ml-2 text-red-500">{isActiveErrMsg()}</span>
                )}
              </div>
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
                  sx={{
                    color: Color.CANCEL_BTN_TEXT,
                    borderColor: Color.CANCEL_BTN_BORDER,
                    '&:hover': {
                      backgroundColor: Color.CANCEL_BTN_HOVER_BG,
                      borderColor: Color.CANCEL_BTN_HOVER_BORDER,
                    },
                  }}
                  onClick={() => setIsDialogRelationOpen(false)}
                >
                  Cerrar
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: Color.PRIMARY_BTN_BG,
                    color: Color.PRIMARY_BTN_TEXT,
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: Color.PRIMARY_BTN_HOVER_BG,
                    },
                  }}
                  onClick={async () => {
                    if (validateRequestOfRelation() === false) {
                      return
                    }
                    $loaderOverlay.set(true)
                    const { data, error }: any = await actions.userAddRelationOrganizationRole({
                      organizationId: organizationId().id.trim(),
                      userId: userId().id.trim(),
                      roleId: roleId().id.trim(),
                      isVisible: isVisible(),
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
                  class={[
                    'text-sm',
                    organizationIdErrMsg() ? 'text-[#d32f2f]' : 'text-gray-700',
                  ].join(' ')}
                >
                  Organización
                </div>
                <Combobox
                  options={organizations()}
                  // @ts-ignore
                  optionValue="id"
                  // @ts-ignore
                  optionTextValue="title" /* Sirve para filtrar */
                  // @ts-ignore
                  optionLabel="title"
                  // @ts-ignore
                  value={organizationId()}
                  onChange={setOrganizationId}
                  // onInputChange={(value) => setOrganizationId(value ?? '')}
                  validationState={organizationIdErrMsg() ? 'invalid' : 'valid'}
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
                    {organizationIdErrMsg()}
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
                  class={['text-sm', userIdErrMsg() ? 'text-[#d32f2f]' : 'text-gray-700'].join(' ')}
                >
                  Usuario
                </div>
                <Combobox
                  options={users()}
                  // @ts-ignore
                  optionValue="id"
                  // @ts-ignore
                  optionTextValue="name" /* Sirve para filtrar */
                  // @ts-ignore
                  optionLabel="name"
                  // @ts-ignore
                  value={userId()}
                  onChange={setUserId}
                  // onInputChange={(value) => setUserId(value ?? '')}
                  validationState={userIdErrMsg() ? 'invalid' : 'valid'}
                  itemComponent={(props) => (
                    // @ts-ignore
                    <Combobox.Item item={props.item} class="combobox__item">
                      {/* @ts-ignore */}
                      <Combobox.ItemLabel>{props.item.rawValue.name}</Combobox.ItemLabel>
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
                    {userIdErrMsg()}
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
              <div class="flex flex-row items-center">
                <YellowSwitch
                  checked={isVisible() ?? false}
                  onChange={(e, value) => setIsVisible(value)}
                />
                <span class="ml-2">{isVisible() ? 'Visible' : 'Invisible'}</span>
                {isVisibleErrMsg() !== '' && (
                  <span class="ml-2 text-red-500">{isVisibleErrMsg()}</span>
                )}
              </div>
            </div>
          </Dialog>
        </Overlay>
      </Portal>
    </>
  )
}
