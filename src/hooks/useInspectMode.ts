import { getXPath } from "@/utils/xpath"
import { useCallback, useRef } from "react"

type UseInspectModeProps = {
    onSelect: (xpath: string) => void
    onStop?: () => void
}

export function useInspectMode({ onSelect, onStop }: UseInspectModeProps) {
    // const overlayRef = useRef<HTMLElement | null>(null)
    const prevElementRef = useRef<HTMLElement | null>(null)

    const highlightElement = useCallback((el: HTMLElement): void => {
        if (prevElementRef.current != el) {
            if (prevElementRef.current) {
                prevElementRef.current.style.boxShadow = ""
            }
            el.style.boxShadow = "inset 0 0 0 9999px rgba(59,130,246,0.15), 0 0 0 2px #3b82f6"
            prevElementRef.current = el
        }
    }, [])

    const clearHighlight = useCallback((): void => {
        if(prevElementRef.current) {
            prevElementRef.current.style.boxShadow = ""
            prevElementRef.current = null
        }
    }, [])

    const onMouseMove = useCallback((e: MouseEvent) => {
        const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
        if (!el || el.closest("#xpath-selector-floating-ui")) return
        highlightElement(el)
    }, [highlightElement])

    const onClick = useCallback((e: MouseEvent) => {
        const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
        if (!el || el.closest("#xpath-selector-floating-ui")) return
        e.preventDefault()
        e.stopPropagation()
        clearHighlight()
        onSelect(getXPath(el))
        removeListeners()
    }, [clearHighlight, onSelect])

    const onKeyDown = useCallback((e: KeyboardEvent) => {
        if(e.key == "Escape") {
            clearHighlight()
            removeListeners()
        }
    }, [clearHighlight])

    function addListeners() {
        document.addEventListener("mousemove", onMouseMove, true)
        document.addEventListener("click", onClick, true)
        document.addEventListener("keydown", onKeyDown, true)
    }

    function removeListeners() {
        document.removeEventListener("mousemove", onMouseMove, true)
        document.removeEventListener("click", onClick, true)
        document.removeEventListener("keydown", onKeyDown, true)
        clearHighlight()
        if (onStop) onStop()
    }

    function startInspect() {
        addListeners()
    }

    function stopInspect() {
        removeListeners()
    }

    return { startInspect, stopInspect }
}