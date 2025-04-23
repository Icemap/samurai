dev:
	@echo "Starting the server..."
	@poetry run python main.py


migrate:
	@echo "Migrating database..."
	@poetry run alembic upgrade head

cm:
	@echo "Creating migrations..."
	@if [ -z "$(NAME)" ]; then \
		poetry run alembic revision --autogenerate; \
	else \
		poetry run alembic revision --autogenerate -m "$(NAME)"; \
	fi