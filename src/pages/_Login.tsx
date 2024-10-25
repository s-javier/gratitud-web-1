import { createSignal, createEffect } from 'solid-js'
import { animate } from 'motion'
import { toast } from 'solid-sonner'

import LoginForm from './_LoginForm'
import CodeForm from './_CodeForm'

export default function Login() {
  let loginFormRef: HTMLDivElement
  let codeFormRef: HTMLDivElement
  const [isLoginForm, setIsLoginForm] = createSignal(true)
  const [isEmailSent, setIsEmailSent] = createSignal(false)
  const [toastId, setToastId] = createSignal<string | number>('')

  createEffect(async () => {
    if (isEmailSent()) {
      await animate(
        loginFormRef,
        { opacity: 0, transform: 'translateX(-200px)' },
        { duration: 0.5 },
      ).finished
      setIsLoginForm(false)
      await animate(codeFormRef, { opacity: 1, transform: 'translateX(0px)' }, { duration: 0.5 })
        .finished
    } else {
      toast.dismiss(toastId())
      await animate(codeFormRef, { opacity: 0, transform: 'translateX(200px)' }, { duration: 0.5 })
        .finished
      setIsLoginForm(true)
      await animate(loginFormRef, { opacity: 1, transform: 'translateX(0px)' }, { duration: 0.5 })
        .finished
    }
  })

  return (
    <>
      {/* @ts-ignore */}
      <div ref={loginFormRef} class={[isLoginForm() ? '' : 'hidden'].join(' ')}>
        <LoginForm
          continue={(value) => {
            setIsEmailSent(value)
          }}
          setId={(value: string | number) => setToastId(value)}
        />
      </div>
      <div
        // @ts-ignore
        ref={codeFormRef}
        class={['opacity-0 transform translate-x-[200px]', isLoginForm() ? 'hidden' : ''].join(' ')}
      >
        <CodeForm continue={(value) => setIsEmailSent(value)} toastId={toastId()} />
      </div>
    </>
  )
}
