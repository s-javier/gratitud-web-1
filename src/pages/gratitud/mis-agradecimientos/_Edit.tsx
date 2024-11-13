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
import CustomToaster from '~/components/shared/CustomToaster'

export default function gratitudeUpdate(props: {
  isShow: boolean
  close: () => void
  data: { id: string; title: string; description: string }
}) {
  const [title, setTitle] = createSignal('')
  const [titleErrMsg, setTitleErrMsg] = createSignal('')
  const [description, setDescription] = createSignal('')
  const [descriptionErrMsg, setDescriptionErrMsg] = createSignal('')

  createEffect(() => {
    setTitle(props.data.title ?? '')
    setTitleErrMsg('')
    setDescription(props.data.description ?? '')
    setDescriptionErrMsg('')
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
      title: v.optional(
        v.pipe(
          v.string('El valor de este campo es inválido.'),
          v.trim(),
          v.nonEmpty('Este campo es requerido.'),
          v.minLength(4, 'Escribe un poco más.'),
          v.maxLength(100, 'Escribe menos.'),
        ),
      ),
      description: v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.nonEmpty('Este campo es requerido.'),
        v.minLength(4, 'Escribe un poco más.'),
        v.maxLength(400, 'Escribe menos.'),
      ),
    }
    const titleErr = v.safeParse(Schema.title, title() || undefined)
    setTitleErrMsg(titleErr.issues ? titleErr.issues[0].message : '')
    const descriptionErr = v.safeParse(Schema.description, description())
    setDescriptionErrMsg(descriptionErr.issues ? descriptionErr.issues[0].message : '')
    const verificationResult = v.safeParse(v.object(Schema), {
      title: title() || undefined,
      description: description(),
    })
    if (!verificationResult.success) {
      toast.custom(
        (t) =>
          createRoot(() => (
            <CustomToaster
              id={t}
              type="error"
              title="El formulario tiene algún error"
              description="Por favor, corrige el/los error/es para poder agregar un agradecimiento."
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
    <Overlay type="dialog" width="max-w-[500px]" isActive={props.isShow}>
      <Dialog
        title="Edición de organización"
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
                const { data, error }: any = await actions.gratitudeUpdate({
                  id: props.data.id,
                  title: title().trim() || undefined,
                  description: description().trim(),
                  isMaterialized: true,
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
        <div class="space-y-4 mb-8">
          <p class="">A continuación puedese editar un agradecimiento.</p>
          <p class="text-sm text-gray-400">(*) Campos obligatorios.</p>
        </div>
        <div class="space-y-4">
          <TextField
            label="Título"
            variant="outlined"
            fullWidth
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
          <TextField
            label="Descripción*"
            variant="outlined"
            multiline
            fullWidth
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
            value={description()}
            onChange={(e) => {
              setDescription(e.target.value)
            }}
            onFocus={() => {
              setDescriptionErrMsg('')
            }}
            error={descriptionErrMsg() !== ''}
            helperText={descriptionErrMsg()}
          />
        </div>
      </Dialog>
    </Overlay>
  )
}
