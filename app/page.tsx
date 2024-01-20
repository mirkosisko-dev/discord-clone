import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className='flex flex-col'>
      <p className='text-3xl font-bold'>Hello World!</p>

      <Button variant='link'>Click me!</Button>
    </div>
  )
}
