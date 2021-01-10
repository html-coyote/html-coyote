import { TemplateProvider }  from "./template-provider"
import {IContentFile} from "./fs-utils"
import jsdom from "jsdom"
const { JSDOM } = jsdom

export default class DomProvider extends TemplateProvider {
    protected file: IContentFile
    protected dom: jsdom.JSDOM

    name: string
    document: Document

    constructor(file: IContentFile) {
        super()

        this.file = file
        this.name = file.name
        this.dom = new JSDOM('')
        this.document = this.dom.window.document
    }

    attach(): void {
        this.dom = new JSDOM(this.file.content)
        const { document } = this.dom.window
        this.document = document
    }

    fragment(frag: string): DocumentFragment {
        return JSDOM.fragment(frag)
    }

    toHtml(): string {
        return this.dom.serialize()
    }

    get documentBody(): string{
        return this.document.body.innerHTML
    }
}