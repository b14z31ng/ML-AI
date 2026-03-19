# Project ML

## Problem Statement

This project provides a complete, reproducible machine learning pipeline for predicting student performance based on various demographic and educational features. It automates data ingestion, preprocessing, model training, and evaluation, enabling rapid experimentation and deployment of regression models.

## Key Features

- Automated data ingestion and train/test split from raw CSV
- Robust data transformation pipeline (imputation, encoding, scaling)
- Multiple regression models (Random Forest, XGBoost, CatBoost, etc.)
- Model selection based on R² score
- Custom exception handling and detailed logging
- Artifact saving for models and preprocessors

## Project Structure

```
.
├── artifacts/         # Generated datasets, models, preprocessors
├── logs/              # Timestamped log files for each run
├── notebook/          # Jupyter notebooks for EDA and experiments
├── src/
│   ├── components/    # Pipeline modules: data_ingestion, data_transformation, model_trainer
│   ├── pipeline/      # (Reserved for pipeline runners)
│   ├── utils.py       # Utility functions (save_object, evaluate_models)
│   ├── logger.py      # Logging configuration
│   └── exception.py   # Custom exception class
├── requirements.txt   # Python dependencies
├── setup.py           # Project packaging
```

- **artifacts/**: Stores train/test splits, preprocessor, and trained model files.
- **logs/**: Contains detailed logs for debugging and traceability.
- **src/components/**: Core pipeline logic, split by stage.
- **src/utils.py**: Shared helpers for model evaluation and object serialization.
- **notebook/**: EDA and prototyping.

## Pipeline Overview

1. **Data Ingestion**: Loads raw data, splits into train/test, saves to artifacts.
2. **Data Transformation**: Cleans, encodes, and scales features; saves preprocessor.
3. **Model Training**: Trains multiple regressors, selects the best based on R².
4. **Evaluation**: Reports model performance and saves the best model.

## Tech Stack

- **Language**: Python 3
- **Libraries**: pandas, numpy, scikit-learn, catboost, xgboost, dill
- **Logging**: Python logging module

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd ml_ai

# Create and activate a virtual environment
python -m venv ml-env
# On Windows:
ml-env\Scripts\activate
# On Unix/Mac:
source ml-env/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## How to Run

```bash
# From the project root
python -m src.components.data_ingestion
```

## Example Output

- Artifacts: `artifacts/train.csv`, `artifacts/test.csv`, `artifacts/model.pkl`, `artifacts/preprocessor.pkl`
- Logs: `logs/<timestamp>/<timestamp>.log`
- Console: Prints R² score of the best model

## Future Improvements

- Add model evaluation and reporting modules
- Support for classification tasks
- CLI or web interface for predictions

## Author

Reshad  
resahdromim013@gmail.com
