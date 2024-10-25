import { navigate } from 'astro:transitions/client'
import { actions } from 'astro:actions'
import { createRoot, createSignal, onMount, Show } from 'solid-js'
import { Button } from '@suid/material'
import * as v from 'valibot'
import { toast } from 'solid-sonner'
import OtpField from 'corvu/otp-field'

import { Color } from '~/enums'
import { Page } from '~/enums'
import { validateResponse } from '~/utils'
import { $loaderOverlay } from '~/stores/loader-overlay.store'
import CustomToaster from '~/components/shared/CustomToaster'

export default function CodeForm(props: {
  continue: (value: boolean) => void
  toastId: string | number
}) {
  const [timeLimit, setTimeLimit] = createSignal(300)
  const [code, setCode] = createSignal('')

  onMount(() => {
    const interval = setInterval(() => {
      if (timeLimit() === 0) {
        clearInterval(interval)
        return
      }
      setTimeLimit((prev) => prev - 1)
    }, 1000)
  })

  const validateRequest = () => {
    const Schema = {
      code: v.pipe(
        v.custom(() => {
          return timeLimit() > 0
        }, 'Código expirado.'),
        v.string('El valor del código es inválido.'),
        v.trim(),
        v.nonEmpty('Digitar el código es obligatorio'),
        v.regex(/^[0-9]{6}$/, 'El valor del código es inválido.'),
      ),
    }
    const codeErrMsg: any[] = v.safeParse(Schema.code, code()).issues ?? []
    const verificationResult = v.safeParse(v.object(Schema), { code: code() })
    if (!verificationResult.success) {
      toast.custom(
        (t) =>
          createRoot(() => (
            <CustomToaster
              id={t}
              type="error"
              title="Error en el código"
              description={codeErrMsg[0].message}
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
    toast.dismiss(props.toastId)
    navigate(Page.ADMIN_WELCOME, { history: 'replace' })
  }

  return (
    <>
      <p class="mb-4">¡Gracias por iniciar sesión en Condimento!</p>
      <p class="mb-4">No cierres ni actulices esta página.</p>
      <p class="mb-4">Se te ha enviado un email con un código para que lo ingreses más abajo.</p>
      <p class="mb-8">
        Si el email no lo ves en tu bandeja de entrada, por favor, revisa tu carpeta de spam.
      </p>
      <div class="flex size-full items-center justify-center">
        <OtpField maxLength={6} class="flex" onValueChange={(value: string) => setCode(value)}>
          <OtpField.Input aria-label="Verification Code" />
          <div class="flex items-center space-x-2">
            <Slot index={0} />
            <Slot index={1} />
            <Slot index={2} />
          </div>
          <div class="flex size-10 items-center justify-center font-bold text-corvu-text-dark">
            -
          </div>
          <div class="flex items-center space-x-2">
            <Slot index={3} />
            <Slot index={4} />
            <Slot index={5} />
          </div>
        </OtpField>
      </div>
      <div class="mb-10 mt-4">
        {timeLimit() > 0 ? (
          <div class="text-center text-sm font-bold text-gray-400">
            Tienes {timeLimit()} segundos para ingresar el código.
          </div>
        ) : (
          <div class="text-center text-sm font-bold text-red-500">
            Oh no, se acabó el tiempo. El código expiró y no se puede volver a utilizar. Por favor,
            presiona&nbsp;
            <button
              onClick={() => {
                props.continue(false)
              }}
              class="cursor-pointer text-yellow-500 hover:underline"
            >
              aquí
            </button>
            &nbsp;para que ingreses nuevamente tu email y recibirás un nuevo código.
          </div>
        )}
      </div>
      <Button
        variant="contained"
        class="w-full !mb-8"
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
          const { data, error }: any = await actions.code(code())
          if (validateResponse(error || data?.error || null) === false) {
            $loaderOverlay.set(false)
            return
          }
          handleResponse()
        }}
      >
        Ingresar
      </Button>
      <div class="line rounded-md bg-slate-200 p-4 text-sm">
        Si el código no lo recibistes o tienes algún problema, por favor, presiona&nbsp;
        <button
          onClick={() => {
            props.continue(false)
          }}
          class="cursor-pointer text-yellow-500 hover:underline font-bold"
        >
          aquí
        </button>
        &nbsp;para que ingreses nuevamente tu email y recibirás un nuevo código.
      </div>
    </>
  )
}

const Slot = (props: { index: number }) => {
  const context = OtpField.useContext()
  const char = () => context.value()[props.index]
  const showFakeCaret = () => context.value().length === props.index && context.isInserting()

  return (
    <div
      class={[
        'flex w-10 h-12 items-center justify-center rounded-md bg-gray-200 font-mono text-lg font-bold transition-all',
        context.activeSlots().includes(props.index) ? 'ring-yellow-500 ring-2' : '',
      ].join(' ')}
    >
      {char()}
      <Show when={showFakeCaret()}>
        <div class="pointer-events-none flex items-center justify-center">
          <div class="h-4 w-px animate-caret-blink bg-corvu-text duration-1000" />
        </div>
      </Show>
    </div>
  )
}
