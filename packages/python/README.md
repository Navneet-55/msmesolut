# Lumina AI Python Services

Python-based AI/ML services for enhanced agent capabilities.

## Features

- **Text Embeddings** - Vector embeddings for semantic search
- **Text Classification** - ML-based text classification
- **Sentiment Analysis** - Sentiment detection
- **Data Analysis** - Time series analysis, anomaly detection, forecasting
- **FastAPI Server** - RESTful API for Python services

## Setup

### Prerequisites

- Python 3.10+
- pip

### Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Or with development dependencies
pip install -r requirements.txt && pip install -e '.[dev]'
```

### Environment Variables

Create `.env` file:

```env
PYTHON_API_PORT=5000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4000
```

## Usage

### Start Python API Server

```bash
# Development
uvicorn src.lumina.api.main:app --reload --port 5000

# Production
uvicorn src.lumina.api.main:app --host 0.0.0.0 --port 5000
```

### API Endpoints

- `GET /health` - Health check
- `POST /ai/embed` - Generate text embedding
- `POST /ai/embed/batch` - Batch embeddings
- `POST /ai/similarity` - Calculate similarity
- `POST /ai/classify/sentiment` - Sentiment analysis
- `POST /ai/classify/train` - Train classifier
- `POST /ai/classify/predict` - Predict label
- `POST /ai/analyze/timeseries` - Time series analysis
- `POST /ai/analyze/anomalies` - Anomaly detection
- `POST /ai/analyze/forecast` - Forecasting

## Integration with Node.js Backend

The Python services can be called from the NestJS backend via HTTP.

## Development

```bash
# Linting
ruff check src/

# Formatting
black src/

# Type checking
mypy src/

# Testing
pytest
```

