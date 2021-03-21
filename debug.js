const _utils = {
    page:{
        closeAll(ctx, id = false){
            let pgs = ctx.pages()
            if(pgs) pgs.forEach(page=>page.close())
        }
    }
}

module.exports = {
    init: async (ctx, id) => {
        ctx.addInitScript(()=>{
            Object.defineProperty(navigator, "language", {
                get: function () {
                return "pt-BR";
                }
            });
            Object.defineProperty(navigator, "languages", {
                get: function () {
                return ["pt-BR", "pt"];
                }
            });
        })
    },
    loop: async (ctx, id) => {
        _utils.page.closeAll(ctx)
        let pg = await ctx.newPage()
        await pg.goto('http://example.com', { waitUntil: 'domcontentloaded', timeout: 0 })
        await pg.screenshot({ path: `${id}.png`, timeout: 0 })
    }
}