const PW        = require('playwright-core')
const axios     = require('axios')
// const SCRIPT    = './debug.js'
const SCRIPT    = 'https://raw.githubusercontent.com/FlokiTV/Zombie-Browser/main/debug.js'
/**
 * apt install chromium-chromedriver -y 
 */
const BROWSER = "chromium"    // Browser Type chromium || firefox || webkit
const context_size = 1        // Number of browsers
const loop_time = 5           // in minutes
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

;(async () => {
  const browser = await PW[BROWSER].launch(options);
  const context = []
  for (let index = 0; index < context_size; index++) { context.push(browser.newContext()) }
  await Promise.all(context).then( ctxs => loop(SCRIPT, ctxs, loop_time) )
})();

const loop = (url, ctxs, min=30) =>{
  loadModule(url)
    .then(async cfg =>{
      console.log("[START]")
      ctxs.forEach((ctx, id) => cfg.loop(ctx, id))
      setInterval(()=>{
        console.log("[RELOAD]")
        console.log(cfg)
        ctxs.forEach((ctx, id) => cfg(ctx, id) ) 
      },1000*60*min)
    })
}

const loadModule = url =>{
  let _url = url.includes("http") ? new URL(url) : url
  return new Promise(r =>{
    if(typeof _url === "string") r(require(_url))
    else{
      const _module = new module.constructor()
      axios.get(url)
        .then(res =>{
          rawData = res.data
          _module.filename = url
          _module._compile(rawData, url)
          r(_module.exports)
        })
    }
  })
}

