import { useState } from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import './index.css'

type AppProps = {
  onClose?: () => void
}

function App({ onClose }: AppProps) {

  const [active, setActive] = useState(false)

  const handleStart = () => {
    setActive((prev) => !prev)
  }

  return (
    <div>
      <Card className="w-full max-w-md border-none bg-card">
        <CardHeader>
          <CardTitle className="text-left text-2xl">xpath selector</CardTitle>
          <CardDescription className="text-left">Click 'Start' to select element xpath</CardDescription>
          <CardAction>
            <Button onClick={onClose} variant="ghost" className="size-8 text-gray-500">
              <X />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter>
          <Button 
            variant={active ? "outline" : "default"}
            onClick={handleStart}
            className="w-full"
          >
            {active ? "Stop" : "Start"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default App
