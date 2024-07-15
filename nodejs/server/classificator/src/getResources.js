const path = require('path')
const fs = require('fs')
const request = require('request')
const { fetchData } = require("./services/blocket");
const throttledQueue = require('throttled-queue');

const throttleImageDownload = throttledQueue(1, 2000, true);
const throttleGetPosts = throttledQueue(1, 60000, true);

const parseProductDetail = (blocketItem) => {
    return {
        id: blocketItem.ad_id,
        subject: blocketItem.subject,
        body: blocketItem.body,
        shareUrl: blocketItem.share_url,
        images: blocketItem.images,
        price: blocketItem.price,
    }
}

const download = (uri, filename, callback) => throttleImageDownload(() => {
    console.log('Downloading image')
    request.head(uri, function(err, res, body){
    //   console.log('content-type:', res.headers['content-type']);
    //   console.log('content-length:', res.headers['content-length']);
  
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  });


function BlocketResourcer(dataBaseUrl, searchQuery) {
    const getPosts = async function*() {
        console.log('getPosts', searchQuery)
        const data = await throttleGetPosts(() => fetchData(searchQuery)).then(resp => {
            const products = resp.data.map(parseProductDetail)

            const productsToFetchPromises = products.slice(0,3).reduce(async (acc, product) => {
                const dir = path.resolve(dataBaseUrl, 'articles', product.id)
    
                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                    fs.mkdirSync(path.resolve(dir, 'images'));
                    
                    fs.writeFileSync(path.resolve(dir, 'data.txt'),JSON.stringify(product,0,2))
                    const imagePromisees = (product.images || []).map((img, index) => 
                        new Promise((resolve) => {
                            download(`${img.url}?type=original`, path.resolve(dir, 'images',`${index}.jpg`), () => {resolve()})
                        })
                    )

                    await Promise.all(imagePromisees)

                    return [...await acc, product]
                } else {
                    // the product was already downloaded
                    return acc
                }
            },[])

            return productsToFetchPromises
        })

        for (let id = 0; id < data.length; id++) {
            const element = data[id];
            yield element
        }
        yield *getPosts()
    }

    this.start = async function*() {
        yield* await getPosts()
    }

    this.stop = () => {
        // TODO
    }
}

const getResources = (dataBaseUrl) => async function*() {
    const blocketResourceBicycle = new BlocketResourcer(dataBaseUrl, 'bicycle')
    const blocketResourceCyklar = new BlocketResourcer(dataBaseUrl, 'cyklar')
    const resources = [blocketResourceCyklar, blocketResourceBicycle]
    
    const asyncGenerators = []
    // the reference to the current promise that needs to be resolved from the generator
    const asyncGeneratorsCurrentPromises = []
    
    for (let i = 0; i < resources.length; i++) {
        const resourceGenerator = resources[i].start()
        asyncGenerators.push(resourceGenerator)
        asyncGeneratorsCurrentPromises.push(resourceGenerator
            .next()
            .then(res => ({ ...res, iterator: asyncGenerators[i] })))
    }
    
    while(true) {
        const { value, iterator } = await Promise.race(asyncGeneratorsCurrentPromises)
        const newIteratorPromise = iterator
            .next()
            .then(res => ({ ...res, iterator }))
        // update the promise for the next one to be resolved
        asyncGeneratorsCurrentPromises[asyncGenerators.indexOf(iterator)] = newIteratorPromise
        console.log('Promise', asyncGenerators.indexOf(iterator), 'resolved')
        
        yield value
    }
}

module.exports = {
    getResources
}