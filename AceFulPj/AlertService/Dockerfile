# Stage 1: Build the application
FROM maven:3.9.4-eclipse-temurin-17 as builder
WORKDIR /app

# Copy project files
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built jar
COPY --from=builder /app/target/AlertService-0.0.1-SNAPSHOT.jar app.jar

# Expose the application port
EXPOSE 8083

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
