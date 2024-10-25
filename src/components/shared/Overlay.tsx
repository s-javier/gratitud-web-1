import { createEffect, createSignal, Show } from 'solid-js'
import { animate, timeline } from 'motion'

export default function Overlay(props: {
  isActive: boolean
  children: any
  type: 'dialog' | 'sidebar'
  width?: string
  zIndex?: string
  close?: () => void
  panelTitle?: string
}) {
  let overlayBackdropRef: HTMLDivElement
  let overlayDialogRef: HTMLDivElement
  let overlaySidebarRef: HTMLDivElement
  const [is, setIs] = createSignal(false)

  const openOverlay = () => {
    animate(overlayBackdropRef, { opacity: 1 }, { duration: 0.3 })
    if (props.type === 'dialog') {
      animate(overlayDialogRef, { transform: 'translateY(0px)', opacity: 1 }, { duration: 0.3 })
    } else {
      animate(overlaySidebarRef, { transform: 'translateX(0px)' }, { duration: 0.3 })
    }
  }

  const closeOverlay = async () => {
    if (props.type === 'dialog') {
      await timeline([
        [overlayBackdropRef, { opacity: 0 }, { duration: 0.2 }],
        [
          overlayDialogRef,
          { transform: 'translateY(-200px)', opacity: 0 },
          { at: '<', duration: 0.2 },
        ],
      ]).finished
    } else {
      await timeline([
        [overlaySidebarRef, { transform: 'translateX(100%)' }, { duration: 0.3 }],
        [overlayBackdropRef, { opacity: 0 }, { at: 0.1, duration: 0.2 }],
      ]).finished
    }
  }

  createEffect(async () => {
    if (props.isActive) {
      setIs(true)
      openOverlay()
    } else {
      await closeOverlay()
      setIs(false)
    }
  })

  return (
    <div
      class={['relative', props.zIndex ?? 'z-[1400]', is() ? '' : 'hidden'].join(' ')}
      aria-labelledby="Elemento para mostrar que está cargando"
      aria-modal="true"
    >
      <div
        // @ts-ignore
        ref={overlayBackdropRef}
        class="fixed inset-0 bg-gray-500 bg-opacity-75 opacity-0"
        aria-hidden="true"
        // in:backdropTransition={{ duration: 300 }}
        // out:backdropTransition={{ duration: 200 }}
      ></div>

      <Show when={props.type === 'dialog'}>
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <div
              // @ts-ignore
              ref={overlayDialogRef}
              class={[
                'relative overflow-hidden rounded-lg text-left',
                'w-full',
                props.width ?? 'sm:max-w-sm',
                'transform translate-y-[-200px]',
                'opacity-0',
                is() ? '' : 'hidden',
              ].join(' ')}
              // in:contentTransition={{ duration: 300 }}
              // out:contentTransition={{ duration: 200 }}
            >
              {/* ↓ Contenedor de modal, no del contenido */}
              <main class="flex flex-row items-center justify-center">{props.children}</main>
            </div>
          </div>
        </div>
      </Show>
      <Show when={props.type === 'sidebar'}>
        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              {/* Slide-over panel, show/hide based on slide-over state.

          Entering: "transform transition ease-in-out duration-500 sm:duration-700"
            From: "translate-x-full"
            To: "translate-x-0"
          Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
            From: "translate-x-0"
            To: "translate-x-full" */}
              <div
                // @ts-ignore
                ref={overlaySidebarRef}
                class={[
                  'pointer-events-auto w-screen',
                  props.width ?? 'max-w-md',
                  is() ? '' : 'hidden',
                  'transform translate-x-full',
                ].join(' ')}
                // class={[
                //   'relative overflow-hidden rounded-lg text-left',
                //   'w-full',
                //   props.width ?? 'sm:max-w-sm',
                //   'transform translate-y-[-200px]',
                //   'opacity-0',
                //   is() ? '' : 'hidden',
                // ].join(' ')}
              >
                <div class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  <div class="px-4 sm:px-6">
                    <div class="flex items-start justify-between">
                      <h2
                        class="text-base font-semibold leading-6 text-gray-900"
                        id="slide-over-title"
                      >
                        {props.panelTitle}
                      </h2>
                      <div class="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          class="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          onClick={props.close}
                        >
                          <span class="absolute -inset-2.5"></span>
                          <span class="sr-only">Close panel</span>
                          <svg
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="relative mt-6 flex-1 px-4 sm:px-6">{props.children}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  )
}
