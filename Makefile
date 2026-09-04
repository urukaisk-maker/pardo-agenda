.PHONY: up down restart logs build clean status

up:
docker-compose up -d
@echo "🐕 Pardo Agenda iniciada correctamente!"

down:
docker-compose down
@echo "Servicios detenidos"

restart:
docker-compose restart

logs:
docker-compose logs -f

build:
docker-compose build --no-cache

clean:
docker-compose down -v

status:
docker-compose ps
