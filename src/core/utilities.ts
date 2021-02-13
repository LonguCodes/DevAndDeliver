export function replaceEmpty(str: string|undefined, replacement = '') {
    return (!str || 0 === str.length) ? replacement : str;
}