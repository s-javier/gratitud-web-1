import { createSignal, For } from 'solid-js'
import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { Button, Menu, MenuItem, ListItemIcon } from '@suid/material'
import BusinessIcon from '@suid/icons-material/Business'
import CorporateFareIcon from '@suid/icons-material/CorporateFare'
import KeyboardArrowDownIcon from '@suid/icons-material/KeyboardArrowDown'

import { Page } from '~/enums'
import { $loaderOverlay } from '~/stores'
import { validateResponse } from '~/utils'

export default function OrganizationMenu(props: { organizations: any[] }) {
  const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null)
  const open = () => Boolean(anchorEl())

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleResponse = () => {
    navigate(Page.ADMIN_WELCOME, { history: 'replace' })
  }

  return (
    <>
      <Button
        class="!mr-3"
        onClick={handleClick}
        aria-controls={open() ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open() ? 'true' : undefined}
        startIcon={<CorporateFareIcon />}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          color: '#9ca3af', // Color del texto
          '&:hover': {
            color: 'white',
          },
        }}
      >
        {props.organizations.filter((item: any) => item.isSelected)[0].title}
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
        <For each={props.organizations.filter((element: any) => !element.isSelected)}>
          {(item) => (
            <MenuItem
              onClick={async () => {
                $loaderOverlay.set(true)
                const { data, error }: any = await actions.organizationChange(item.id)
                if (validateResponse(error || data?.error || null) === false) {
                  $loaderOverlay.set(false)
                  return
                }
                handleResponse()
              }}
            >
              <ListItemIcon>
                <BusinessIcon fontSize="small" />
              </ListItemIcon>
              {item.title}
            </MenuItem>
          )}
        </For>
      </Menu>
    </>
  )
}
