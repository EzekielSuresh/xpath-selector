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
import { getCommonAncestor, getRelativeXpath } from "./utils/groupXpath"

type AppProps = {
  onClose?: () => void
}

function App({ onClose }: AppProps) {

  const nodeRef = useRef<HTMLDivElement>(null)

  const [active, setActive] = useState(false)
  const [xpaths, setXpath] = useState<xpath[]>([])
  const [deleteMode, setDeleteMode] = useState(false)
  const [groupMode, setGroupMode] = useState(false)

  const [selected, setSelected] = useState<boolean[]>([])
  const [groups, setGroups] = useState<groupXpath[]>([])

  type xpath = {
    name: string,
    xpath: string
  }

  type groupXpath = {
    name: string
    commonXpath: string
    items: { label: string; xpath:string; relativeXpath:string }[]
  }

  // Custom hook handles inspect logic
  const { startInspect, stopInspect } = useInspectMode({
    onSelect: (xpath_str: string) => {
      setXpath(prev => 
        [...prev, 
        { name: `item ${prev.length + 1}`, xpath: xpath_str }
      ])
      setSelected(prev => [...prev, false]); // Add a new 'not selected' entry
      console.log(xpaths)
      stopInspect();
      setActive(false);
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
    setSelected(prev => prev.filter((_, i) => i !== idx))
  }

  function handleCreateGroup() {
    const selectedIndices = selected
      .map((isSel, idx) => isSel ? idx : -1)
      .filter(idx => idx !== -1);
    if (selectedIndices.length < 2) return;

    const selectedXpaths = selectedIndices.map(idx => xpaths[idx].xpath);
    const commonXpath = getCommonAncestor(selectedXpaths);

    const groupNum = groups.length + 1;
    const groupName = `group ${groupNum}`;

    const items = selectedIndices.map(idx => ({
      label: xpaths[idx].name,
      xpath: xpaths[idx].xpath,
      relativeXpath: getRelativeXpath(xpaths[idx].xpath, commonXpath),
    }));

    setGroups(prev => [...prev, { name: groupName, commonXpath, items }]);

    // Remove grouped xpaths from xpaths/selected
    setXpath(prev => prev.filter((_, idx) => !selected[idx]));
    setSelected(prev => prev.filter((_, idx) => !selected[idx]));
  }

  const handleCopyJson = () => {
    // Build ungrouped xpaths
    const xpathsObj: { [key: string]: string } = {};
    xpaths.forEach(item => {
      xpathsObj[item.name] = item.xpath;
    });

    // Build groups
    const groupsObj: { [key: string]: any } = {};
    groups.forEach(group => {
      groupsObj[group.name] = {
        common_xpath: group.commonXpath,
        fields: Object.fromEntries(
          group.items
            .filter(item => item.label && item.relativeXpath)
            .map(item => [item.label, item.relativeXpath])
        )
      };
    });

    const output = {
      xpaths: xpathsObj,
      groups: groupsObj
    };

    navigator.clipboard.writeText(JSON.stringify(output, null, 2));
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
          <CardContent className="relative overflow-y-auto max-h-[60vh]">
            {groups.length > 0 && (
              <div className="flex flex-col gap-2 mb-2">
                {groups.map((group, gIdx) => (
                  <Card key={gIdx} className="p-2 shadow-none bg-zinc-50">                      
                    <div className="flex flex-col gap-2">
                      <Input
                        className="font-mono text-xs w-[150px] text-center"
                        value={group.name}
                        onChange={e => {
                          const newName = e.target.value;
                          setGroups(prev => prev.map((g, idx) =>
                            idx === gIdx ? { ...g, name: newName } : g
                          ));
                        }}
                      /> 
                      {group.items.map((item, idx) => (
                        <div key={idx} className="flex flex-row gap-2 items-center">
                          <Input 
                            className="font-mono text-xs w-[150px] text-center"
                            value={item.label}
                            onChange={e => {
                              const newLabel = e.target.value;
                              setGroups(prev =>
                                prev.map((g, groupIndex) =>
                                  groupIndex === gIdx
                                    ? {
                                        ...g,
                                        items: g.items.map((it, itemIndex) =>
                                          itemIndex === idx
                                            ? { ...it, label: newLabel }
                                            : it
                                        ),
                                      }
                                    : g
                                )
                              );
                            }}
                          />
                          <Input
                            className="font-mono text-xs text-muted-foreground"
                            value={item.relativeXpath}
                            readOnly
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}
            { xpaths.length > 0 ? (
              <div className="flex flex-col gap-2">
                {xpaths.map((item, idx) => (
                  <div className="flex flex-row gap-2">
                    <Input 
                      className="font-mono text-xs w-[150px] text-center"
                      value={item.name}
                      onChange={e => {
                        const newName = e.target.value;
                        setXpath(prev =>
                          prev.map((it, i) => i === idx ? { ...it, name: newName } : it)
                        );
                      }}
                    />
                    <Input 
                      className="font-mono text-xs text-muted-foreground"
                      value={item.xpath}
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
                    {groupMode && (
                      <input
                        type="checkbox"
                        checked={selected[idx] || false}
                        onChange={() => {
                          setSelected(sel => {
                            const copy = [...sel];
                            copy[idx] = !copy[idx];
                            return copy;
                          });
                        }}
                      />
                    )}
                  </div>
                ))}
                <div className="sticky bottom-0 left-0 w-full bg-card z-10 pt-2">
                  <div className="flex flex-row justify-end gap-2">
                    {groupMode ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-zinc-500"
                          onClick={() => {
                            setGroupMode(false);
                            setSelected(Array(xpaths.length).fill(false));
                          }}
                        >
                          <X />
                          Cancel
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={selected.filter(Boolean).length < 2}
                          onClick={handleCreateGroup}
                        >
                          Create Group
                        </Button>
                      </>
                    ) : deleteMode ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:bg-red-50 hover:text-red-500"
                        onClick={() => setDeleteMode(false)}
                      >
                        <X />
                        Cancel
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-zinc-500"
                          onClick={() => {
                            setGroupMode(true);
                            setSelected(Array(xpaths.length).fill(false));
                          }}
                        >
                          <Group />
                          Group
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-zinc-500"
                          onClick={handleCopyJson}
                        >
                          <Copy />
                          Copy JSON
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:bg-red-50 hover:text-red-500"
                          onClick={() => setDeleteMode(true)}
                        >
                          <Trash />
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
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
