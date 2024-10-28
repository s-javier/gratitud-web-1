import { Show } from 'solid-js'
import { Button } from '@suid/material'

import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'

export default function GratitudeInfo(props: {
  isShow: boolean
  close: () => void
  data: { title: string; description: string }
}) {
  return (
    <Overlay type="dialog" isActive={props.isShow}>
      <Dialog
        title="Agradecimiento"
        close={props.close}
        footer={
          <Button
            variant="outlined"
            class={[
              '!m-auto',
              '!text-gray-700 !border-gray-300 hover:!bg-gray-50',
              'hover:!border-[var(--o-btn-cancel-border-hover-color)]',
            ].join(' ')}
            onClick={props.close}
          >
            Cerrar
          </Button>
        }
      >
        <div class="space-y-4">
          <Show when={props.data.title}>
            <p class="font-bold text-lg">{props.data.title}</p>
          </Show>
          <p>{props.data.description}</p>
        </div>
      </Dialog>
    </Overlay>
  )
}
