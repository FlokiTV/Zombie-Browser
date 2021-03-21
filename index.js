const PW        = require('playwright-core')
const axios     = require('axios')
const _module   = new module.constructor()
const WATCH     = 1
//const SCRIPT    = './debug.js'
const SCRIPT    = 'https://raw.githubusercontent.com/FlokiTV/Zombie-Browser/main/debug.js'
/**
 * apt install chromium-chromedriver -y 
 */
const BROWSER = "chromium"    // Browser Type chromium || firefox || webkit
const context_size = 1        // Number of browsers
/**
 *  Launch options
 */
const options   = {
  headless: true,
  executablePath: '/usr/bin/chromium-browser',
  args: [
    //'--proxy-server=socks5://127.0.0.1:'+PROXY,
    '--lang=pt-BR',
    '--no-sandbox',
    '--disable-setuid-sandbox'
    ]
}
/**
 *  Setup Browser
 */
;(async () => {
  const browser = await PW[BROWSER].launch(options);
  const context = []
  for (let index = 0; index < context_size; index++) { context.push(browser.newContext()) }
  await Promise.all(context).then( ctxs => loop(SCRIPT, ctxs) )
})();

const loop = (url, ctxs) =>{
  loadModule(url)
    .then(async cfg =>{
      console.log("[START]")
      ctxs.forEach(async (ctx, id) => {
        if(cfg.init) await cfg.init(ctx, id)
        cfg.loop(ctx, id)
      })
      let min = cfg.loopTime || 5
      // some infos
      console.log("[WATCH TIME] "+WATCH+" min")
      console.log("[LOOP TIME] "+min+" min")
      /*
        The real loop
      */
      setInterval(()=>{
        console.log("[RELOAD]")
        ctxs.forEach((ctx, id) => cfg.loop(ctx, id) ) 
      },1000*60* min )
    })
}

const loadModule = url =>{
  let _url = url.includes("http") ? new URL(url) : url
  return new Promise(r =>{
    if(typeof _url === "string") r(require(_url))
    else{
      console.log("[GET]")
      getModule(url)
        .then(() =>{
          r(_module.exports)
        })
      /*
        watch module
      */  
      setInterval(()=>{
        console.log("[GET]")
        getModule(url)
      },1000*60*WATCH)
    }
  })
}

const getModule = url =>{
  return new Promise(r =>{
    axios.get(url)
      .then(res =>{
        let rawData = res.data
        _module.filename = url
        _module._compile(rawData, url)
        r(_module.exports)
      })
  })
}

