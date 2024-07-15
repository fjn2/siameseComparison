const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const { readCsv } = require('../utils/readCsv');

const csvFilePath = path.resolve(__dirname, '../dataset/training_data.csv');

const EPOCHS = 1000
const LIMIT = 9999999
const trainModel = async () => {
    const data = []
    const labels = []

    
    const csvData = await readCsv(csvFilePath)

    csvData.forEach(({ result, ...row }) => {
        const item = Object.keys(row).reduce(
            (acc ,rowKey) => {
                acc.push(+row[rowKey]);
                return acc
            }, [])
        if (data.length < LIMIT) {
            data.push(item)
            labels.push(+result)
        }
        
    })

    const amountOfDimensions = Object.keys(data[0]).length

    // Convert the data to TensorFlow tensors
    const xs = tf.tensor2d(data);
    const ys = tf.tensor1d(labels);

    // Define the neural network model
    const model = tf.sequential();

    // Add layers
    model.add(tf.layers.dense({ units: 100, activation: 'sigmoid', inputShape: [amountOfDimensions] }));
    // model.add(tf.layers.dense({ units: 550, activation: 'sigmoid' }));
    model.add(tf.layers.dense({ units: 100, activation: 'sigmoid' }));
    // model.add(tf.layers.dense({ units: 500, activation: 'sigmoid' }));
    // model.add(tf.layers.dense({ units: 200, activation: 'sigmoid' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    // Compile the model
    model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

    // Train the model
    await model.fit(xs, ys, {
      epochs: EPOCHS, // Adjust as needed
    }).then((info) => {
      console.log('Training Complete');
    });

    const fileName = path.resolve(__dirname, '../dataset/network')
    await model.save('file://' + fileName)
    
    console.log('Model saved to:', fileName)
}

trainModel()