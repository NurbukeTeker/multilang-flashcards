from sqlalchemy.orm import Session
from . import models, schemas

# --- Domain ---
def get_domains(db: Session):
    return db.query(models.Domain).all()

def create_domain(db: Session, domain: schemas.DomainCreate):
    db_domain = models.Domain(name=domain.name, slug=domain.slug)
    db.add(db_domain)
    db.commit()
    db.refresh(db_domain)
    return db_domain

# --- Term ---
def get_terms_by_domain(db: Session, domain_id: int):
    return db.query(models.Term).filter(models.Term.domain_id == domain_id).all()

def create_term(db: Session, domain_id: int, term: schemas.TermCreate):
    db_term = models.Term(domain_id=domain_id, en=term.en, de=term.de)
    db.add(db_term)
    db.commit()
    db.refresh(db_term)
    return db_term
