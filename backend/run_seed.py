from database import SessionLocal
import models

db = SessionLocal()

# --- Domains ---------------------------------------------------------------
domains = [
    {"name": "Colors", "slug": "colors"},
    {"name": "Animals", "slug": "animals"},
    {"name": "Fruits", "slug": "fruits"},
    {"name": "Clothes", "slug": "clothes"},
    {"name": "Body Parts", "slug": "body-parts"},
]

for d in domains:
    db.add(models.Domain(name=d["name"], slug=d["slug"]))
db.commit()

# --- Helper: get domain IDs -----------------------------------------------
def did(slug):
    return db.query(models.Domain).filter_by(slug=slug).first().id

# --- Terms ----------------------------------------------------------------
terms = [
    # Colors
    (did("colors"), "red", "rot"),
    (did("colors"), "blue", "blau"),
    (did("colors"), "green", "grün"),
    (did("colors"), "yellow", "gelb"),
    (did("colors"), "orange", "orange"),

    # Animals
    (did("animals"), "dog", "der Hund"),
    (did("animals"), "cat", "die Katze"),
    (did("animals"), "bird", "der Vogel"),
    (did("animals"), "fish", "der Fisch"),
    (did("animals"), "horse", "das Pferd"),

    # Fruits
    (did("fruits"), "apple", "der Apfel"),
    (did("fruits"), "banana", "die Banane"),
    (did("fruits"), "grape", "die Traube"),
    (did("fruits"), "pear", "die Birne"),
    (did("fruits"), "cherry", "die Kirsche"),

    # Clothes
    (did("clothes"), "shirt", "das Hemd"),
    (did("clothes"), "pants", "die Hose"),
    (did("clothes"), "dress", "das Kleid"),
    (did("clothes"), "skirt", "der Rock"),
    (did("clothes"), "jacket", "die Jacke"),

    # Body Parts
    (did("body-parts"), "head", "der Kopf"),
    (did("body-parts"), "eye", "das Auge"),
    (did("body-parts"), "ear", "das Ohr"),
    (did("body-parts"), "hand", "die Hand"),
    (did("body-parts"), "arm", "der Arm"),
]

for t in terms:
    db.add(models.Term(domain_id=t[0], en=t[1], de=t[2]))

db.commit()
db.close()
print("✅ Seed data inserted successfully!")