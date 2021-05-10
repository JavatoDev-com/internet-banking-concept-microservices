#Internet Banking Concept With Java Spring Boot Microservices

This source code was developed for Java based microservices tutorial series from [javatodev.com](https://javatodev.com).

In this article series I’m going to explain using internet banking API concept with spring boot based microserices architecture. Initially I’ll develop the core API which will evolve as a full fledged REST API collection until deployments.

### Microservices Inside This Project

Here this project consist of mainly 6 microservice and those are,

- User service (banking-core-user-service) – This service includes all the operations under the User such as registrations and retrieval. Additionally, this API consumes keycloak REST API to register and manage the user base while using the local PostgreSQL database as well.
- Fund transfer service (banking-core-fund-transfer-service) – This is the service that handles all the fund transfers between accounts and this API will push messages to a centralized RabbitMQ queue to use from the Notification service.
- Payment service (banking-core-payments-service) – This service will include all the API endpoints to process Utility payments in this project and that will push notification messages to RabbitMQ as well.
- Notification service – This API is registered under the service registry but consumes all the messages from RabbitMQ and pushes necessary notifications to the end users.
- Banking core service – This is the banking core service that acts as a dummy banking core with accounts, users, transaction details, and processors for banking transactions.

### Base Project Architecture

<a href="#" target="blank">
    <img align="center" src="./Microservices_Article_Banking_Core_Concept.jpg" 
alt="Spring Boot Pagination, Sorting and Filtering"/></a>

### Technology Stack

1. Java 1.8
2. Spring Boot 2.4.5
3. Netflix Eureka Service Registry
4. Netflix Eureka Service Client
5. Spring Cloud API Gateway
6. Spring Cloud Config Server
7. Zipkin
8. Spring Cloud Sleuth
9. Open Feign
10. RabbitMQ
11. Prometheus
12. Jitpack
13. MySQL
14. Keycloak
15. Docker / Docker Compose
16. Kubernetes

Article series 

[1. Building Microservices With Spring Boot – Free Course With Practical Project](https://javatodev.com/building-microservices-with-spring-boot-free-course-with-practical-project/)

[2. Microservices – Service Registration and Discovery With Spring Cloud Netflix Eureka](https://javatodev.com/microservices-service-registration-and-discovery-with-spring-cloud-netflix-eureka/)

#### Author

<h1 align="center">Hi 👋, I'm Chinthaka Dinadasa</h1>
<h3 align="center">A Passionate Java Fullstack Developer from Sri Lanka and Author of JavatoDev.com</h3>

<p align="left"> <a href="https://twitter.com/spbootdeveloper" target="blank"><img src="https://img.shields.io/twitter/follow/spbootdeveloper?logo=twitter&style=for-the-badge" alt="spbootdeveloper" /></a> </p>
