const _utils = {
    page:{
        closeAll(ctx, id = false){
            let pgs = ctx.pages()
            if(pgs) pgs.forEach(page=>page.close())
        }
    }
}

module.exports = {
    loopTime: 0.5, //half minute
    init: async (ctx, id) => {
        console.log("[INIT]")
        await ctx.addInitScript(()=>{
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
        console.log("[INIT END]")
    },
    loop: async (ctx, id) => {
        console.log("[LOOP]")
        _utils.page.closeAll(ctx)
        let pg = await ctx.newPage()
        await pg.goto('http://time.is', { waitUntil: 'domcontentloaded', timeout: 0 })
        await pg.screenshot({ path: `${id}.png`, timeout: 0 })
        console.log("[LOOP END]")
    }
}