# Stage 1: Build the application
FROM maven:3.9.4-eclipse-temurin-17 as builder
WORKDIR /app

# Copy only the necessary files for dependency resolution
COPY pom.xml .

# Resolve dependencies and cache them
RUN mvn dependency:resolve dependency:resolve-plugins dependency:go-offline -B

# Copy the rest of the project files
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built jar from the builder stage
COPY --from=builder /app/target/Ace-Gateway-0.0.1-SNAPSHOT.jar app.jar

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
