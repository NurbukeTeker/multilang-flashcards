from pydantic import BaseModel
from typing import List, Optional

class TermBase(BaseModel):
    en: str
    de: str

class TermCreate(TermBase):
    pass

class Term(TermBase):
    id: int
    class Config:
        orm_mode = True

class DomainBase(BaseModel):
    name: str
    slug: str

class DomainCreate(DomainBase):
    pass

class Domain(DomainBase):
    id: int
    terms: List[Term] = []
    class Config:
        orm_mode = True
