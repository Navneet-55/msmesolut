# Python Integration Guide

Lumina AI now includes **Python services** for enhanced AI/ML capabilities!

## 🐍 Python Services

The Python package provides:

- **Text Embeddings** - High-quality vector embeddings using sentence-transformers
- **Sentiment Analysis** - Advanced sentiment classification
- **Text Classification** - ML-based text classification
- **Time Series Analysis** - Statistical analysis and trend detection
- **Anomaly Detection** - Detect outliers in data
- **Forecasting** - Simple time series forecasting
- **FastAPI Server** - RESTful API for all Python services

## 📦 Setup

### Prerequisites

- Python 3.10+
- pip

### Installation

```bash
cd packages/python
pip install -r requirements.txt
```

### Environment Variables

Add to your `.env` file:

```env
PYTHON_API_URL=http://localhost:5000
PYTHON_API_PORT=5000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4000
```

## 🚀 Usage

### Start Python API Server

```bash
# Development
cd packages/python
uvicorn src.lumina.api.main:app --reload --port 5000

# Or use npm script
pnpm --filter @lumina/python dev
```

### Integration with Node.js

The Python services are automatically integrated with the NestJS backend via `PythonService`.

Example usage in agents:

```typescript
// In any agent or service
constructor(private pythonService: PythonService) {}

// Generate embeddings
const embedding = await this.pythonService.generateEmbedding('text');

// Analyze sentiment
const sentiment = await this.pythonService.analyzeSentiment('text');

// Detect anomalies
const anomalies = await this.pythonService.detectAnomalies([1, 2, 3, 100]);
```

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Embeddings
```
POST /ai/embed
Body: { "text": "your text here" }
```

### Batch Embeddings
```
POST /ai/embed/batch
Body: { "texts": ["text1", "text2"] }
```

### Similarity
```
POST /ai/similarity
Body: { "embedding1": [...], "embedding2": [...] }
```

### Sentiment Analysis
```
POST /ai/classify/sentiment
Body: { "text": "your text here" }
```

### Time Series Analysis
```
POST /ai/analyze/timeseries
Body: { "data": [...], "date_field": "date", "value_field": "value" }
```

### Anomaly Detection
```
POST /ai/analyze/anomalies
Body: { "values": [1, 2, 3, 100], "method": "iqr" }
```

### Forecasting
```
POST /ai/analyze/forecast
Body: { "values": [1, 2, 3], "periods": 7, "method": "moving_average" }
```

## 🐳 Docker

Python service is included in `docker-compose.yml`:

```bash
docker-compose up python-api
```

## 🔧 Development

```bash
cd packages/python

# Install dependencies
pip install -r requirements.txt

# Development server
uvicorn src.lumina.api.main:app --reload --port 5000

# Linting
ruff check src/

# Formatting
black src/

# Type checking
mypy src/

# Testing
pytest
```

## 💡 Use Cases

### Enhanced Customer Support Agent
- Use Python embeddings for semantic search in knowledge base
- Use sentiment analysis for ticket prioritization

### Financial Agent
- Use time series analysis for better forecasting
- Use anomaly detection for fraud detection

### Marketing Agent
- Use sentiment analysis for campaign optimization
- Use embeddings for content similarity matching

### Data Integration Agent
- Use Python for advanced data processing
- Use anomaly detection for data quality checks

## 🔄 Integration Flow

```
NestJS Backend → PythonService → FastAPI → Python ML Services
```

The Python services are optional - the application works without them, but they enhance capabilities when available.

## 📚 Python Package Structure

```
packages/python/
├── src/
│   └── lumina/
│       ├── ai/
│       │   ├── embeddings.py
│       │   ├── classifier.py
│       │   └── analyzer.py
│       └── api/
│           └── main.py
├── requirements.txt
├── pyproject.toml
└── Dockerfile
```

## ✅ Benefits

1. **Better Embeddings** - Sentence-transformers provide high-quality embeddings
2. **Advanced ML** - Access to scikit-learn, pandas, numpy
3. **Fast Processing** - Python excels at data processing
4. **Rich Ecosystem** - Access to Python's ML/AI libraries
5. **Optional** - Application works without Python, enhanced with it

---

**Python + TypeScript = Best of Both Worlds!** 🐍✨

