"""
Agent enhancements using Python ML capabilities
"""

from typing import List, Dict, Any
from ..ai.embeddings import EmbeddingService
from ..ai.classifier import TextClassifier
from ..ai.analyzer import DataAnalyzer


class AgentEnhancements:
    """Enhanced capabilities for AI agents"""

    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.classifier = TextClassifier()
        self.analyzer = DataAnalyzer()

    def enhance_customer_support(
        self,
        ticket_text: str,
        knowledge_base: List[str]
    ) -> Dict[str, Any]:
        """
        Enhance customer support with semantic search

        Args:
            ticket_text: Customer ticket text
            knowledge_base: List of knowledge base articles

        Returns:
            Enhanced support analysis
        """
        # Generate embedding for ticket
        ticket_embedding = self.embedding_service.embed(ticket_text)

        # Generate embeddings for knowledge base
        kb_embeddings = self.embedding_service.embed_batch(knowledge_base)

        # Find most relevant articles
        similar = self.embedding_service.find_similar(
            ticket_embedding,
            kb_embeddings,
            top_k=3
        )

        # Analyze sentiment
        sentiment = self.classifier.classify_sentiment(ticket_text)

        return {
            'sentiment': sentiment,
            'relevant_articles': [
                {
                    'index': idx,
                    'similarity': score,
                    'content': knowledge_base[idx]
                }
                for idx, score in similar
            ],
            'urgency_score': self._calculate_urgency(sentiment, ticket_text)
        }

    def enhance_financial_analysis(
        self,
        transactions: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Enhance financial analysis with ML

        Args:
            transactions: List of transaction data

        Returns:
            Enhanced financial analysis
        """
        # Extract values
        values = [t.get('amount', 0) for t in transactions]

        # Detect anomalies
        anomalies = self.analyzer.detect_anomalies(values, method='iqr')

        # Analyze time series
        analysis = self.analyzer.analyze_time_series(
            transactions,
            date_field='date',
            value_field='amount'
        )

        # Forecast
        forecast = self.analyzer.forecast(values, periods=30)

        return {
            'analysis': analysis,
            'anomalies': anomalies,
            'forecast': forecast,
            'risk_score': self._calculate_risk_score(anomalies, analysis)
        }

    def enhance_lead_scoring(
        self,
        lead_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Enhance lead scoring with ML

        Args:
            lead_data: Lead information

        Returns:
            Enhanced lead scoring
        """
        # Combine text fields for analysis
        text_fields = [
            lead_data.get('description', ''),
            lead_data.get('company', ''),
            lead_data.get('notes', ''),
        ]
        combined_text = ' '.join(text_fields)

        # Analyze sentiment
        sentiment = self.classifier.classify_sentiment(combined_text)

        # Generate embedding for similarity matching
        embedding = self.embedding_service.embed(combined_text)

        return {
            'sentiment': sentiment,
            'embedding': embedding,
            'ml_score': self._calculate_ml_score(lead_data, sentiment),
            'recommendations': self._generate_recommendations(lead_data, sentiment)
        }

    def _calculate_urgency(self, sentiment: Dict[str, Any], text: str) -> float:
        """Calculate urgency score"""
        urgency_keywords = ['urgent', 'asap', 'immediately', 'critical', 'emergency']
        text_lower = text.lower()
        keyword_count = sum(1 for keyword in urgency_keywords if keyword in text_lower)

        base_score = 0.5
        if sentiment['sentiment'] == 'negative':
            base_score += 0.3
        base_score += min(0.2, keyword_count * 0.1)

        return min(1.0, base_score)

    def _calculate_risk_score(
        self,
        anomalies: List[Dict[str, Any]],
        analysis: Dict[str, Any]
    ) -> float:
        """Calculate financial risk score"""
        anomaly_count = len(anomalies)
        high_severity_anomalies = sum(1 for a in anomalies if a.get('severity') == 'high')

        risk = (anomaly_count * 0.1) + (high_severity_anomalies * 0.2)

        if analysis.get('trend') == 'decreasing':
            risk += 0.2

        return min(1.0, risk)

    def _calculate_ml_score(
        self,
        lead_data: Dict[str, Any],
        sentiment: Dict[str, Any]
    ) -> float:
        """Calculate ML-based lead score"""
        score = 0.5

        # Sentiment contribution
        if sentiment['sentiment'] == 'positive':
            score += 0.2
        elif sentiment['sentiment'] == 'negative':
            score -= 0.1

        # Company size (if available)
        company_size = lead_data.get('company_size', '')
        if 'enterprise' in company_size.lower() or 'large' in company_size.lower():
            score += 0.2

        return max(0.0, min(1.0, score))

    def _generate_recommendations(
        self,
        lead_data: Dict[str, Any],
        sentiment: Dict[str, Any]
    ) -> List[str]:
        """Generate recommendations based on lead data"""
        recommendations = []

        if sentiment['sentiment'] == 'positive':
            recommendations.append('High engagement detected - prioritize follow-up')

        if sentiment['confidence'] > 0.7:
            recommendations.append('Strong signal - ready for qualification call')

        return recommendations

