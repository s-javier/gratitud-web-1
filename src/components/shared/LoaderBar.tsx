import { useStore } from '@nanostores/solid'

import { $loaderBar } from '~/stores'

export default function LoaderBar() {
  const loaderBar = useStore($loaderBar)

  return <div class={['loader-line', loaderBar() ? '' : 'hidden'].join(' ')}></div>
}
