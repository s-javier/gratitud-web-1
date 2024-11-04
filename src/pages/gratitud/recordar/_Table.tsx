import { actions } from 'astro:actions'
import { createMemo, createSignal, For, onMount, Show } from 'solid-js'
import { Button, TextField } from '@suid/material'
import colors from 'tailwindcss/colors'

import { $loaderOverlay } from '~/stores'
import handleResponse from './handleResponse'
import type { CustomError } from '~/types'
import { validateResponse } from '~/utils'
import Info from './_Info'
import Thank from '~/components/gratitude/Thank'
import TableActions from '~/components/shared/TableActions'

export default function MyGratitudeTable(props: { data: any[]; error: CustomError }) {
  const [gratitude, setGratitude] = createSignal<any>({})
  const [isInfoOpen, setIsInfoOpen] = createSignal(false)
  const [searchText, setSearchText] = createSignal('')
  const filteredItems = createMemo(() =>
    props.data.filter((item) => {
      return item.description.toLowerCase().includes(searchText().toLowerCase())
    }),
  )

  onMount(() => {
    validateResponse(props.error)
  })

  return (
    <>
      <Info isShow={isInfoOpen()} close={() => setIsInfoOpen(false)} data={gratitude()} />

      <TextField
        label="Buscar según descripción"
        variant="outlined"
        class="w-full !mb-10"
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
        value={searchText()}
        onChange={(e: any) => {
          setSearchText(e.target.value)
        }}
        // helperText={titleErrMsg()}
      />

      <p class="text-sm text-gray-500 text-center mb-4">
        Estas viendo {filteredItems().length}{' '}
        {filteredItems().length === 1 ? 'agradecimiento' : 'agradecimientos'}.
      </p>
      <For each={filteredItems()}>
        {(item, index) => (
          <Thank index={index()} item={item}>
            <TableActions
              infoClick={() => {
                setGratitude(item)
                setIsInfoOpen(true)
              }}
            />
          </Thank>
        )}
      </For>

      <Show when={props.data.length > 0}>
        <div class="text-center pt-4">
          <Button
            variant="contained"
            class={[
              '!font-bold',
              '!text-[var(--o-btn-primary-text-color)]',
              '!bg-[var(--o-btn-primary-bg-color)]',
              'hover:!bg-[var(--o-btn-primary-bg-hover-color)]',
            ].join(' ')}
            onClick={async () => {
              $loaderOverlay.set(true)
              const { data, error }: any = await actions.gratitudeRemind(
                props.data.map((item: any) => item.id),
              )
              if (validateResponse(error || data?.error || null) === false) {
                $loaderOverlay.set(false)
                return
              }
              handleResponse()
            }}
          >
            Recordé
          </Button>
        </div>
      </Show>
    </>
  )
}
