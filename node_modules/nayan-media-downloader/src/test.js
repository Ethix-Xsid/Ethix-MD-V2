const ndown = require("./index")

async function test(url){
    let result = await ndown(url) || tikdown(url) || twitterdown(url) || ytdown(url)
    return result
}
test("https://www.instagram.com/p/CMAMhvgsVal/").then(result=>{
    console.log("Test Videos/Images OK")
    console.log(result)
}).catch(err=>{
    console.error(err)
})

test("https://www.instagram.com/p/CHSvvKXpkH6/").then(result=>{
    console.log("Test Only Image OK")
    console.log(result)
}).catch(err=>{
    console.error(err)
})

test("https://www.instagram.com/tv/CdmYaq3LAYo/").then(result=>{
    console.log("Test Only Video OK")
    console.log(result)
}).catch(err=>{
    console.error(err)
})
test("https://vt.tiktok.com/ZSNvs6h6o/").then(result=>{
    console.log("Test Videos OK")
    console.log(result)
}).catch(err=>{
    console.error(err)
})

test("https://www.facebook.com/reel/192283630631784?mibextid=b1r3HaZxQ2aOKKJt").then(result=>{
    console.log("Test Videos OK")
    console.log(result)
}).catch(err=>{
    console.error(err)
})

test("https://youtu.be/ESywgSYezzE?si=tDl-pv3niw_WSXLP").then(result=>{
    console.log("Test Videos OK")
    console.log(result)
}).catch(err=>{
    console.error(err)
})

test("https://twitter.com/TeamAbhiSha/status/1743351410761019794?t=vms8wxcU0mQuhVxwGCHjFw&s=19").then(result=>{
    console.log("Test Videos OK")
    console.log(result)
}).catch(err=>{
    console.error(err)
})
