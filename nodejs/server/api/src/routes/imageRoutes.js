const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const upload = require('../middleware/multerConfig');
const { pendingImageQueue, IMAGE_STATUS } = require('../data/imageQueue');
const { appendToCsv } = require('../utils/csvUtils');

const router = express.Router();

const CSV_PATH = '../data/whells_data.csv'

const MAX_WAITING_TIME_FOR_IN_PROGRESS_IMAGE_IN_MS = 1000 * 10 // 5 sec

const generateId = () => {
    return uuidv4();
};

router.get(`/info`, (req, res) => {
  res.send({message: pendingImageQueue.filter(pendingImage => pendingImage.status === IMAGE_STATUS.PENDING).length})
})
router.get(`/get-image/:id`, (req, res) => {
  
  const image = pendingImageQueue.find(pendingImg => pendingImg.id === req.params.id)

  const imagePath = image.path;
  // Check if the image file exists
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('Image file not found');
      res.status(404).send('Image not found');
      return;
    }
    // Read the image file and send it in the response
    fs.readFile(imagePath, (err, data) => {
      if (err) {
        console.error('Error reading image file');
        res.status(500).send('Error');
        return;
      }

      // Set the appropriate content type in the response headers
      res.writeHead(200, { 'Content-Type': 'image/jpg' });
      res.end(data); // Send the image data to the client

      image.status = IMAGE_STATUS.IN_PROGRESS
      image.updateAt = new Date()
    });
  });
});
router.get('/get-image-data', (req, res) => {
  // check if there is an image in_progress for long time and enabled it, if it is the case
  pendingImageQueue.forEach(pendingImage => {
    if (pendingImage.status === IMAGE_STATUS.IN_PROGRESS) {
      if (new Date() - pendingImage.updateAt > MAX_WAITING_TIME_FOR_IN_PROGRESS_IMAGE_IN_MS) {
        pendingImage.status = IMAGE_STATUS.PENDING
      }
    }
  })

  if (pendingImageQueue.length === 0) {
    console.error('There are no images');
    res.status(404).send({ error: 'There are no images'});
    return;
  }
  const image = pendingImageQueue.find(pendingImage => pendingImage.status === IMAGE_STATUS.PENDING);
  
  if (!image) {
    console.error('No images available');
    res.status(404).send({error: 'No images available'});
    return;
  }
  image.status = IMAGE_STATUS.IN_PROGRESS
  res.send(image);
})

// curl -F "file=@/path/to/your/image.jpg" -F "description=This is an example image" http://localhost:3000/add-image
router.post('/add-image', upload.single('file'), (req, res) => {
  console.log('/add-image', req.file.path, req.body)
  pendingImageQueue.push({
        id: generateId(),
        path: req.file.path,
        data: JSON.parse(req.body.data),
        status: IMAGE_STATUS.PENDING,
    });

    res.json({ message: 'Data received successfully' });
});

router.post('/resolve-image/:id', (req, res) => {
    const receivedData = req.body;
    const image = pendingImageQueue.find(pendingImage => pendingImage.id === req.params.id);
    if (!image) {
        console.error('Image id not found');
        res.status(404).send({error: 'Image id not found'});
        return;
    }
    
    console.log('Received data:', receivedData, typeof receivedData);
    const csvPath = path.resolve(__dirname, CSV_PATH)
    receivedData.forEach(row => {
      appendToCsv(csvPath, [image.id, image.data.id, image.path, ...row])  
    });

    // Process received data as needed
    res.json({ message: 'Data received successfully' });

    pendingImage = pendingImageQueue.find(pendingImage => pendingImage.id === req.params.id)
    if (pendingImage) {
      pendingImage.status = IMAGE_STATUS.DONE
    }
      
});

module.exports = router;
