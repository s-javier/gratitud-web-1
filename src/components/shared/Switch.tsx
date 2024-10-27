import { alpha, styled } from '@suid/material/styles'
import colors from 'tailwindcss/colors'
import { Switch } from '@suid/material'

const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: colors.pink[400],
    '&:hover': {
      backgroundColor: alpha(colors.pink[400], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: colors.pink[400],
  },
}))

export default PinkSwitch
