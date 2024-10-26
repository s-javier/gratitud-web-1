import { createRoot, createSignal } from 'solid-js'
import { Portal } from 'solid-js/web'
import { Button, TextField } from '@suid/material'
import { actions } from 'astro:actions'
import * as v from 'valibot'
import { toast } from 'solid-sonner'

import { Color } from '~/enums'
import { $loaderOverlay } from '~/stores'
import { validateResponse } from '~/utils'
import handleResponse from './handleResponse'
import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'
import YellowSwitch from '~/components/shared/Switch'
import CustomToaster from '~/components/shared/CustomToaster'

export default function OrganizationAdd() {
  const [isDialogOpen, setIsDialogOpen] = createSignal(false)
  const [title, setTitle] = createSignal('')
  const [titleErrMsg, setTitleErrMsg] = createSignal('')
  const [isActive, setIsActive] = createSignal(true)
  const [isActiveErrMsg, setIsActiveErrMsg] = createSignal('')

  const validateRequest = () => {
    const Schema = {
      title: v.pipe(
        v.string('El valor de este campo es inválido.'),
        v.trim(),
        v.nonEmpty('Este campo es requerido.'),
        v.minLength(4, 'Escribe un poco más.'),
        v.maxLength(100, 'Escribe menos.'),
      ),
      isActive: v.boolean('El valor de este campo es inválido.'),
    }
    const titleErr = v.safeParse(Schema.title, title())
    setTitleErrMsg(titleErr.issues ? titleErr.issues[0].message : '')
    const isActiveErr = v.safeParse(Schema.isActive, isActive())
    setIsActiveErrMsg(isActiveErr.issues ? isActiveErr.issues[0].message : '')
    const verificationResult = v.safeParse(v.object(Schema), {
      title: title(),
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
              description="Por favor, corrige el/los error/es para poder agregar una organización."
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
        onClick={() => setIsDialogOpen(true)}
      >
        Agregar
      </Button>
      <Portal>
        <Overlay type="dialog" isActive={isDialogOpen()}>
          <Dialog
            title="Nueva organización"
            close={() => setIsDialogOpen(false)}
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
                  onClick={() => setIsDialogOpen(false)}
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
                    const { data, error }: any = await actions.organizationAdd({
                      title: title().trim(),
                      isActive: isActive(),
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
              <div class="flex flex-row items-center">
                <YellowSwitch
                  checked={isActive() ?? false}
                  onChange={(e, value) => setIsActive(value)}
                />
                <span class="ml-2">{isActive() ? 'Activa' : 'Inactiva'}</span>
                {isActiveErrMsg() !== '' && (
                  <span class="ml-2 text-red-500">{isActiveErrMsg()}</span>
                )}
              </div>
            </div>
          </Dialog>
        </Overlay>
      </Portal>
    </>
  )
}
