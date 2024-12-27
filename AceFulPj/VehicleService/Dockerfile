FROM maven:3.9.4-eclipse-temurin-17 as builder
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src


RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built jar
COPY --from=builder /app/target/VehicleService-0.0.1-SNAPSHOT.jar app.jar

# Expose the application port
EXPOSE 8081

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
