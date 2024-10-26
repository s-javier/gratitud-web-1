import { createEffect, createRoot, createSignal } from 'solid-js'
import { Portal } from 'solid-js/web'
import { Button, TextField } from '@suid/material'
import { actions } from 'astro:actions'
import * as v from 'valibot'
import { toast } from 'solid-sonner'
import { Combobox } from '@kobalte/core/combobox'
import { Icon } from '@iconify-icon/solid'
import { useStore } from '@nanostores/solid'

import { Color } from '~/enums'
import { $loaderOverlay, $permissions } from '~/stores'
import { validateResponse } from '~/utils'
import handleResponse from './handleResponse'
import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'
import CustomToaster from '~/components/shared/CustomToaster'

export default function MenuPageAdd() {
  const [isOpenDialog, setIsOpenDialog] = createSignal(false)
  const [permissionId, setPermissionId] = createSignal<any>({})
  const [permissionIdErrMsg, setPermissionIdErrMsg] = createSignal('')
  const [title, setTitle] = createSignal('')
  const [titleErrMsg, setTitleErrMsg] = createSignal('')
  const [sort, setSort] = createSignal('')
  const [sortErrMsg, setSortErrMsg] = createSignal('')
  const [icon, setIcon] = createSignal('')
  const [iconErrMsg, setIconErrMsg] = createSignal('')

  const permissions = useStore($permissions)

  createEffect(() => {
    if (permissionId().id) {
      setPermissionIdErrMsg('')
    }
  })

  const validateRequest = () => {
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
        v.minLength(4, 'Escribe un poco más.'),
        v.maxLength(50, 'Escribe menos.'),
      ),
      sort: v.optional(
        v.pipe(
          v.string('El valor de este campo es inválido.'),
          v.trim(),
          v.nonEmpty('Este campo es requerido.'),
          v.digits('El valor de este campo es inválido.'),
        ),
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
    const sortErr = v.safeParse(Schema.sort, sort() || undefined)
    setSortErrMsg(sortErr.issues ? sortErr.issues[0].message : '')
    const iconErr = v.safeParse(Schema.icon, icon() || undefined)
    setIconErrMsg(iconErr.issues ? iconErr.issues[0].message : '')
    const verificationResult = v.safeParse(v.object(Schema), {
      permissionId: permissionId().id,
      title: title(),
      sort: sort() || undefined,
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
              description="Por favor, corrige el/los error/es para poder agregar una página de menú."
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
        sx={{
          backgroundColor: Color.BTN_PRIMARY_BG,
          color: Color.BTN_PRIMARY_TEXT,
          '&:hover': {
            backgroundColor: Color.BTN_PRIMARY_BG_HOVER,
          },
        }}
        onClick={() => setIsOpenDialog(true)}
      >
        Agregar
      </Button>
      <Portal>
        <Overlay type="dialog" isActive={isOpenDialog()}>
          <Dialog
            title="Nueva página de menú"
            close={() => setIsOpenDialog(false)}
            footer={
              <>
                <Button
                  variant="outlined"
                  sx={{
                    color: Color.BTN_CANCEL_TEXT,
                    borderColor: Color.BTN_CANCEL_BORDER,
                    '&:hover': {
                      backgroundColor: Color.BTN_CANCEL_BG_HOVER,
                      borderColor: Color.BTN_CANCEL_BORDER_HOVER,
                    },
                  }}
                  onClick={() => setIsOpenDialog(false)}
                >
                  Cerrar
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: Color.BTN_PRIMARY_BG,
                    color: Color.BTN_PRIMARY_TEXT,
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: Color.BTN_PRIMARY_BG_HOVER,
                    },
                  }}
                  onClick={async () => {
                    if (validateRequest() === false) {
                      return
                    }
                    $loaderOverlay.set(true)
                    const { data, error }: any = await actions.menuPageAdd({
                      permissionId: permissionId().id.trim(),
                      title: title().trim(),
                      sort: parseInt(sort().trim() || '0'),
                      icon: icon().trim() || undefined,
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
                    permissionIdErrMsg() ? 'text-[#d32f2f]' : 'text-gray-700',
                  ].join(' ')}
                >
                  Ruta
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
              <TextField
                label="Título*"
                variant="outlined"
                class="w-full"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: Color.TEXT_FIELD_BORDER_HOVER,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: Color.TEXT_FIELD_BORDER_FOCUS,
                    },
                  },
                  '& label.Mui-focused': {
                    color: Color.TEXT_FIELD_LABEL_FOCUS,
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
                label="Posición en el menú"
                type="number"
                variant="outlined"
                class="w-full"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: Color.TEXT_FIELD_BORDER_HOVER,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: Color.TEXT_FIELD_BORDER_FOCUS,
                    },
                  },
                  '& label.Mui-focused': {
                    color: Color.TEXT_FIELD_LABEL_FOCUS,
                  },
                }}
                value={sort()}
                onChange={(e, value) => {
                  setSort(value)
                }}
                onFocus={() => {
                  setSortErrMsg('')
                }}
                error={sortErrMsg() !== ''}
                helperText={sortErrMsg()}
              />
              <TextField
                label="Ícono"
                variant="outlined"
                class="w-full"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: Color.TEXT_FIELD_BORDER_HOVER,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: Color.TEXT_FIELD_BORDER_FOCUS,
                    },
                  },
                  '& label.Mui-focused': {
                    color: Color.TEXT_FIELD_LABEL_FOCUS,
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
      </Portal>
    </>
  )
}
