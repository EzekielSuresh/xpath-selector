export function getXPath(element: Element): string {

    let el: Element | null = element
    if(!el) return "no xpath detected"

    const parts: string[] = []
    
    while (el && !el.id){
        let part = el.nodeName.toLowerCase()

        if (el.parentNode){
            const siblings = Array.from(el.parentNode.children).filter(
                sibling => sibling.nodeName == el?.nodeName
            )
            if (siblings.length > 1){
                const index = siblings.indexOf(el) + 1
                part += `[${index}]`
            }
        }

        parts.unshift(part)
        el = el.parentElement
    }

    if (el && el.id){
        return `//*[@id="${el.id}"]/${parts.join('/')}`
    } else {
        return "/" + parts.join("/")
    } 
}