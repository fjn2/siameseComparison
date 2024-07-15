const fs = require('fs')
const path = require('path')
const { getResources } = require('./getResources')
const { pipeline } = require('node:stream/promises');
const sharp = require('sharp');
const { File } = require('node:buffer');

const tf = require('@tensorflow/tfjs-node');
require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');
const cocoSsd = require('@tensorflow-models/coco-ssd');

const DATA_BASE_SOURCE = path.resolve(process.cwd(), '../../datasets')
const SERVER_URL = 'http://localhost:4000'

async function loadImageFromURL(imagePath) {
    console.log('imagePath', imagePath)
    // const base64 = Buffer.from(fs.readFileSync(imagePath, 'base64'));
    // const buffer = Buffer.from(base64, "base64");
    // console.log('buffer', buffer)
    // console.log('buffer', buffer)
    // const image = await sharp(buffer).toBuffer();
    
    const { data, info } = await sharp(imagePath).raw().toBuffer({ resolveWithObject: true });

    const imageTensor = tf.tensor3d(new Uint8Array(data), [info.height, info.width, info.channels]);

    return imageTensor;
  }

  async function* detectObjects(result) {
    console.log('detectObjects')
    const model = await cocoSsd.load();

    for (let i = 0; i < (result.images || []).length; i++) {
        const imagePath = path.resolve(DATA_BASE_SOURCE, `articles/${result.id}/images/${i}.jpg`)
        const imageTensor = await loadImageFromURL(imagePath);

        const predictions = await model.detect(imageTensor, 20);
        
        console.log('Predictions: ', predictions);
        const filterPredictions = predictions.filter(pred => {
            return pred.class === 'bicycle' || pred.class === 'motorcycle'
        })
        if(filterPredictions.length) {
            console.log('yelding')
            yield {
                ...result,
                imagePath,
            }
        }
    }
  }


const processResources = async function*(iter) {
    let result = await iter.next();
    while (!result.done) {
        console.log('processResources', result)
        yield* detectObjects(result.value)
        result = await iter.next();
    }
}

const executeAction = async function*(iter) {
    let result = await iter.next();
    while (!result.done) {
        console.log('adding-image to dataset generation', result)
        const fileStream = fs.readFileSync(result.value.imagePath);

        const formData = new FormData();
        formData.append("file", new File([fileStream], 'image.jpg'));
        formData.append("data", JSON.stringify(result.value));

        fetch(`${SERVER_URL}/add-image`, {
            method: 'POST',
            body: formData,
        })
        result = await iter.next();
    }
    yield Buffer.from('data')
}

async function main() {
    
    await pipeline(
        getResources(DATA_BASE_SOURCE),
        processResources,
        executeAction,
    )
    console.log('Pipeline succeeded.');
}

main()