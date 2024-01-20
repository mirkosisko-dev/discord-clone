import { FC } from 'react'

interface IAuthLayout {
  children: React.ReactNode
}

const AuthLayout: FC<IAuthLayout> = ({children}) => {
  return <div className='h-full flex justify-center items-center'>{children}</div>
}

export default AuthLayout