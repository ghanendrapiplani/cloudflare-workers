const Router = require('./router')
const link_arr =  [
    { "name": "CloudFlare Home page", "url": "https://www.cloudflare.com/" }, 
    { "name": "CloudFlare Wikipedia", "url": "https://en.wikipedia.org/wiki/Cloudflare" },
    { "name": "Stony Brook University", "url": "https://www.stonybrook.edu/" }
  ]
/**
 * Example of how router can be used in an application
 *  */
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

const htmlRespHeader = {
  headers: {
    "content-type": "text/html;charset=UTF-8",
  }
}

const jsonRespHeader = {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    }
}

const acceptJSON = {
    headers: {
      "Accept": "application/json;charset=UTF-8",
    }
}

function handlerLinks(request) {
    return new Response(JSON.stringify(Object.assign({}, link_arr)), jsonRespHeader)
}

async function handleRequest(request) {
    const r = new Router()
    // Replace with the appropriate paths and handlers
    r.get('.*/links', request => handlerLinks(request))
    const resp = await r.route(request)
    return resp

}
