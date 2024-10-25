import { actions } from 'astro:actions'
import { createEffect, createRoot, createSignal } from 'solid-js'
import { Button, TextField } from '@suid/material'
import * as v from 'valibot'
import { toast } from 'solid-sonner'

import { Color } from '~/enums'
import { validateResponse } from '~/utils'
import { $loaderOverlay } from '~/stores'
import handleResponse from './handleResponse'
import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'
import YellowSwitch from '~/components/shared/Switch'
import CustomToaster from '~/components/shared/CustomToaster'

export default function UserEdit(props: {
  isShow: boolean
  close: () => void
  data: { id: string; firstName: string; lastName: string; email: string; isActive: boolean }
}) {
  const [firstName, setFirstName] = createSignal('')
  const [firstNameErrMsg, setFirstNameErrMsg] = createSignal('')
  const [lastName, setLastName] = createSignal('')
  const [lastNameErrMsg, setLastNameErrMsg] = createSignal('')
  const [email, setEmail] = createSignal('')
  const [emailErrMsg, setEmailErrMsg] = createSignal('')
  const [isActive, setIsActive] = createSignal(true)
  const [isActiveErrMsg, setIsActiveErrMsg] = createSignal('')

  createEffect(() => {
    setFirstName(props.data.firstName ?? '')
    setFirstNameErrMsg('')
    setLastName(props.data.lastName ?? '')
    setLastNameErrMsg('')
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
                const { data, error }: any = await actions.userEdit({
                  id: props.data.id,
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
            {isActiveErrMsg() !== '' && <span class="ml-2 text-red-500">{isActiveErrMsg()}</span>}
          </div>
        </div>
      </Dialog>
    </Overlay>
  )
}
