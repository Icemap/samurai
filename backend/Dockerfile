# Use Python 3.11 slim as the base image
FROM python:3.11-slim

# Install required packages
RUN apt-get update && apt-get install -y --no-install-recommends \
  curl \
  tar \
  make \
  supervisor \
  && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry
RUN poetry config virtualenvs.create false

# Copy Supervisor configuration
COPY supervisord.conf /etc/supervisor/

# Copy the application files
COPY . /app

# Install dependencies
WORKDIR /app
RUN poetry install

# Start the Supervisor
CMD supervisord -c /etc/supervisor/supervisord.conf
