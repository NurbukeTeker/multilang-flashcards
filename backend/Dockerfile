# Backend Dockerfile - multilang-flashcards

FROM python:3.10-slim

# çalışma dizini
WORKDIR /app

# bağımlılıkları yükle
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# uygulama dosyalarını kopyala
COPY . .

# FastAPI portu
EXPOSE 8000

# Uvicorn server başlat
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
