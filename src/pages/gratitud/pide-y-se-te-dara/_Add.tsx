import { actions } from 'astro:actions'
import { createRoot, createSignal } from 'solid-js'
import { Portal } from 'solid-js/web'
import colors from 'tailwindcss/colors'
import { Button, TextField } from '@suid/material'
import * as v from 'valibot'
import { toast } from 'solid-sonner'

import { $loaderOverlay } from '~/stores'
import { validateResponse } from '~/utils'
import handleResponse from './handleResponse'
import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'
import CustomToaster from '~/components/shared/CustomToaster'

export default function OrganizationAdd() {
  const [isDialogOpen, setIsDialogOpen] = createSignal(false)
  const [title, setTitle] = createSignal('')
  const [titleErrMsg, setTitleErrMsg] = createSignal('')
  const [description, setDescription] = createSignal('')
  const [descriptionErrMsg, setDescriptionErrMsg] = createSignal('')

  const validateRequest = () => {
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
    <>
      <Button
        variant="contained"
        size="small"
        class={[
          '!text-[var(--o-btn-primary-text-color)]',
          '!bg-[var(--o-btn-primary-bg-color)]',
          'hover:!bg-[var(--o-btn-primary-bg-hover-color)]',
        ].join(' ')}
        onClick={() => setIsDialogOpen(true)}
      >
        Agregar
      </Button>
      <Portal>
        <Overlay type="dialog" width="max-w-[500px]" isActive={isDialogOpen()}>
          <Dialog
            title="Nuevo agradecimiento"
            close={() => setIsDialogOpen(false)}
            footer={
              <>
                <Button
                  variant="outlined"
                  class={[
                    '!text-gray-700 !border-gray-300 hover:!bg-gray-50',
                    'hover:!border-[var(--o-btn-cancel-border-hover-color)]',
                  ].join(' ')}
                  onClick={() => setIsDialogOpen(false)}
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
                    const { data, error }: any = await actions.gratitudeAdd({
                      title: title().trim() || undefined,
                      description: description().trim(),
                      isMaterialized: false,
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
            <div class="space-y-4 mb-8">
              <p class="">A continuación puedese agregar un agradecimiento.</p>
              <p class="text-sm text-gray-400">(*) Campos obligatorios.</p>
            </div>
            <div class="space-y-4">
              <TextField
                label="Título"
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
      </Portal>
    </>
  )
}
