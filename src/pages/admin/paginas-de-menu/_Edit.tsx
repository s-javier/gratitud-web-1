import { actions } from 'astro:actions'
import { createEffect, createRoot, createSignal } from 'solid-js'
import colors from 'tailwindcss/colors'
import { Combobox } from '@kobalte/core/combobox'
import { Button, TextField } from '@suid/material'
import * as v from 'valibot'
import { toast } from 'solid-sonner'
import { Icon } from '@iconify-icon/solid'

import { validateResponse } from '~/utils'
import { $loaderOverlay } from '~/stores'
import handleResponse from './handleResponse'
import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'
import CustomToaster from '~/components/shared/CustomToaster'

export default function RoleEdit(props: {
  isShow: boolean
  close: () => void
  data: {
    id: string
    title: string
    path: string
    sort: number
    icon?: string
    permissionId: string
  }
  permissions: { id: string; path: string }[]
}) {
  const [permissionId, setPermissionId] = createSignal<any>({})
  const [permissionIdErrMsg, setPermissionIdErrMsg] = createSignal('')
  const [title, setTitle] = createSignal('')
  const [titleErrMsg, setTitleErrMsg] = createSignal('')
  const [icon, setIcon] = createSignal('')
  const [iconErrMsg, setIconErrMsg] = createSignal('')

  createEffect(() => {
    setPermissionId({ id: props.data.permissionId, path: props.data.path })
    setPermissionIdErrMsg('')
    setTitle(props.data.title ?? '')
    setTitleErrMsg('')
    setIcon(props.data.icon ?? '')
    setIconErrMsg('')
  })

  const validateRequest = () => {
    if (!props.data.id) {
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
    const Schema = {
      permissionId: v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.nonEmpty('Este campo es requerido.'),
        v.regex(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
          'El valor de este campo es inválido.',
        ),
      ),
      title: v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.nonEmpty('Este campo es requerido.'),
        v.minLength(3, 'Escribe un poco más.'),
        v.maxLength(50, 'Escribe menos.'),
      ),
      icon: v.optional(
        v.pipe(
          v.string('El valor de este campo es inválido.'),
          v.trim(),
          v.minLength(4, 'Escribe un poco más.'),
          v.maxLength(50, 'Escribe menos.'),
        ),
      ),
    }
    const permissionIdErr = v.safeParse(Schema.permissionId, permissionId().id ?? '')
    setPermissionIdErrMsg(permissionIdErr.issues ? permissionIdErr.issues[0].message : '')
    const titleErr = v.safeParse(Schema.title, title())
    setTitleErrMsg(titleErr.issues ? titleErr.issues[0].message : '')
    const iconErr = v.safeParse(Schema.icon, icon() || undefined)
    setIconErrMsg(iconErr.issues ? iconErr.issues[0].message : '')
    const verificationResult = v.safeParse(v.object(Schema), {
      permissionId: permissionId().id,
      title: title(),
      icon: icon() || undefined,
    })
    if (!verificationResult.success) {
      toast.custom(
        (t) =>
          createRoot(() => (
            <CustomToaster
              id={t}
              type="error"
              title="El formulario tiene algún error"
              description="Por favor, corrige el/los error/es para poder editar una página de menú."
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
        title="Edición de una página de menú"
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
                const { data, error }: any = await actions.menuPageEdit({
                  id: props.data.id,
                  permissionId: permissionId().id.trim(),
                  title: title().trim(),
                  icon: icon().trim() || undefined,
                })
                if (validateResponse(error || data?.error || null) === false) {
                  $loaderOverlay.set(false)
                  return
                }
                handleResponse()
              }}
            >
              Editar
            </Button>
          </>
        }
      >
        <div class="space-y-4">
          <div>
            <div
              class={['text-sm', permissionIdErrMsg() ? 'text-[#d32f2f]' : 'text-gray-700'].join(
                ' ',
              )}
            >
              Ruta
            </div>
            <Combobox
              options={props.permissions}
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
                  <Combobox.ItemLabel>{props.item.rawValue.path}</Combobox.ItemLabel>
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
                {permissionIdErrMsg()}
              </Combobox.ErrorMessage>
              <Combobox.Portal>
                <Combobox.Content class="combobox__content">
                  <Combobox.Listbox class="combobox__listbox" />
                </Combobox.Content>
              </Combobox.Portal>
            </Combobox>
          </div>
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
          <TextField
            label="Ícono"
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
            value={icon()}
            onChange={(e) => {
              setIcon(e.target.value)
            }}
            onFocus={() => {
              setIconErrMsg('')
            }}
            error={iconErrMsg() !== ''}
            helperText={iconErrMsg()}
          />
        </div>
      </Dialog>
    </Overlay>
  )
}
