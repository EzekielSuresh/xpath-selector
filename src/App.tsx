import { useRef, useState } from "react"
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
import { Input } from "./components/ui/input"
import { X } from 'lucide-react'
import './index.css'
import { useInspectMode } from "./hooks/useInspectMode"

type AppProps = {
  onClose?: () => void
}

function App({ onClose }: AppProps) {

  const nodeRef = useRef<HTMLDivElement>(null)

  const [active, setActive] = useState(false)
  const [xpath, setXpath] = useState<string | null>(null)

  // Custom hook handles inspect logic
  const { startInspect, stopInspect } = useInspectMode({
    onSelect: (xpath_str: string) => {
      setXpath(xpath_str)
      console.log(xpath)
      stopInspect();
      setActive(false);
      // Optionally copy to clipboard:
      // navigator.clipboard.writeText(xpath);
    },
    onStop: () => setActive(false)
  });

  const handleStart = () => {
    if (!active) {
      startInspect();
      setActive(true);
    } else {
      stopInspect();
      setActive(false);
    }
  };

  const handleClose = () => {
    stopInspect()
    if (onClose) onClose()
  }

  return (
      <div ref={nodeRef}>
        <Card className="w-full max-w-md border-none bg-card">
          <CardHeader>
            <CardTitle className="text-left text-2xl">xpath selector</CardTitle>
            <CardDescription className="text-left">Click 'Start' to select element xpath</CardDescription>
            <CardAction>
              <Button onClick={handleClose} variant="ghost" className="size-8 text-gray-500">
                <X />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            { xpath? (
              <div className="flex flex-row gap-2 space-y-2">
                <Input 
                  className="font-mono text-xs w-[150px] text-center"
                  value="item 1"
                />
                <Input 
                  className="font-mono text-xs text-muted-foreground"
                  value={xpath}
                  readOnly
                />
              </div> 
            ) : (
              <div></div>
            )}
          </CardContent>
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
