import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [imageData, setImageData] = useState(null);
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const [recording, setRecording] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endX, setEndX] = useState(0);
  const [endY, setEndY] = useState(0);
  const containerRef = useRef(null);
  const imageRef = useRef(null);


  useEffect(() => {
    getImage();
    getInfo();
  }, []);

  const getImage = async () => {
    try {
      const imageDataResponse = await fetch('api/get-image-data');
      const imageData = await imageDataResponse.json();
      setImageData(imageData);

      if (!imageData.id) {
        throw new Error('The image was not fetched');
      }

      const imageResponse = await fetch(`api/get-image/${imageData.id}`);
      if (!imageResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const imageBlob = await imageResponse.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      imageRef.current.src = imageUrl;
    } catch (error) {
      console.error('Error fetching the image:', error);
    }
  };

  const getInfo = async () => {
    try {
      const infoResponse = await fetch('api/info');
      const infoData = await infoResponse.json();
      document.getElementById('infoContainer').innerText = `There is "${infoData.message}" pending.`;
    } catch (error) {
      console.error('Error fetching info:', error);
    }
  };

  const handleMouseDown = (e) => {
    const container = containerRef.current;
    const offsetX = e.pageX - container.offsetLeft;
    const offsetY = e.pageY - container.offsetTop;

    setStartX(offsetX);
    setStartY(offsetY);
    setEndX(offsetX);
    setEndY(offsetY);
    setRecording(true);

    const newBoundingBox = {
      left: Math.min(startX, endX),
      top: Math.min(startY, endY),
      width: Math.abs(endX - startX),
      height: Math.abs(endY - startY),
    };

    addBoundingBoxes(newBoundingBox)
  };

  const handleMouseMove = (e) => {
    if (recording) {
      const container = containerRef.current;
      const offsetX = e.pageX - container.offsetLeft;
      const offsetY = e.pageY - container.offsetTop;
      setEndX(offsetX);
      setEndY(offsetY);

      const updatedBoundingBox = {
        left: Math.min(startX, endX),
        top: Math.min(startY, endY),
        width: Math.abs(endX - startX),
        height: Math.abs(endY - startY),
      };
      updateLastBoundingBox(updatedBoundingBox)
    }
  };

  const handleMouseUp = () => {
    setRecording(false);
  };

  const onClearButtonClick = () => {
    setBoundingBoxes([])
    setStartX(undefined);
    setStartY(undefined);
    setEndX(undefined);
    setEndY(undefined);
  }
  const onSendButtonClick = async () => {
    const dataToSend = boundingBoxes.map(({ left, top, width, height }) => [
      left,
      top,
      left + width,
      top + height,
    ]);

    try {
      const response = await fetch(`api/resolve-image/${imageData.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log('Server response:', responseData);
      getImage()
      getInfo()
      onClearButtonClick()
    } catch (error) {
      console.error('Error sending data to server:', error);
    }
  };

  const addBoundingBoxes = (newBoundingBox) => {
    setBoundingBoxes([...boundingBoxes, newBoundingBox]);
  }
  const updateLastBoundingBox = (newBoundingBox) => {
    boundingBoxes[boundingBoxes.length - 1] = newBoundingBox
    setBoundingBoxes([...boundingBoxes]);
  }

  return (
    <div style={{margin: 'auto', textAlign: 'center'}}>
      <h1>Wheels dataset generator</h1>
      <h3 id="infoContainer"></h3>
      <div
        id="container"
        ref={containerRef}
        style={{ position: 'relative', display: 'inline-block' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <img
          style={{ display: 'block', pointerEvents: 'none', userSelect: 'none' }}
          id="image"
          ref={imageRef}
          alt=""
        />
        {boundingBoxes.map((box, index) => (
          <div
            key={index}
            className="bounding-box"
            style={{
              position: 'absolute',
              border: '2px solid red',
              display: 'block',
              left: `${box.left}px`,
              top: `${box.top}px`,
              width: `${box.width}px`,
              height: `${box.height}px`,
            }}
          ></div>
        ))}
      </div>
      <div style={{ margin: '4px', userSelect: 'none' }}>
        <button id="clearButton" onClick={onClearButtonClick}>Clear</button>
        <button id="sendButton" onClick={onSendButtonClick}>Send</button>
        <button id="skipButton">Skip</button>
        <button id="refreshButton">Refresh</button>
      </div>
    </div>
  );
};

export default App;
