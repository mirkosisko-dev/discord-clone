import { FC } from 'react'

interface IAuthLayout {
  children: React.ReactNode
}

const AuthLayout: FC<IAuthLayout> = ({children}) => {
  return <div className='bg-red-500'>{children}</div>
}

export default AuthLayout