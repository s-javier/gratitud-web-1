import { Show } from 'solid-js'
import { IconButton } from '@suid/material'
import FilterListIcon from '@suid/icons-material/FilterList'
import FilterListOffIcon from '@suid/icons-material/FilterListOff'

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
          sx={{
            color: '#9ca3af', // Color del texto
            '&:hover': {
              color: '#eab308',
            },
          }}
          onClick={() => props.handleGlobalFilter(false)}
        >
          <FilterListOffIcon />
        </IconButton>
      </Show>
      <Show when={props.isFilter === false}>
        <IconButton
          aria-label="menu"
          sx={{
            color: '#9ca3af', // Color del texto
            '&:hover': {
              color: '#eab308',
            },
          }}
          onClick={() => props.handleGlobalFilter(true)}
        >
          <FilterListIcon />
        </IconButton>
      </Show>
    </div>
  )
}
