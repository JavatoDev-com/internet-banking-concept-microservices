FROM openjdk:11-jre-slim-buster
LABEL maintainer="author@javatodev.com"
VOLUME /app
ADD build/libs/internet-banking-service-registry-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "/app.jar"]
