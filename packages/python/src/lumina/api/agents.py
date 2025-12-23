"""
Agent enhancement endpoints
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

from ..agents.enhancements import AgentEnhancements

router = APIRouter(prefix="/agents", tags=["agents"])
enhancements = AgentEnhancements()


class CustomerSupportRequest(BaseModel):
    ticket_text: str
    knowledge_base: List[str]


class FinancialAnalysisRequest(BaseModel):
    transactions: List[Dict[str, Any]]


class LeadScoringRequest(BaseModel):
    lead_data: Dict[str, Any]


@router.post("/enhance/customer-support")
async def enhance_customer_support(request: CustomerSupportRequest):
    """Enhance customer support with ML"""
    try:
        result = enhancements.enhance_customer_support(
            request.ticket_text,
            request.knowledge_base
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/enhance/financial")
async def enhance_financial(request: FinancialAnalysisRequest):
    """Enhance financial analysis with ML"""
    try:
        result = enhancements.enhance_financial_analysis(request.transactions)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/enhance/lead-scoring")
async def enhance_lead_scoring(request: LeadScoringRequest):
    """Enhance lead scoring with ML"""
    try:
        result = enhancements.enhance_lead_scoring(request.lead_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

