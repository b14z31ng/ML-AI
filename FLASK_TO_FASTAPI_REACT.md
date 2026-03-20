# Flask to FastAPI + React Conversion Plan (Web Only)

This guide outlines the steps to convert your Flask web app to a FastAPI backend with a React frontend, without changing your ML pipeline or backend logic.

---

## 1. FastAPI Backend (API Only)
- **Install FastAPI and Uvicorn:**
  ```bash
  pip install fastapi uvicorn
  ```
- **Create a new FastAPI app (e.g., `main.py`):**
  - Expose endpoints for prediction (e.g., `/predict` with POST method).
  - Accept JSON input instead of form data.
  - Return prediction as JSON.
- **Example FastAPI endpoint:**
  ```python
  from fastapi import FastAPI, Request
  from pydantic import BaseModel
  from src.pipeline.predict_pipelien import CustomData, PredictPipeline

  app = FastAPI()

  class PredictRequest(BaseModel):
      gender: str
      race_ethnicity: str
      parental_level_of_education: str
      lunch: str
      test_preparation_course: str
      reading_score: int
      writing_score: int

  @app.post("/predict")
  async def predict(data: PredictRequest):
      custom_data = CustomData(**data.dict())
      pred_df = custom_data.get_data_as_dataframe()
      predict_pipeline = PredictPipeline()
      preds = predict_pipeline.predict(features=pred_df)
      prediction = max(0, min(100, preds[0]))
      return {"prediction": prediction}
  ```
- **Run FastAPI:**
  ```bash
  uvicorn main:app --reload
  ```

---

## 2. React Frontend
- **Create a new React app:**
  ```bash
  npx create-react-app student-performance-app
  cd student-performance-app
  ```
- **Build a form in React** matching your current fields.
- **On form submit:**
  - Collect form data into a JSON object.
  - Send a POST request to FastAPI `/predict` endpoint using `fetch` or `axios`.
  - Display the prediction result from the JSON response.
- **Example React fetch call:**
  ```js
  fetch('http://localhost:8000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
    .then(res => res.json())
    .then(data => setPrediction(data.prediction));
  ```

---

## 3. Remove Flask Web Parts
- Delete or ignore all Flask `render_template` and HTML files.
- Only keep the ML pipeline and prediction logic in Python.

---

## 4. CORS
- **Enable CORS in FastAPI:**
  ```python
  from fastapi.middleware.cors import CORSMiddleware
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```

---

## 5. Summary
- FastAPI serves as a pure API backend.
- React handles all frontend and user interaction.
- ML pipeline remains untouched and is called from FastAPI endpoints.

---

**You can now develop and deploy the frontend and backend independently.**
