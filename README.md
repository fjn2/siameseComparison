# Project README

## Table of Contents

1. [Project Overview](#project-overview)
2. [Motivation](#motivation)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Installation](#installation)
6. [Usage](#usage)
7. [Future Work](#future-work)
8. [Contributing](#contributing)
9. [License](#license)
10. [Acknowledgements](#acknowledgements)

## Project Overview

This project aims to automate the process of finding specific types of bikes across different marketplaces. Currently, it supports data extraction from Blocket. The project consists of three main processes and some additional commands, primarily written in JavaScript and Python.

## Motivation

Finding the right bike across various online marketplaces can be a time-consuming task. This project is designed to simplify this process by using machine learning and automated data extraction to identify and locate specific types of bikes efficiently.

## Project Structure

The project is organized into the following main components:

1. **Frontend (FE)**
    - Built with Vite.
    - Allows users to create a boundary box around the object of interest.
    - Generates a CSV file to train the machine learning model.

2. **API**
    - Developed using Node.js with Express.
    - Acts as the coordinator and nexus between the frontend, the data extraction service, and the commands.

3. **Data Extraction Service**
    - Responsible for extracting data from different marketplaces.
    - Currently implemented for Blocket.

4. **Commands (Python)**
    - **Train Model**: A command to train the machine learning model.
    - **Evaluate Image**: A command to evaluate an image using the trained model.

## Features

- **Frontend Interface**: 
  - Create boundary boxes for objects.
  - Export data to CSV for model training.

- **API**:
  - Integrates different services and commands.
  - Provides endpoints for data extraction and model evaluation.

- **Data Extraction**:
  - Extracts bike listings from Blocket.

- **Machine Learning**:
  - Train a model using provided CSV data.
  - Evaluate images to find specific bikes.

## Installation

### Prerequisites

- Node.js and npm
- Python 3.x
- Vite

### Steps

1. **Clone the Repository**
    ```sh
    git clone https://github.com/yourusername/yourproject.git
    cd yourproject
    ```

2. **Install Frontend Dependencies**
    ```sh
    cd frontend
    npm install
    ```

3. **Install API Dependencies**
    ```sh
    cd ../api
    npm install
    ```

4. **Install Python Dependencies**
    ```sh
    pip install -r requirements.txt
    ```

## Usage

### Running the Frontend

1. Navigate to the frontend directory:
    ```sh
    cd frontend
    ```

2. Start the development server:
    ```sh
    npm run dev
    ```

3. Open your browser and go to `http://localhost:3000`.

### Running the API

1. Navigate to the API directory:
    ```sh
    cd api
    ```

2. Start the API server:
    ```sh
    npm start
    ```

3. The API server will be running at `http://localhost:3001`.

### Running the Commands

- **Train Model**:
    ```sh
    python train_model.py --data_path path/to/csv
    ```

- **Evaluate Image**:
    ```sh
    python evaluate_image.py --model_path path/to/model --image_path path/to/image
    ```

## Future Work

- Add support for more marketplaces.
- Improve the machine learning model.
- Enhance the frontend user interface.
- Implement additional commands and functionalities.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/feature-name`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Thanks to all contributors and open-source libraries used in this project.

---
