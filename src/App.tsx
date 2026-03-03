import { useState } from 'react'
import { Button } from './components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='bg-green-50 w-full'>
      <Button>Click me</Button>
    </div>
  )
}

export default App
