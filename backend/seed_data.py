from .database import SessionLocal
from . import models

db = SessionLocal()

# Domainler
domains = [
    {"name": "Colors", "slug": "colors"},
    {"name": "Animals", "slug": "animals"},
    {"name": "Fruits", "slug": "fruits"},
]

for d in domains:
    domain = models.Domain(name=d["name"], slug=d["slug"])
    db.add(domain)
db.commit()

# Terms
color_id = db.query(models.Domain).filter_by(slug="colors").first().id
animal_id = db.query(models.Domain).filter_by(slug="animals").first().id
fruit_id = db.query(models.Domain).filter_by(slug="fruits").first().id

terms = [
    # Colors
    (color_id, "red", "rot"),
    (color_id, "blue", "blau"),
    (color_id, "green", "grün"),
    # Animals
    (animal_id, "cat", "Katze"),
    (animal_id, "dog", "Hund"),
    (animal_id, "bird", "Vogel"),
    # Fruits
    (fruit_id, "apple", "Apfel"),
    (fruit_id, "banana", "Banane"),
    (fruit_id, "grape", "Traube"),
]

for t in terms:
    term = models.Term(domain_id=t[0], en=t[1], de=t[2])
    db.add(term)
db.commit()
db.close()

print("Seed data inserted ✅")
