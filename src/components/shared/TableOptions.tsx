import { Show } from 'solid-js'
import { IconButton } from '@suid/material'
import { Icon } from '@iconify-icon/solid'

export default function TableOptions(props: {
  positionClass?: string
  isFilter: boolean
  handleGlobalFilter: (value: boolean) => void
}) {
  return (
    <div class={props.positionClass ?? '-ml-4'}>
      <Show when={props.isFilter}>
        <IconButton
          aria-label="menu"
          class="!text-gray-400 hover:!text-[var(--o-btn-filter-text-hover-color)]"
          onClick={() => props.handleGlobalFilter(false)}
        >
          <Icon icon="mdi:filter-variant-remove" width="100%" class="w-6" />
        </IconButton>
      </Show>
      <Show when={props.isFilter === false}>
        <IconButton
          aria-label="menu"
          class="!text-gray-400 hover:!text-[var(--o-btn-filter-text-hover-color)]"
          onClick={() => props.handleGlobalFilter(true)}
        >
          <Icon icon="mdi:filter-variant" width="100%" class="w-6" />
        </IconButton>
      </Show>
    </div>
  )
}
