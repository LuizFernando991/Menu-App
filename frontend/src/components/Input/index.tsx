import { FC } from 'react'
import { UseFormRegister } from 'react-hook-form'
import './input.styles.scss'

type InputPropsType = {
  name: string
  placeholder: string
  type?: string
  error?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
}

const Input: FC<InputPropsType> = ({
  name,
  placeholder,
  register,
  type = 'text',
  error
}) => {
  return (
    <div className="form__group field">
      <input
        type={type}
        className="form__field"
        id={name}
        placeholder={placeholder}
        {...register(name, { required: 'Preencha esse campo' })}
      />
      <label htmlFor={name} className="form__label">
        {name}
      </label>
      <p className="error">{error}</p>
    </div>
  )
}

export default Input
