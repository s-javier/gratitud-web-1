import { alpha, styled } from '@suid/material/styles'
import { yellow } from '@suid/material/colors'
import { Switch } from '@suid/material'

const YellowSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: yellow[700],
    '&:hover': {
      backgroundColor: alpha(yellow[700], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: yellow[700],
  },
}))

export default YellowSwitch
