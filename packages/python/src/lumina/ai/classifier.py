"""
Text classification service
"""

from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import numpy as np


class TextClassifier:
    """Text classification service using ML"""

    def __init__(self):
        """Initialize classifier"""
        self.pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=1000, stop_words='english')),
            ('classifier', MultinomialNB())
        ])
        self.is_trained = False
        self.classes_ = None

    def train(self, texts: List[str], labels: List[str]) -> None:
        """
        Train the classifier

        Args:
            texts: List of training texts
            labels: List of corresponding labels
        """
        self.pipeline.fit(texts, labels)
        self.classes_ = self.pipeline.classes_.tolist()
        self.is_trained = True

    def predict(self, text: str) -> str:
        """
        Predict label for a single text

        Args:
            text: Input text

        Returns:
            Predicted label
        """
        if not self.is_trained:
            raise ValueError("Classifier must be trained before prediction")

        prediction = self.pipeline.predict([text])[0]
        return str(prediction)

    def predict_proba(self, text: str) -> Dict[str, float]:
        """
        Get prediction probabilities for all classes

        Args:
            text: Input text

        Returns:
            Dictionary mapping class names to probabilities
        """
        if not self.is_trained:
            raise ValueError("Classifier must be trained before prediction")

        probabilities = self.pipeline.predict_proba([text])[0]
        return {
            class_name: float(prob)
            for class_name, prob in zip(self.classes_, probabilities)
        }

    def classify_sentiment(self, text: str) -> Dict[str, Any]:
        """
        Classify text sentiment (positive, neutral, negative)

        Args:
            text: Input text

        Returns:
            Dictionary with sentiment classification
        """
        # Simple rule-based sentiment (can be enhanced with ML model)
        positive_words = ['good', 'great', 'excellent', 'amazing', 'love', 'happy', 'satisfied']
        negative_words = ['bad', 'terrible', 'awful', 'hate', 'angry', 'disappointed', 'poor']

        text_lower = text.lower()
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)

        if positive_count > negative_count:
            sentiment = 'positive'
            confidence = min(0.9, 0.5 + (positive_count - negative_count) * 0.1)
        elif negative_count > positive_count:
            sentiment = 'negative'
            confidence = min(0.9, 0.5 + (negative_count - positive_count) * 0.1)
        else:
            sentiment = 'neutral'
            confidence = 0.5

        return {
            'sentiment': sentiment,
            'confidence': confidence,
            'positive_score': positive_count,
            'negative_score': negative_count
        }

