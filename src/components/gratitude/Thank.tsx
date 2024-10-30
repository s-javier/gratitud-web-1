import { twMerge } from 'tailwind-merge'
import dayjs from 'dayjs'

export default function Thank(props: { virtualRow?: any; item: any; children?: any }) {
  return (
    <div
      style={{
        height: `${props.virtualRow.size}px`,
        transform: `translateY(${props.virtualRow.start}px)`,
      }}
      class={twMerge(
        'absolute top-0 left-0',
        'w-full p-4 border-b transition-colors hover:bg-blue-50',
        props.virtualRow.index % 2 === 0 && 'bg-gray-50',
        props.virtualRow.index % 2 !== 0 && 'bg-white',
      )}
    >
      <div class="h-full flex flex-row justify-between items-center gap-4">
        <div class="flex flex-col justify-center flex-1">
          <h3 class={twMerge('font-semibold text-gray-900', props.item.title && 'mb-2')}>
            {props.item.title}
          </h3>
          <p class="text-gray-700 mb-2">{props.item.description}</p>
          <p class="text-xs text-gray-500 text-right">
            {dayjs(props.item.createdAt).format('DD [ de] MMM [de] YY')}
          </p>
        </div>
        {props.children}
      </div>
    </div>
  )
}
