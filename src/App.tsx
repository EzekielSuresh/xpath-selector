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
import { Copy } from 'lucide-react'
import { Trash } from 'lucide-react'
import { Group } from 'lucide-react'
import './index.css'
import { useInspectMode } from "./hooks/useInspectMode"

type AppProps = {
  onClose?: () => void
}

function App({ onClose }: AppProps) {

  const nodeRef = useRef<HTMLDivElement>(null)

  const [active, setActive] = useState(false)
  const [xpaths, setXpath] = useState<string[]>([])
  const [deleteMode, setDeleteMode] = useState(false)

  // Custom hook handles inspect logic
  const { startInspect, stopInspect } = useInspectMode({
    onSelect: (xpath_str: string) => {
      setXpath(prev => [...prev, xpath_str])
      console.log(xpaths)
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

  const handleDeleteXpath = (idx: number) => {
    setXpath(prev => prev.filter((_, i) => i !== idx))
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
            { xpaths.length > 0 ? (
              <div className="flex flex-col gap-2">
                {xpaths.map((xpath, idx) => (
                  <div className="flex flex-row gap-2">
                    <Input 
                      className="font-mono text-xs w-[150px] text-center"
                      value={`item ${idx + 1}`}
                    />
                    <Input 
                      className="font-mono text-xs text-muted-foreground"
                      value={xpath}
                      readOnly
                    />
                    {deleteMode && (
                      <Button
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => handleDeleteXpath(idx)}
                      >
                        <Trash />
                      </Button>
                    )}
                  </div>
                ))}
                <div className="flex flex-row justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-neutral-400"
                  >
                    <Group />
                    Group
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-neutral-400"
                  >
                    <Copy />
                    Copy JSON
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:bg-red-50 hover:text-red-500"
                    onClick={() => setDeleteMode((prev) => !prev)}
                  >
                    {deleteMode ? <X /> : <Trash />}
                    {deleteMode ? "Cancel" : "Delete"}
                  </Button>
                </div>           
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
