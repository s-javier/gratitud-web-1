import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { createSignal } from 'solid-js'
import { toast } from 'solid-sonner'
import { Button, Menu, MenuItem, ListItemIcon } from '@suid/material'
import PersonIcon from '@suid/icons-material/Person'
import KeyboardArrowDownIcon from '@suid/icons-material/KeyboardArrowDown'
import LogoutIcon from '@suid/icons-material/Logout'

import { Page } from '~/enums'
import { $loaderOverlay } from '~/stores'
import CustomToaster from '~/components/shared/CustomToaster'
import { createRoot } from 'solid-js'

export default function UserMenu(props: { name: string }) {
  const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null)
  const open = () => Boolean(anchorEl())

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const validateResponse = (response: any): boolean => {
    if (response.error) {
      toast.custom(
        (t) =>
          createRoot(() => (
            <CustomToaster
              id={t}
              type="error"
              title="Hubo un error"
              description="Por favor, inténtalo más tarde."
            />
          )),
        {
          duration: 5000,
        },
      )
      return false
    }
    if (response.data?.error) {
      if (response.data.error.isNotify) {
        toast.custom(
          (t) =>
            createRoot(() => (
              <CustomToaster
                id={t}
                type="error"
                title={response.data.error.title}
                description={response.data.error.message}
              />
            )),
          {
            duration: 5000,
          },
        )
      }
      return false
    }
    return true
  }

  const handleResponse = () => {
    navigate(Page.SIGN_IN, { history: 'replace' })
  }

  return (
    <>
      <Button
        onClick={handleClick}
        aria-controls={open() ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open() ? 'true' : undefined}
        startIcon={<PersonIcon />}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          color: '#9ca3af', // Color del texto
          '&:hover': {
            color: 'white',
          },
        }}
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
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  )
}
