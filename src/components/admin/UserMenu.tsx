import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { createSignal } from 'solid-js'
import { Button, Menu, MenuItem, ListItemIcon } from '@suid/material'
import { Icon } from '@iconify-icon/solid'

import { Page } from '~/enums'
import { $loaderOverlay } from '~/stores'
import { validateResponse } from '~/utils'

export default function UserMenu(props: { name: string }) {
  const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null)
  const open = () => Boolean(anchorEl())

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleResponse = () => {
    navigate(Page.SIGN_IN, { history: 'replace' })
  }

  return (
    <>
      <Button
        class="!text-gray-400 hover:!text-white"
        onClick={handleClick}
        aria-controls={open() ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open() ? 'true' : undefined}
        startIcon={<Icon icon="mdi:person" width="100%" class="w-5" />}
        endIcon={<Icon icon="mdi:chevron-down" width="100%" class="w-5" />}
      >
        {props.name}
      </Button>
      <Menu
        anchorEl={anchorEl()}
        id="account-menu"
        open={open()}
        onClose={handleClose}
        onClick={handleClose}
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
        <MenuItem
          onClick={async () => {
            $loaderOverlay.set(true)
            const { data, error }: any = await actions.logout()
            if (validateResponse(error || data?.error || null) === false) {
              $loaderOverlay.set(false)
              return
            }
            handleResponse()
          }}
        >
          <ListItemIcon>
            <Icon icon="mdi:logout" width="100%" class="w-5" />
          </ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  )
}
