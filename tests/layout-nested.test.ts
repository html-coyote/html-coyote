import { Content } from "../src/content"
import { ContentInMemory } from "../src/fs-utils"
import { Layout } from "../src/layout"
import { TemplateResolver } from "../src/template-resolver"
import { Page } from "../src/page"
import { PartCollection } from "../src/part"
import strings from "../src/strings"

test("layout-nested. slot in part", ()=> {
    const layoutTemplate = `<html><body>
    <nav>
    <ul>
        <template loop="item of items">
            <menu-item href="{{item.href}}">
                {{item.name}}
            </menu-item>
        </template>
    </ul>
    </nav>
    <section>
        <slot name="content"></slot>
    </section>
    </body></html>`

    const pageTemplate = `
    <template slot="submenu">
        <ul>
            <li>Subitem 1</li>
        </ul>
    </template>
    <template slot="content">
        <p>The content from page</p>
    </template>
    `

    const partTemplate = `
    <!--#
    .href
    @content
    -->
    <template>
        <li>
            <a href="{{href}}">{{content}}</a>
            <slot name="submenu"></slot>
        </li>
    </template>
    `

    const resolver = new TemplateResolver()
    const layout = new Layout(new ContentInMemory("layout", layoutTemplate))
    const page = new Page(new ContentInMemory("index", pageTemplate))
    const parts = new PartCollection([new ContentInMemory("menu-item", partTemplate)])
    const content = new Content([])
    content.add(strings.PageName, "index")
    content.add("items", [{name: "Item 1", href: "index.html"}, {name: "Item 2", href: "index2.html"}])
    const html = resolver.resolve(layout, page, parts, content)
    expect(html).toContain("Item 1")
    expect(html).toContain("The content from page")
    expect(html).toContain("Subitem 1")
})