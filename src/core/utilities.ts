export function replaceEmpty(str: string|undefined, replacement = '') {
    return (!str || 0 === str.length) ? replacement : str;
}

export function rewriteMetadata(source:any,target:any){
    const keys = Reflect.getMetadataKeys(source);
    for(const key of keys){
        const value = Reflect.getMetadata(key,source);
        Reflect.defineMetadata(key,value,target);
    }
}