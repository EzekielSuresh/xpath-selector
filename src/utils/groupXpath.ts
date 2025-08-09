export function getCommonAncestor(xpaths: string[]): string {
    if (xpaths.length === 0) return "";
    const splitPaths = xpaths.map(xp => xp.split('/'));
    let common = [];
    for (let i = 0; i < splitPaths[0].length; i++) {
        const part = splitPaths[0][i];
        if (splitPaths.every(path => path[i] === part)) {
        common.push(part);
        } else {
        break;
        }
    }
    return common.join('/');
}

export function getRelativeXpath(fullXpath: string, ancestorXpath: string): string {
    if (!ancestorXpath) return fullXpath;
    if (fullXpath.startsWith(ancestorXpath)) {
        let rel = fullXpath.slice(ancestorXpath.length);
        if (rel.startsWith('/')) rel = rel.slice(1);
        return rel || '.';
    }
    return fullXpath;
}
