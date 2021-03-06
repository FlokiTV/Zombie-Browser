const PW        = require('playwright-core')
const axios     = require('axios')
const TIMER     = process.env.TIMER || 5
//const SCRIPT    = './debug.js'
const SCRIPT    = process.env.SCRIPT || 'https://raw.githubusercontent.com/FlokiTV/Zombie-Browser/main/debug.js'
/**
 * apt install chromium-chromedriver -y 
 */
const BROWSER = "chromium"                  // Browser Type chromium || firefox || webkit
const context_size = process.env.SIZE || 1  // Number of browsers
/**
 *  Launch options
 */
const options   = {
  headless: true,
  executablePath: process.env.EXEC_PATH || '/usr/lib/chromium-browser',
  args: [
    //'--proxy-server=socks5://127.0.0.1:'+PROXY,
    '--lang=pt-BR',
    '--no-sandbox',
    '--disable-setuid-sandbox'
    ]
}

const setupBrowser = () =>{
  return new Promise( async r =>{
    let browser = await PW[BROWSER].launch(options);
    let context = []
    for(let index = 0; index < context_size; index++) { context.push(browser.newContext()) }
    await Promise.all(context).then( ctxs =>{
      r(ctxs)
    })
  })
}

const loop = (ctxs) =>{
  loadModule(SCRIPT)
    .then(async cfg =>{
      ctxs.forEach(async (ctx, id) => {
        if(cfg.init) await cfg.init(ctx, id)
        cfg.loop(ctx, id)
      })
    })
}

const loadModule = url =>{
  let _url = url.includes("http") ? new URL(url) : url
  return new Promise(r =>{
    if(typeof _url === "string") r(require(_url))
    else{
      __log("[GET]")
      axios.get(url)
        .then(res =>{
          let rawData = res.data
          let _module = new module.constructor()
          _module.filename = url
          _module._compile(rawData, url)
          r(_module.exports)
        })
    }
  })
}

const __log = e => console.log(e);

/**
 *  Setup Browser
 */
 ;(async () => {
  __log(`[START] Timer: ${TIMER}`)
  __log(`[SCRIPT] ${SCRIPT}`)
  __log(`[CONTEXT] Size: ${context_size}`)
  setupBrowser()
    .then(contexts => loop(contexts) )
  // 
  setInterval(async ()=>{
    __log("[RELOAD]")
    setupBrowser()
      .then(contexts => loop(contexts) )
  },1000*60*TIMER)
})();
