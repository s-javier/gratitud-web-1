import { actions } from 'astro:actions'
import { createEffect, createRoot, createSignal } from 'solid-js'
import colors from 'tailwindcss/colors'
import { Button, TextField } from '@suid/material'
import * as v from 'valibot'
import { toast } from 'solid-sonner'

import { validateResponse } from '~/utils'
import { $loaderOverlay } from '~/stores'
import handleResponse from './handleResponse'
import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'
import PinkSwitch from '~/components/shared/Switch'
import CustomToaster from '~/components/shared/CustomToaster'

export default function userUpdate(props: {
  isShow: boolean
  close: () => void
  data: { id: string; name: string; lastName: string; email: string; isActive: boolean }
}) {
  const [name, setName] = createSignal('')
  const [nameErrMsg, setNameErrMsg] = createSignal('')
  const [email, setEmail] = createSignal('')
  const [emailErrMsg, setEmailErrMsg] = createSignal('')
  const [isActive, setIsActive] = createSignal(true)
  const [isActiveErrMsg, setIsActiveErrMsg] = createSignal('')

  createEffect(() => {
    setName(props.data.name ?? '')
    setNameErrMsg('')
    setEmail(props.data.email ?? '')
    setEmailErrMsg('')
    setIsActive(props.data.isActive ?? false)
    setIsActiveErrMsg('')
  })

  const validateRequest = () => {
    if (!props.data?.id) {
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
      name: v.pipe(
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
    const nameErr = v.safeParse(Schema.name, name())
    setNameErrMsg(nameErr.issues ? nameErr.issues[0].message : '')
    const emailErr = v.safeParse(Schema.email, email())
    setEmailErrMsg(emailErr.issues ? emailErr.issues[0].message : '')
    const isActiveErr = v.safeParse(Schema.isActive, isActive())
    setIsActiveErrMsg(isActiveErr.issues ? isActiveErr.issues[0].message : '')
    const verificationResult = v.safeParse(v.object(Schema), {
      name: name(),
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
              description="Por favor, corrige el/los error/es para poder editar el usuario."
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
        title="Edición de usuario"
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
                const { data, error }: any = await actions.userUpdate({
                  id: props.data.id,
                  name: name().trim(),
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
              Editar
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
            value={name()}
            onChange={(e) => {
              setName(e.target.value)
            }}
            onFocus={() => {
              setNameErrMsg('')
            }}
            error={nameErrMsg() !== ''}
            helperText={nameErrMsg()}
          />
          <TextField
            label="Email*"
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
            <PinkSwitch checked={isActive() ?? false} onChange={(e, value) => setIsActive(value)} />
            <span class="ml-2">{isActive() ? 'Activo' : 'Inactivo'}</span>
            {isActiveErrMsg() !== '' && <span class="ml-2 text-red-500">{isActiveErrMsg()}</span>}
          </div>
        </div>
      </Dialog>
    </Overlay>
  )
}
