# 🎓 Student Exam Performance Predictor

A production-ready full-stack ML application that predicts student math scores based on demographic and academic factors.

| Layer | Tech |
|-------|------|
| **Backend** | FastAPI · Python 3.11 · Pydantic |
| **Frontend** | React 19 · Vite · Material UI |
| **ML Pipeline** | scikit-learn · CatBoost · XGBoost |
| **Deployment** | Render (Blueprint) · Docker |

---

## 📂 Project Structure

```
project-root/
├── backend/
│   ├── main.py              ← FastAPI app
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── src/                  ← ML pipeline (untouched)
│   └── artifacts/            ← model.pkl, preprocessor.pkl
├── frontend/
│   ├── src/App.jsx           ← React UI
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env
│   └── Dockerfile
├── render.yaml               ← Render Blueprint
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API is now live at `http://localhost:8000` — Swagger docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

React app at `http://localhost:5173`.

### Test Prediction

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "male",
    "race_ethnicity": "group B",
    "parental_level_of_education": "bachelor'\''s degree",
    "lunch": "standard",
    "test_preparation_course": "none",
    "reading_score": 72,
    "writing_score": 68
  }'
```

---

## 🐳 Docker

```bash
docker-compose up --build
```

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`

---

## 🌐 Deploy to Render

### Option 1: Blueprint (Recommended)

1. Push this repo to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click **New** → **Blueprint**
4. Connect your repo — Render reads `render.yaml` and creates both services automatically

### Option 2: Manual Setup

#### Backend Service

| Setting | Value |
|---------|-------|
| Type | Web Service |
| Runtime | Python |
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port 10000` |

#### Frontend Service

| Setting | Value |
|---------|-------|
| Type | Static Site |
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

### ⚠️ Important: Update Frontend API URL

After deploying the backend, copy its URL and set it in the frontend:

1. In Render Dashboard → Frontend service → **Environment**
2. Add: `VITE_API_URL=https://your-backend-name.onrender.com`
3. Trigger a re-deploy

---

## 🔌 API Reference

### `POST /predict`

**Request Body:**

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

**Response:**

```json
{
  "prediction": 73.5
}
```

### `GET /health`

```json
{
  "status": "healthy"
}
```

---

## 📝 Environment Variables

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:8000
```

For Render production, set this to your backend's Render URL.
