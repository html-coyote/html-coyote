export default class strings {
    static readonly PageName: string = "__pageName"
    static readonly StartSiteAssembly: string = "Start site assembly\n"
    static readonly PublishPages: string = "\nPublish pages"
    static readonly Assets: string = "\nAssets"
    static readonly EndSiteAssembly: string = "\nSite assembly complited"
    static page(pageName: string, message?: string): string{
        return `page: ${pageName}. ${message}`
    }
    static infinityLoopDetected(source: string): string{
        return `Detected infinity loop. Source: '${source}'`
    }
        
}