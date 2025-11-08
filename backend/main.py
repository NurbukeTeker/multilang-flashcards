from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Backend çalışıyor 🚀"}

# --- Domain routes ---
@app.get("/domains", response_model=list[schemas.Domain])
def list_domains(db: Session = Depends(get_db)):
    return crud.get_domains(db)

@app.post("/domains", response_model=schemas.Domain)
def add_domain(domain: schemas.DomainCreate, db: Session = Depends(get_db)):
    return crud.create_domain(db, domain)

# --- Term routes ---
@app.get("/domains/{domain_id}/terms", response_model=list[schemas.Term])
def list_terms(domain_id: int, db: Session = Depends(get_db)):
    return crud.get_terms_by_domain(db, domain_id)

@app.post("/domains/{domain_id}/terms", response_model=schemas.Term)
def add_term(domain_id: int, term: schemas.TermCreate, db: Session = Depends(get_db)):
    return crud.create_term(db, domain_id, term)
