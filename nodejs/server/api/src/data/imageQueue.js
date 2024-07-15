const { v4: uuidv4 } = require('uuid');
const path = require('path')

const IMAGE_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    DONE: 'done'
};

const generateId = () => {
    return uuidv4();
};

const pendingImageQueue = []
// const pendingImageQueue = [{
//     id: generateId(),
//     path: path.resolve(process.cwd(), 'uploads/1720914573708.jpg'),
//     data: {
//         "id": "1205746153",
//         "subject": "Crescent 16vxl hybrid ",
//         "body": "Very light and high quality ladies bicycle.  Always kept in close garage and maintained regularly. No issues or errors! \n\nIt has Atran system detachable and expandable rear bag,  new winter tires, air pump, wheel lock, body lock, led front and rear lights as extra accessories. ",
//         "shareUrl": "https://www.blocket.se/annons/vasterbotten/crescent_16vxl_hybrid_/1205746153",
//         "images": [
//           {
//             "height": 920,
//             "type": "image",
//             "url": "https://i.blocketcdn.se/pictures/recommerce/1205746153/1fb0dceb-281a-4b7b-958f-14993877095d.jpg",
//             "width": 1280
//           },
//           {
//             "height": 836,
//             "type": "image",
//             "url": "https://i.blocketcdn.se/pictures/recommerce/1205746153/b6c63761-1674-44e7-b867-d841bf42cec9.jpg",
//             "width": 1280
//           },
//           {
//             "height": 897,
//             "type": "image",
//             "url": "https://i.blocketcdn.se/pictures/recommerce/1205746153/90f19a5a-965f-4ad1-8efd-27d62c8cbc5d.jpg",
//             "width": 1280
//           },
//           {
//             "height": 1024,
//             "type": "image",
//             "url": "https://i.blocketcdn.se/pictures/recommerce/1205746153/b5ce22c0-ed70-4bc8-8854-89dbd28fcb13.jpg",
//             "width": 768
//           },
//           {
//             "height": 1024,
//             "type": "image",
//             "url": "https://i.blocketcdn.se/pictures/recommerce/1205746153/f0f10840-3486-4508-b592-3d2e7ea491dc.jpg",
//             "width": 966
//           }
//         ],
//         "price": {
//           "suffix": "kr",
//           "value": 3500
//         }
//     },
//     status: IMAGE_STATUS.PENDING
// }];

module.exports = { pendingImageQueue, IMAGE_STATUS };
