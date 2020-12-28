const Router = require('./router')
const r = new Router()
const link_arr =  [
  { "name": "CloudFlare Home page", "url": "https://www.cloudflare.com/" }, 
  { "name": "CloudFlare Wikipedia", "url": "https://en.wikipedia.org/wiki/Cloudflare" },
  { "name": "Stony Brook University", "url": "https://www.stonybrook.edu/" }
]
const social_links = [
  { "name": "LinkedIn", "icon":'<path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 8c0 .557-.447 1.008-1 1.008s-1-.45-1-1.008c0-.557.447-1.008 1-1.008s1 .452 1 1.008zm0 2h-2v6h2v-6zm3 0h-2v6h2v-2.861c0-1.722 2.002-1.881 2.002 0v2.861h1.998v-3.359c0-3.284-3.128-3.164-4-1.548v-1.093z"/>', "url": "https://www.linkedin.com/in/ghanendrapiplani" }, 
  { "name": "GitHub", "icon":'<path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 6c-3.313 0-6 2.686-6 6 0 2.651 1.719 4.9 4.104 5.693.3.056.396-.13.396-.289v-1.117c-1.669.363-2.017-.707-2.017-.707-.272-.693-.666-.878-.666-.878-.544-.373.041-.365.041-.365.603.042.92.619.92.619.535.917 1.403.652 1.746.499.054-.388.209-.652.381-.802-1.333-.152-2.733-.667-2.733-2.965 0-.655.234-1.19.618-1.61-.062-.153-.268-.764.058-1.59 0 0 .504-.161 1.65.615.479-.133.992-.199 1.502-.202.51.002 1.023.069 1.503.202 1.146-.776 1.648-.615 1.648-.615.327.826.121 1.437.06 1.588.385.42.617.955.617 1.61 0 2.305-1.404 2.812-2.74 2.96.216.186.412.551.412 1.111v1.646c0 .16.096.347.4.288 2.383-.793 4.1-3.041 4.1-5.691 0-3.314-2.687-6-6-6z"/>', "url": "https://github.com/ghanendrapiplani" }
]
const static_url = "https://static-links-page.signalnerve.workers.dev/"
const imgurl = "https://media-exp1.licdn.com/dms/image/C5103AQHxwrN93l9aVg/profile-displayphoto-shrink_200_200/0?e=1608768000&v=beta&t=JtX3Fn36WBM88BKqpE7mE4dxJNrvzLblEYhUuOCslXs"
const uname = "Ghanendra Piplani"
const jsonRespHeader = {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

function handlerLinks(request) {
    return new Response(handle(), jsonRespHeader)
}
 
function handle(){
   return JSON.stringify(Object.assign({}, link_arr));
}

async function handlerAll(request) {

  const init = {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    }
  }

const response = await fetch(static_url, init)
return new HTMLRewriter()
.on("*", new LinkTransformers(link_arr, social_links))
.transform(response)
}


async function handleRequest(request) {
    r.get('/links', request => handlerLinks(request))
    r.get('.*/.*', request => handlerAll(request)) 
    const resp = await r.route(request)
    return resp
}


class LinkTransformers{ 
  constructor(links, socialLinks){
    this.links = links
    this.socialLinks = social_links
  }
  async element(element){
    if(element.tagName == "body"){
      element.setAttribute("style","background-color:darkslategray;")
    }
    if(element.tagName == "title"){ 
      element.setInnerContent(uname)
    }
    if (element.hasAttribute("style") && (element.getAttribute("id") == "profile"
    || element.getAttribute("id") == "avatar" || element.getAttribute("id") == "social")
    && element.getAttribute("style").includes("display: none")) { 
        let style = element.getAttribute("style");
        let style_arr = style.split(";") 
        style_arr = style_arr.filter(item => !item.includes("display: none"))
        style = style_arr.join(";")
        element.setAttribute("style", style)
 
    }
    if(element.tagName == "div" ){
      if(element.getAttribute("id") == "links"){ 
        let linksHtml = ""
        this.links.forEach(function (item) {
          linksHtml += `<a href="${item.url}">${item.name}</a>`
        });
        element.setInnerContent(linksHtml,{ html: true })
      }
      if(element.getAttribute("id") == "social"){
        let linksHtml = ""
        this.socialLinks.forEach(function (item) {
          linksHtml += `<a href="${item.url}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="75" height="75" viewBox="0 0 24 24">
          ${item.icon}</svg>
          </a>`
        });
        element.setInnerContent(linksHtml,{ html: true })
      }
  }
  if(element.tagName == "img" && element.getAttribute("id") == "avatar"){ 
    element.setAttribute("src", imgurl)
  }
  if(element.tagName == "h1" && element.getAttribute("id") == "name"){
    element.setInnerContent(uname)
  }

}

}