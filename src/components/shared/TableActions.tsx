import { createSignal, Show } from 'solid-js'
import { IconButton, ListItemIcon, Menu, MenuItem } from '@suid/material'
import { Icon } from '@iconify-icon/solid'

export default function TableActions(props: {
  infoClick?: () => void
  editClick?: () => void
  deleteClick?: () => void
}) {
  const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null)

  return (
    <div class="flex flex-row justify-end">
      <IconButton
        aria-label="menu"
        class="!text-gray-400 hover:!text-[var(--o-btn-filter-text-hover-color)]"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <Icon icon="mdi:more-vert" width="100%" class="w-6" />
      </IconButton>
      <Menu
        anchorEl={anchorEl()}
        id="account-menu"
        open={Boolean(anchorEl())}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            ['& .MuiAvatar-root']: {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
      >
        <Show when={props.infoClick}>
          <MenuItem
            onClick={async () => {
              // @ts-ignore
              props.infoClick()
            }}
          >
            <ListItemIcon>
              <Icon icon="mdi:remove-red-eye" width="100%" class="w-6 text-blue-500" />
            </ListItemIcon>
            Ver
          </MenuItem>
        </Show>
        <Show when={props.editClick}>
          <MenuItem
            onClick={async () => {
              // @ts-ignore
              props.editClick()
            }}
          >
            <ListItemIcon>
              <Icon icon="mdi:edit" width="100%" class="w-6 text-green-500" />
            </ListItemIcon>
            Editar
          </MenuItem>
        </Show>
        <Show when={props.deleteClick}>
          <MenuItem
            onClick={async () => {
              // @ts-ignore
              props.deleteClick()
            }}
          >
            <ListItemIcon>
              <Icon icon="mdi:trash" width="100%" class="w-6 text-red-500" />
            </ListItemIcon>
            Eliminar
          </MenuItem>
        </Show>
      </Menu>
    </div>
  )
}
