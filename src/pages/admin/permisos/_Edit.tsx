import { actions } from 'astro:actions'
import { createEffect, createRoot, createSignal, For } from 'solid-js'
import colors from 'tailwindcss/colors'
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@suid/material'
import * as v from 'valibot'
import { toast } from 'solid-sonner'

import { validateResponse } from '~/utils'
import { $loaderOverlay } from '~/stores'
import handleResponse from './handleResponse'
import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'
import CustomToaster from '~/components/shared/CustomToaster'

export default function roleUpdate(props: {
  isShow: boolean
  close: () => void
  data: { id: string; path: string; type: string }
}) {
  const [path, setPath] = createSignal('')
  const [pathErrMsg, setPathErrMsg] = createSignal('')
  const [type, setType] = createSignal('')
  const [typeErrMsg, setTypeErrMsg] = createSignal('')

  createEffect(() => {
    setPath(props.data.path ?? '')
    setPathErrMsg('')
    setType(props.data.type ?? '')
    setTypeErrMsg('')
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
      path: v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.nonEmpty('Este campo es requerido.'),
        v.minLength(4, 'Escribe un poco más.'),
        v.maxLength(100, 'Escribe menos.'),
      ),
      type: v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.nonEmpty('Este campo es requerido.'),
        v.picklist(['api', 'view'], 'El valor de este campo es inválido.'),
      ),
    }
    const pathErr = v.safeParse(Schema.path, path())
    setPathErrMsg(pathErr.issues ? pathErr.issues[0].message : '')
    const typeErr = v.safeParse(Schema.type, type())
    setTypeErrMsg(typeErr.issues ? typeErr.issues[0].message : '')
    const verificationResult = v.safeParse(v.object(Schema), { path: path(), type: type() })
    if (!verificationResult.success) {
      toast.custom(
        (t) =>
          createRoot(() => (
            <CustomToaster
              id={t}
              type="error"
              title="El formulario tiene algún error"
              description="Por favor, corrige el/los error/es para poder editar el permiso."
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
        title="Edición de permiso"
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
                '!font-bold',
                '!text-[var(--o-btn-primary-text-color)]',
                '!bg-[var(--o-btn-primary-bg-color)]',
                'hover:!bg-[var(--o-btn-primary-bg-hover-color)]',
              ].join(' ')}
              onClick={async () => {
                if (validateRequest() === false) {
                  return
                }
                $loaderOverlay.set(true)
                const { data, error }: any = await actions.permissionUpdate({
                  id: props.data.id,
                  path: path().trim(),
                  type: type().trim(),
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
          <TextField
            label="Ruta*"
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
            value={path()}
            onChange={(e) => {
              setPath(e.target.value)
            }}
            onFocus={() => {
              setPathErrMsg('')
            }}
            error={pathErrMsg() !== ''}
            helperText={pathErrMsg()}
          />
          <FormControl
            fullWidth
            error={typeErrMsg() !== ''}
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
          >
            <InputLabel>Tipo*</InputLabel>
            <Select
              label="Tipo*"
              value={type()}
              onChange={(e) => {
                setType(e.target.value)
              }}
              onFocus={() => {
                setTypeErrMsg('')
              }}
            >
              <For
                each={[
                  { label: 'API', value: 'api' },
                  { label: 'Vista', value: 'view' },
                ]}
              >
                {(option) => <MenuItem value={option.value}>{option.label}</MenuItem>}
              </For>
            </Select>
            <FormHelperText>{typeErrMsg()}</FormHelperText>
          </FormControl>
        </div>
      </Dialog>
    </Overlay>
  )
}
