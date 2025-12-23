"""
FastAPI server for Python AI services
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv

from ..ai.embeddings import EmbeddingService
from ..ai.classifier import TextClassifier
from ..ai.analyzer import DataAnalyzer
from . import agents

load_dotenv()

app = FastAPI(title="Lumina AI Python Services", version="1.0.0")

# Include agent enhancement routes
app.include_router(agents.router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
embedding_service = EmbeddingService()
classifier = TextClassifier()
analyzer = DataAnalyzer()


# Request/Response models
class EmbedRequest(BaseModel):
    text: str


class EmbedBatchRequest(BaseModel):
    texts: List[str]


class SimilarityRequest(BaseModel):
    embedding1: List[float]
    embedding2: List[float]


class ClassifyRequest(BaseModel):
    text: str


class TrainRequest(BaseModel):
    texts: List[str]
    labels: List[str]


class AnalyzeRequest(BaseModel):
    data: List[Dict[str, Any]]
    date_field: str = "date"
    value_field: str = "value"


class AnomalyRequest(BaseModel):
    values: List[float]
    method: str = "iqr"


class ForecastRequest(BaseModel):
    values: List[float]
    periods: int = 7
    method: str = "moving_average"


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok", "service": "lumina-ai-python"}


@app.post("/ai/embed")
async def embed(request: EmbedRequest):
    """Generate embedding for text"""
    try:
        embedding = embedding_service.embed(request.text)
        return {"embedding": embedding, "dimension": len(embedding)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai/embed/batch")
async def embed_batch(request: EmbedBatchRequest):
    """Generate embeddings for multiple texts"""
    try:
        embeddings = embedding_service.embed_batch(request.texts)
        return {"embeddings": embeddings, "count": len(embeddings)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai/similarity")
async def similarity(request: SimilarityRequest):
    """Calculate similarity between two embeddings"""
    try:
        score = embedding_service.similarity(request.embedding1, request.embedding2)
        return {"similarity": score}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai/classify/sentiment")
async def classify_sentiment(request: ClassifyRequest):
    """Classify text sentiment"""
    try:
        result = classifier.classify_sentiment(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai/classify/train")
async def train_classifier(request: TrainRequest):
    """Train text classifier"""
    try:
        classifier.train(request.texts, request.labels)
        return {"status": "trained", "classes": classifier.classes_}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai/classify/predict")
async def predict(request: ClassifyRequest):
    """Predict label for text"""
    try:
        if not classifier.is_trained:
            raise HTTPException(status_code=400, detail="Classifier not trained")
        label = classifier.predict(request.text)
        probabilities = classifier.predict_proba(request.text)
        return {"label": label, "probabilities": probabilities}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai/analyze/timeseries")
async def analyze_timeseries(request: AnalyzeRequest):
    """Analyze time series data"""
    try:
        result = analyzer.analyze_time_series(
            request.data,
            request.date_field,
            request.value_field
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai/analyze/anomalies")
async def detect_anomalies(request: AnomalyRequest):
    """Detect anomalies in data"""
    try:
        anomalies = analyzer.detect_anomalies(request.values, request.method)
        return {"anomalies": anomalies, "count": len(anomalies)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai/analyze/forecast")
async def forecast(request: ForecastRequest):
    """Generate forecast"""
    try:
        forecast_values = analyzer.forecast(
            request.values,
            request.periods,
            request.method
        )
        return {"forecast": forecast_values, "periods": request.periods}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PYTHON_API_PORT", "5000"))
    uvicorn.run(app, host="0.0.0.0", port=port)

