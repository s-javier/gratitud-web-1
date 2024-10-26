import { actions } from 'astro:actions'
import { createRoot, createSignal } from 'solid-js'
import { TextField } from '@suid/material'
import { Button } from '@suid/material'
import { toast } from 'solid-sonner'
import * as v from 'valibot'

import { Color } from '~/enums'
import { validateResponse } from '~/utils'
import { $loaderOverlay } from '~/stores'
import CustomToaster from '~/components/shared/CustomToaster'

export default function LoginForm(props: {
  continue: (value: boolean) => void
  setId: (value: string | number) => void
}) {
  const [email, setEmail] = createSignal('')
  const [emailErrMsg, setEmailErrMsg] = createSignal('')

  const validateRequest = () => {
    const Schema = {
      email: v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.nonEmpty('Este campo es requerido.'),
        v.email('El valor de este campo es inválido.'),
      ),
    }
    const err = v.safeParse(Schema.email, email())
    setEmailErrMsg(err.issues ? err.issues[0].message : '')
    const verificationResult = v.safeParse(v.object(Schema), { email: email() })
    if (!verificationResult.success) {
      toast.custom(
        (t) =>
          createRoot(() => (
            <CustomToaster
              id={t}
              type="error"
              title="Error en el email"
              description="Por favor, corrige el error para poder ingresar."
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

  const handleResponse = () => {
    props.continue(true)
    const id = toast.custom(
      (t) =>
        createRoot(() => (
          <CustomToaster
            id={t}
            type="info"
            title="Último paso"
            description="Por favor, ingresa el código enviado a tu email."
          />
        )),
      {
        duration: Number.POSITIVE_INFINITY,
      },
    )
    props.setId(id)
  }

  return (
    <>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        class="!mb-8"
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
      <Button
        variant="contained"
        class="w-full"
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
          const { data, error }: any = await actions.login(email().trim())
          $loaderOverlay.set(false)
          if (validateResponse(error || data?.error || null) === false) {
            return
          }
          handleResponse()
        }}
      >
        Enviar
      </Button>
    </>
  )
}
