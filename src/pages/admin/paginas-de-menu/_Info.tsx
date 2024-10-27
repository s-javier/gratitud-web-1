import { Button } from '@suid/material'
import { Icon } from '@iconify-icon/solid'

import Overlay from '~/components/shared/Overlay'

export default function RoleInfo(props: {
  isShow: boolean
  close: () => void
  data: {
    title: string
    path: string
    sort: string
    icon: string
  }
}) {
  return (
    <Overlay type="dialog" isActive={props.isShow}>
      <div
        class={[
          'o-dialog',
          'pointer-events-auto flex w-full flex-col overflow-hidden rounded-xl',
          'border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800',
          'dark:shadow-neutral-700/70',
        ].join(' ')}
        style="max-height: calc(100vh - 32px)"
      >
        <header
          class={[
            'o-dialog-header',
            'flex items-center justify-between border-b px-4 py-3',
            'dark:border-neutral-700',
          ].join(' ')}
        >
          <h3 id="hire-modal-label" class="text-lg font-semibold text-white">
            Página de menú
          </h3>
          <button
            type="button"
            class={[
              'o-dialog-header-close-btn',
              'inline-flex size-8 items-center justify-center gap-x-2 rounded-full',
              'border border-transparent focus:outline-none',
              'disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-700',
              'dark:text-neutral-400 dark:hover:bg-neutral-600 dark:focus:bg-neutral-600',
            ].join(' ')}
            aria-label="Close"
            onClick={props.close}
          >
            <span class="sr-only">Close</span>
            <svg
              class="size-4 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </header>
        <main class="overflow-y-auto p-4 pb-8">
          <div class="mb-4">
            <p class="font-bold">Título</p>
            <p>{props.data.title}</p>
          </div>
          <div class="mb-4">
            <p class="font-bold">Ruta</p>
            <p>{props.data.path}</p>
          </div>
          <div class="mb-4">
            <p class="font-bold">Posición en el menú</p>
            <p>{props.data.sort}</p>
          </div>
          <div class="mb-4">
            <p class="font-bold">Ícono</p>
            <p>
              {props.data.icon ? (
                <Icon
                  icon={props.data.icon as string}
                  width="100%"
                  class="w-5 text-gray-400 left-5 absolute o-active"
                />
              ) : (
                <span class="text-gray-400">Sin ícono</span>
              )}
            </p>
          </div>
        </main>
        <footer
          class={[
            'flex items-center justify-center gap-x-2 border-t px-4 py-3',
            'dark:border-neutral-700',
          ].join(' ')}
        >
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
        </footer>
      </div>
    </Overlay>
  )
}
