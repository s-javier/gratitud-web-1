import { createSignal, For, onMount, Show } from 'solid-js'
import { IconButton } from '@suid/material'
import MenuIcon from '@suid/icons-material/Menu'
import { Icon } from '@iconify-icon/solid'
import ChevronRightIcon from '@suid/icons-material/ChevronRight'

import { $loaderBar } from '~/stores'
import Overlay from '~/components/shared/Overlay'

export default function AdminMenu(props: {
  menu: any[]
  currentPath: string
  organizations: any[]
}) {
  const [isOpen, setIsOpen] = createSignal(false)
  const [openItems, setOpenItems] = createSignal({})
  const [pages, setPages] = createSignal<any[]>([])

  const getPrefix = (path: string) => {
    const parts = path.split('/')
    return parts.slice(0, 3).join('/')
  }

  onMount(() => {
    const groupedData: any = []
    const sections: any = {}
    for (const item of props.menu) {
      const prefix = getPrefix(item.path)
      if (sections[prefix]) {
        // Si el prefijo ya existe, añadimos a los children
        sections[prefix].children.push({
          path: item.path,
          menuTitle: item.title,
          menuIcon: item.icon,
        })
      } else {
        // Si no existe, creamos un nuevo grupo o agregamos directamente al resultado
        if (props.menu.filter((el: any) => getPrefix(el.path) === prefix).length > 1) {
          sections[prefix] = {
            menuTitle: item.title,
            menuIcon: item.icon,
            children: [
              {
                path: item.path,
                menuTitle: 'Ver ' + item.title.toLowerCase(),
                menuIcon: item.icon,
              },
            ],
          }
          groupedData.push(sections[prefix])
        } else {
          groupedData.push(item)
        }
      }
    }
    setPages(groupedData)
  })

  // @ts-ignore
  const toggleItem = (name) => {
    setOpenItems((prev) => ({
      ...prev,
      // @ts-ignore
      [name]: !prev[name],
    }))
  }

  const activeLoaderBar = () => {
    $loaderBar.set(true)
  }

  return (
    <>
      <IconButton
        onClick={() => setIsOpen(true)}
        aria-label="menu"
        sx={{
          color: '#9ca3af', // Color del texto
          '&:hover': {
            color: 'white',
          },
        }}
      >
        <MenuIcon />
      </IconButton>
      <Overlay
        type="sidebar"
        width="!w-[350px]"
        isActive={isOpen()}
        zIndex="z-[1400]"
        close={() => setIsOpen(false)}
        panelTitle={props.organizations.filter((item: any) => item.isSelected)[0].title}
      >
        <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white">
          <nav class="flex flex-1 flex-col">
            <ul role="list" class="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" class="space-y-1">
                  <For each={pages()}>
                    {(item) => (
                      <li>
                        <Show when={!item.children}>
                          <a
                            href={item.path}
                            class={[
                              props.currentPath === item.path ? 'bg-yellow-50' : 'hover:bg-gray-50',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold',
                              'leading-6 text-gray-700',
                            ].join(' ')}
                            onClick={activeLoaderBar}
                          >
                            <Icon icon={item.icon} width="100%" class="w-5 text-gray-400" />
                            {item.title}
                          </a>
                        </Show>
                        <Show when={item.children}>
                          <div>
                            <button
                              onClick={() => toggleItem(item.menuTitle)}
                              class={[
                                props.currentPath === item.path
                                  ? 'bg-yellow-50'
                                  : 'hover:bg-gray-50',
                                'group flex w-full items-center gap-x-3 rounded-md p-2',
                                'text-left text-sm font-semibold leading-6 text-gray-700',
                              ].join(' ')}
                            >
                              <Icon icon={item.menuIcon} width="100%" class="w-5 text-gray-400" />
                              {item.menuTitle}
                              <ChevronRightIcon
                                aria-hidden="true"
                                class={[
                                  'ml-auto h-5 w-5 shrink-0 text-gray-400 transition-transform',
                                  // @ts-ignore
                                  openItems()[item.menuTitle] ? 'rotate-90 text-gray-500' : '',
                                ].join(' ')}
                              />
                            </button>
                            {/* @ts-ignore */}
                            <Show when={openItems()[item.menuTitle]}>
                              <ul class="mt-1 px-2">
                                <For each={item.children}>
                                  {(subItem) => (
                                    <li>
                                      <a
                                        href={subItem.path}
                                        class={[
                                          // @ts-ignore
                                          props.currentPath === subItem.path
                                            ? 'bg-yellow-50'
                                            : 'hover:bg-gray-50',
                                          'block rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-gray-700',
                                        ].join(' ')}
                                        onClick={activeLoaderBar}
                                      >
                                        {subItem.menuTitle}
                                      </a>
                                    </li>
                                  )}
                                </For>
                              </ul>
                            </Show>
                          </div>
                        </Show>
                      </li>
                    )}
                  </For>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </Overlay>
    </>
  )
}