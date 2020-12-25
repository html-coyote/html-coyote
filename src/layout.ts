import DomProvider from "./dom-provider"
import { Page } from "./page"
import { PartCollection } from "./part"

export class Layout extends DomProvider {

    _data: object = {} 

    constructor(name: string, content: string){
        super(name, content)
    }

    data(data: object){
        this._data = data
        return this
    }

    applyPage(page: Page){
        const slots = this.document.getElementsByTagName("slot")
        while(slots.length > 0){
            const slot = slots[0]
            const frag = page.templates[slot.name]
            slot.replaceWith(this.fragment(frag))
        }
        
        return this
    }

    applyParts(parts: PartCollection){

        for(const part of parts){
           const elems = this.document.getElementsByTagName(part.name)
           const attrs = part.attrs
           while  (elems.length > 0){
            const elem = elems[0]
            const data = {... this._data}
            for(let a = 0; a< attrs.length; a++){
                const attr = attrs[a]
                let value = ''
                if (attr.startsWith("@")){
                    value =  elem.innerHTML
                }else {
                    const attrValue = elem.attributes[attr]
                    if (!attrValue) throw new Error(`Tag '${elem.tagName.toLocaleLowerCase()}' hasn't contain attribute '${attr}'`);

                    value =  elem.attributes[attr].nodeValue
                }

                
                if (!value){
                    continue
                }

                const attrName = attr.startsWith("@") ? attr.substring(1) : attr

                data[attrName] = value
            }

            const partHtml = part.applyTemplate(part.template, data)

            elem.replaceWith(this.fragment(partHtml))

           }
        }
        
        return this
    }

    build(){
        return this.dom.serialize()
    }

}

export class LayoutCollection{
    items: Layout[]
    length: number

    constructor(files){
        this.items = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            this.items.push(new Layout(file.name, file.content))
        }
        this.length = this.items.length
    }

    getLayout(name){
        const result = this.items.filter(p=>p.name === name)[0]
        if (!result) throw new Error(`Layout ${name} wasn't found`) 
        
        return result // new Layout(result) //As copy
    }

}


