const BROWSER   = "chromium"
const PW        = require('playwright')
const https     = require('https')
const DEBUG     = true
/**
 *  
 */
const context_size = 1  // Number of browsers
const loop_time = 5     // in minutes
/**
 *  Launch options
 */
const options   = {
  headless: true,

  /* apt install chromium-chromedriver -y */
  // executablePath: '/usr/lib/chromium-browser/chromium-browser',

  executablePath: '/bin/google-chrome-stable',

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
  await Promise.all(context).then( ctxs => DEBUG ? _loop(ctxs, loop_time) : loop(ctxs, loop_time) )
})();

// need rework, don't use
const loop = (ctxs, min=30) =>{
  setInterval(()=>{
    loadModule('your-script-link.js')
      .then(async cfg =>{
        console.log(cfg)
        ctxs.forEach((ctx, id) => cfg(ctx, id) ) 
      })
  },1000*min)
}

const _loop = (ctxs, min=30) =>{
  const cfg = require('./debug')
  console.log("[START]")
  ctxs.forEach((ctx, id) => cfg.loop(ctx, id))
  setInterval(()=>{
    console.log("[RELOAD]")
    ctxs.forEach((ctx, id) => cfg.loop(ctx, id)) 
  },1000*60*min)
}

const loadModule = url =>{
  return new Promise(r =>{
    const _module = new module.constructor()
    https.get(url ,res => {
      if (res.statusCode === 200) {
        let rawData = '';
        res.setEncoding('utf8');
        res.on('data', chunk => { rawData += chunk; });
        res.on('end', () => { 
          _module.filename = url
          _module._compile(rawData, url)
          r(_module.exports)
        })
      }
    })
  })
}

