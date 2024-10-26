import { createSignal, Show } from 'solid-js'
import { IconButton, ListItemIcon, Menu, MenuItem } from '@suid/material'
import MoreVertIcon from '@suid/icons-material/MoreVert'
import InfoIcon from '@suid/icons-material/RemoveRedEye'
import EditIcon from '@suid/icons-material/Edit'
import DeleteIcon from '@suid/icons-material/Delete'

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
        sx={{
          color: '#9ca3af', // Color del texto
          '&:hover': {
            color: '#eab308',
          },
        }}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <MoreVertIcon />
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
              <InfoIcon class="text-blue-500" />
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
              <EditIcon class="text-green-500" />
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
              <DeleteIcon class="text-red-500" />
            </ListItemIcon>
            Eliminar
          </MenuItem>
        </Show>
      </Menu>
    </div>
  )
}
