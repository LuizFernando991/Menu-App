import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../../components/Input'
import './login.styles.scss'
import useAuth from '../../hooks/useAuth'

const Login: FC = () => {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const { singIn } = useAuth()

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true)
    await singIn(data)
    setLoading(false)
  }
  return (
    <div className="login-container">
      <main className="login-form">
        <h1>Informe o seu e-mail e senha para continuar</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            register={register}
            name="email"
            placeholder="email"
            error={errors['email'] ? errors['email'].message : ''}
          />
          <Input
            register={register}
            name="password"
            placeholder="password"
            type="password"
            error={errors['password'] ? errors['password'].message : ''}
          />
          <button disabled={loading}>Entrar</button>
        </form>
      </main>
    </div>
  )
}

export default Login
