"""
Embedding service for text vectorization
"""

from typing import List, Optional
from sentence_transformers import SentenceTransformer
import numpy as np


class EmbeddingService:
    """Service for generating text embeddings"""

    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize embedding service

        Args:
            model_name: HuggingFace model name for embeddings
        """
        self.model = SentenceTransformer(model_name)
        self.model_name = model_name

    def embed(self, text: str) -> List[float]:
        """
        Generate embedding for a single text

        Args:
            text: Input text to embed

        Returns:
            List of float values representing the embedding
        """
        embedding = self.model.encode(text, convert_to_numpy=True)
        return embedding.tolist()

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts

        Args:
            texts: List of texts to embed

        Returns:
            List of embeddings
        """
        embeddings = self.model.encode(texts, convert_to_numpy=True)
        return embeddings.tolist()

    def similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """
        Calculate cosine similarity between two embeddings

        Args:
            embedding1: First embedding vector
            embedding2: Second embedding vector

        Returns:
            Similarity score between 0 and 1
        """
        vec1 = np.array(embedding1)
        vec2 = np.array(embedding2)

        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)

        if norm1 == 0 or norm2 == 0:
            return 0.0

        return float(dot_product / (norm1 * norm2))

    def find_similar(
        self,
        query_embedding: List[float],
        candidate_embeddings: List[List[float]],
        top_k: int = 5
    ) -> List[tuple[int, float]]:
        """
        Find most similar embeddings to query

        Args:
            query_embedding: Query embedding vector
            candidate_embeddings: List of candidate embeddings
            top_k: Number of top results to return

        Returns:
            List of (index, similarity_score) tuples
        """
        query_vec = np.array(query_embedding)
        candidates = np.array(candidate_embeddings)

        # Calculate cosine similarities
        similarities = np.dot(candidates, query_vec) / (
            np.linalg.norm(candidates, axis=1) * np.linalg.norm(query_vec)
        )

        # Get top k indices
        top_indices = np.argsort(similarities)[::-1][:top_k]

        return [(int(idx), float(similarities[idx])) for idx in top_indices]

