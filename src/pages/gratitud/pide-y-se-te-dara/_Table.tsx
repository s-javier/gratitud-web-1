import { createMemo, createSignal, onMount } from 'solid-js'
import { createVirtualizer } from '@tanstack/solid-virtual'
import { TextField } from '@suid/material'
import colors from 'tailwindcss/colors'

import type { CustomError } from '~/types'
import { validateResponse } from '~/utils'
import Info from './_Info'
import Edit from './_Edit'
import Delete from './_Delete'
import Thank from '~/components/gratitude/Thank'
import TableActions from '~/components/shared/TableActions'

export default function OrganizationTable(props: { data: any[]; error: CustomError }) {
  const [gratitude, setGratitude] = createSignal<any>({})
  const [isInfoOpen, setIsInfoOpen] = createSignal(false)
  const [isEditOpen, setIsEditOpen] = createSignal(false)
  const [isDeleteOpen, setIsDeleteOpen] = createSignal(false)
  const [searchText, setSearchText] = createSignal('')
  const filteredItems = createMemo(() =>
    props.data.filter((item) => {
      return item.description.toLowerCase().includes(searchText().toLowerCase())
    }),
  )
  let elementsRef!: HTMLDivElement
  const rowVirtualizer = createVirtualizer({
    count: filteredItems().length,
    getScrollElement: () => elementsRef,
    estimateSize: () => 180,
    overscan: 5,
  })
  /* ↓ Calculamos la altura total de la lista */
  const totalHeight = createMemo(() => {
    // rowVirtualizer.getTotalSize()
    if (filteredItems().length > 100) {
      return 600
    }
    return 400
  })

  onMount(() => {
    validateResponse(props.error)
  })

  return (
    <>
      <Info isShow={isInfoOpen()} close={() => setIsInfoOpen(false)} data={gratitude()} />
      <Edit isShow={isEditOpen()} close={() => setIsEditOpen(false)} data={gratitude()} />
      <Delete isShow={isDeleteOpen()} close={() => setIsDeleteOpen(false)} data={gratitude()} />

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
      <div ref={elementsRef} class="overflow-auto">
        <div class="relative" style={{ height: `${totalHeight()}px` }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow: any) => {
            const item = filteredItems()[virtualRow.index]
            if (!item) {
              return null
            }
            return (
              <Thank virtualRow={virtualRow} item={item}>
                <TableActions
                  infoClick={() => {
                    setGratitude(item)
                    setIsInfoOpen(true)
                  }}
                  editClick={() => {
                    setGratitude(item)
                    setIsEditOpen(true)
                  }}
                  deleteClick={() => {
                    setGratitude(item)
                    setIsDeleteOpen(true)
                  }}
                />
              </Thank>
            )
          })}
        </div>
      </div>
    </>
  )
}
