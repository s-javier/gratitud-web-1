import { createEffect, createRoot, createSignal, Show } from 'solid-js'
import { Button } from '@suid/material'
import { actions } from 'astro:actions'
import * as v from 'valibot'
import { toast } from 'solid-sonner'
import { Icon } from '@iconify-icon/solid'
import { useStore } from '@nanostores/solid'
import { differenceBy } from 'es-toolkit'
import { Combobox } from '@kobalte/core/combobox'

import { $loaderOverlay, $permissions, $rolePermission, $roles } from '~/stores'
import { validateResponse } from '~/utils'
import handleResponse from './handleResponse'
import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'
import CustomToaster from '~/components/shared/CustomToaster'

export default function RoleAddPermission(props: { isShow: boolean; close: () => void }) {
  const [roleId, setRoleId] = createSignal<any>({})
  const [roleIdErrMsg, setRoleIdErrMsg] = createSignal('')
  const [permissions, setPermissions] = createSignal<any>([])
  const [permissionId, setPermissionId] = createSignal<any>({})
  const [permissionIdErrMsg, setPermissionIdErrMsg] = createSignal('')

  const roles = useStore($roles)
  const rolePermission = useStore($rolePermission)
  const originPermissions = useStore($permissions)

  createEffect(() => {
    if (roleId()?.id) {
      setRoleIdErrMsg('')
    }
    if (permissionId()?.id) {
      setPermissionIdErrMsg('')
    }
  })

  createEffect(() => {
    if (Object.keys(roleId() ?? {}).length > 0) {
      /* ↓ Permisos que ya están relacionados con el rol seleccionado */
      const permissionIds = rolePermission()
        .filter((item: any) => item.roleId === roleId().id)
        .map((item: any) => ({
          id: item.permissionId,
        }))
      /* ↓ Permisos que no están relacionados con el rol seleccionado */
      setPermissions(differenceBy(originPermissions(), permissionIds, (item) => item.id))
    } else {
      setPermissions([])
    }
  })

  const validateRequest = () => {
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
    const roleIdErr = v.safeParse(Schema.roleId, roleId()?.id ?? '')
    setRoleIdErrMsg(roleIdErr.issues ? roleIdErr.issues[0].message : '')
    const permissionIdErr = v.safeParse(Schema.permissionId, permissionId()?.id ?? '')
    setPermissionIdErrMsg(permissionIdErr.issues ? permissionIdErr.issues[0].message : '')
    const verificationResult = v.safeParse(v.object(Schema), {
      roleId: roleId()?.id ?? '',
      permissionId: permissionId()?.id ?? '',
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
    <Overlay type="dialog" isActive={props.isShow}>
      <Dialog
        title="Nueva relación Rol - Permiso"
        close={props.close}
        footer={
          <>
            <Button
              variant="outlined"
              class={[
                '!text-gray-700 !border-gray-300 hover:!bg-gray-50',
                'hover:!border-[var(--o-btn-cancel-border-hover-color)]',
              ].join(' ')}
              onClick={props.close}
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
                const { data, error }: any = await actions.roleCreateRelationPermission({
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
            <div class={['text-sm', roleIdErrMsg() ? 'text-[#d32f2f]' : 'text-gray-700'].join(' ')}>
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
                    <Icon icon="radix-icons:caret-sort" width="100%" class="w-6 text-gray-400" />
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
              class={['text-sm', permissionIdErrMsg() ? 'text-[#d32f2f]' : 'text-gray-700'].join(
                ' ',
              )}
            >
              Permiso
            </div>
            <Combobox
              disabled={permissions().length === 0}
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
                    <Icon icon="radix-icons:caret-sort" width="100%" class="w-6 text-gray-400" />
                  </Combobox.Icon>
                </Combobox.Trigger>
              </Combobox.Control>
              <Show when={permissions().length === 0}>
                <Combobox.Description>
                  <span class="text-xs text-gray-500 px-[14px] pt-[3px]">
                    Debes eligir un rol antes de eligir un permiso.
                  </span>
                </Combobox.Description>
              </Show>
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
  )
}
