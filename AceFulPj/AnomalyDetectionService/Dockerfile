# Use the official Python 3.10 slim image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app


# Install Python requirements (from requirements.txt)
COPY requirements.txt requirements.txt

# Update and install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


RUN pip install --upgrade pip && pip install -r requirements.txt


# Install additional Python packages
RUN pip install pandas joblib flask tensorflow geopy scikit-learn py-eureka-client flask-cors


# Copy the project files into the container
COPY . .

# Ensure the model files are available in the correct directory
COPY ./anomaly_detection/models ./anomaly_detection/models




# Expose the Flask app port
EXPOSE 5000

# Command to run the application
CMD ["python", "main.py"]
