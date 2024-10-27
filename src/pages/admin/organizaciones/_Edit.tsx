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
import YellowSwitch from '~/components/shared/Switch'
import CustomToaster from '~/components/shared/CustomToaster'

export default function OrganizationEdit(props: {
  isShow: boolean
  close: () => void
  data: { id: string; title: string; isActive: boolean }
}) {
  const [title, setTitle] = createSignal<string>('')
  const [titleErrMsg, setTitleErrMsg] = createSignal('')
  const [isActive, setIsActive] = createSignal<boolean>(false)
  const [isActiveErrMsg, setIsActiveErrMsg] = createSignal('')

  createEffect(() => {
    setTitle(props.data.title ?? '')
    setIsActive(props.data.isActive ?? false)
    setTitleErrMsg('')
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
        (t) => (
          <CustomToaster
            id={t}
            type="error"
            title="El formulario tiene algún error"
            description="Por favor, corrige el/los error/es para poder editar la organización."
          />
        ),
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
                const { data, error }: any = await actions.organizationEdit({
                  id: props.data.id,
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
              Editar
            </Button>
          </>
        }
      >
        <div class="space-y-4">
          <TextField
            label="Título*"
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
          <div class="flex flex-row items-center">
            <YellowSwitch
              checked={isActive() ?? false}
              onChange={(e, value) => setIsActive(value)}
              inputProps={{ 'aria-label': 'switch de activa' }}
            />
            <span class="ml-2">{isActive() ? 'Activa' : 'Inactiva'}</span>
            {isActiveErrMsg() !== '' && <span class="ml-2 text-red-500">{isActiveErrMsg()}</span>}
          </div>
        </div>
      </Dialog>
    </Overlay>
  )
}
