# Use Maven with OpenJDK 17 to build the application
FROM maven:3.8-openjdk-17-slim AS build

# Set working directory for Maven
WORKDIR /app

# Copy Maven project files
COPY pom.xml .
COPY src ./src

# Package the JAR
RUN mvn clean package -DskipTests

# Runtime image
FROM openjdk:17-jdk-slim

# Set working directory for runtime
WORKDIR /app

# Copy the JAR from the Maven build stage
COPY --from=build /app/target/Ace-Eureka-0.0.1-SNAPSHOT.jar app.jar

# Expose the Eureka port
EXPOSE 8761

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
