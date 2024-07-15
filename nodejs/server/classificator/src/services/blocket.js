const TOKEN = process.env.BLOCKET_TOKEN
const fetchData = (searchQuery) => {
    return fetch(`https://api.blocket.se/search_bff/v2/content?lim=60&q=${searchQuery}&sort=date&st=s&status=active&gl=3&include=extend_with_shipping`, {
        "headers": {
          "accept": "*/*",
        //   "accept-language": "es-ES,es;q=0.9,en;q=0.8,gl;q=0.7",
          "authorization": `Bearer ${TOKEN}`,
          "cache-control": "no-cache",
          "pragma": "no-cache",
          "priority": "u=1, i",
        //   "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site"
        },
        "referrer": "https://www.blocket.se/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      }).then(async (r) => {
        if (r.status > 299) {
            const errorResp = await r.json()
            console.log('errorResp', errorResp)
            throw new Error('Error on request')
        }
        return r.json()
    });
}

module.exports = {
    fetchData
}