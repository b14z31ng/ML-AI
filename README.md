# 🎓 Student Exam Performance Predictor

## Project Description

This is an **End-to-End Machine Learning System** designed to predict student math scores based on a variety of demographic and academic factors. Initially starting as a standalone machine learning pipeline, it has been fully upgraded into a production-ready application featuring a robust REST API and a premium web interface.

## New Features

* **FastAPI Backend**: A lightning-fast, asynchronous Python backend for serving model predictions.
* **React Frontend**: A modern, interactive user interface built with Vite and Material UI.
* **API-Based Prediction**: The ML model is decoupled from the UI, operating strictly via a JSON REST API.
* **UI Interaction**: Users can dynamically input student statistics through a premium glassmorphism form and receive real-time, animated prediction scores.

## Updated Project Structure

```text
project-root/
├── backend/                  ← FastAPI application
│   ├── main.py               ← API routes and server config
│   ├── requirements.txt
│   ├── src/                  ← Modular ML Pipeline (ingestion, transformation, training)
│   └── artifacts/            ← Trained ML models (model.pkl, preprocessor.pkl)
├── frontend/                 ← React application
│   ├── src/App.jsx           ← Main React interface
│   ├── index.css             ← Global styling
│   ├── package.json
│   └── vite.config.js
├── render.yaml               ← Render Blueprint for cloud deployment
└── README.md
```

## How It Works

1. **User Interaction**: The user fills out a dynamic form on the **React UI**.
2. **API Request**: The React app sends a JSON payload to the **FastAPI Backend** via a `POST` request.
3. **Data Processing**: FastAPI passes the raw JSON data to the **ML Pipeline**'s `CustomData` class, which converts it into a structured DataFrame.
4. **Prediction**: The `PredictPipeline` loads the saved `preprocessor.pkl` to transform the data, then uses the `model.pkl` to generate a prediction.
5. **Response**: FastAPI returns the predicted score as JSON back to the **React UI**, which displays it with visual flair to the user.

## API Usage

### `POST /predict`

**Input Format (JSON):**
```json
{
  "gender": "male",
  "race_ethnicity": "group B",
  "parental_level_of_education": "bachelor's degree",
  "lunch": "standard",
  "test_preparation_course": "none",
  "reading_score": 72,
  "writing_score": 68
}
```

**Example Response:**
```json
{
  "prediction": 73.5
}
```

## Running the Project

### Backend
Make sure you are in the virtual environment (`ml-env`) where your ML libraries are installed.
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
Swagger UI documentation will be available at `http://localhost:8000/docs`.

### Frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The React app will be live at `http://localhost:5173`. Make sure the backend is running so it can fetch predictions!
