[![CI For Concept Microservice](https://github.com/JavatoDev-com/internet-banking-concept-microservices/actions/workflows/gradle.yml/badge.svg)](https://github.com/JavatoDev-com/internet-banking-concept-microservices/actions/workflows/gradle.yml)

# Internet Banking Concept With Java Spring Boot Microservices

This source code was developed for Java based microservices tutorial series from [javatodev.com](https://javatodev.com).

In this article series I’m going to explain using internet banking API concept with spring boot based microserices architecture. Initially I’ll develop the core API which will evolve as a full fledged REST API collection until deployments.

### Releases

- [1.0.0](https://github.com/JavatoDev-com/internet-banking-concept-microservices/releases/tag/v.1.0.0) - Initial release with Java 11 and Spring Boot 2.
- [2.0.0](https://github.com/JavatoDev-com/internet-banking-concept-microservices/releases/tag/v.1.0.0) - Updated version with Java 21, Spring Boot 3.2.4 , Spring Cloud 2023.0.0

### Installation

1. Clone the repository:

```shell
$ git clone https://github.com/JavatoDev-com/internet-banking-concept-microservices.git
```

2. Navigate to the docker-compose folder:

```shell
$ cd internet-banking-concept-microservices/docker-compose
```
3. Start application using docker-compose:

```shell
$ docker-compose up -d
```

#### Docker Containers

Container | IP | Port Mapping |
--- | --- | --- |
openzipkin_server | 172.25.0.12 | 9411
keycloak_web | 172.25.0.11 | 8080
keycloak_postgre_db | 172.25.0.10 | 5432(Closed Port)
mysql_javatodev_app | 172.25.0.9 | 3306
internet-banking-config-server | 172.25.0.8 | 8090
internet-banking-service-registry | 172.25.0.7 | 8081
internet-banking-api-gateway | 172.25.0.6 | 8082
internet-banking-user-service | 172.25.0.5 | 8083
internet-banking-fund-transfer-service | 172.25.0.4 | 8084
internet-banking-utility-payment-service | 172.25.0.3 | 8085
core-banking-service | 172.25.0.2 | 8092

### Postman Collection

Whole suite related postman collection can be sync using this URL. 

[Postman Collection](https://www.postman.com/javatodev-api/workspace/javatodev-api-collections/folder/24962357-0fecb63e-fa48-4a0d-91ba-6b7fdc5ddebd?action=share&source=copy-link&creator=24962357&ctx=documentation)

Clone this postman collection and switch to the `LOCAL_DOCKER_SETUP` Environment.

#### Test Data

By default we have dummy accounts details with user details under core-banking-database. Also the keycloak instance will deployed with default dataset matched to the application with all the realm, client and user data sets.

Proceed the testings with `AUTHENTICATION` API request under BANKING_CORE_MICROSERVICES COLLECTION.

```
Test Credentials : ib_admin@javatodev.com / 5V7huE3G86uB
```

### Microservices Inside This Project

Here this project consist of mainly 6 microservices and those are,

- User service (banking-core-user-service) – This service includes all the operations under the User such as registrations and retrieval. Additionally, this API consumes keycloak REST API to register and manage the user base while using the local PostgreSQL database as well.
- Fund transfer service (banking-core-fund-transfer-service) – This is the service that handles all the fund transfers between accounts and this API will push messages to a centralized RabbitMQ queue to use from the Notification service.
- Payment service (banking-core-payments-service) – This service will include all the API endpoints to process Utility payments in this project and that will push notification messages to RabbitMQ as well.
- Notification service – This API is registered under the service registry but consumes all the messages from RabbitMQ and pushes necessary notifications to the end users. - PENDING Development
- Banking core service – This is the banking core service that acts as a dummy banking core with accounts, users, transaction details, and processors for banking transactions.

### Base Project Architecture

<a href="#" target="blank">
    <img align="center" src="https://javatodev.com/content/images/wordpress/2021/05/Microservices-Article-Banking-Core-Concept-1024x870.png" 
alt="Spring Boot Microservices Project Architecture By Javatodev.com"/></a>

### Technology Stack

1. Java 21
2. Spring Boot 3.2.4
3. Spring Cloud 2023.0.0 
4. Netflix Eureka Service Registry
5. Netflix Eureka Service Client
6. Spring Cloud API Gateway
7. Spring Cloud Config Server
8. Zipkin
9. Spring Cloud Sleuth
10. Open Feign
11. RabbitMQ
12. Prometheus 
13. MySQL 
14. Keycloak 
15. Docker / Docker Compose 
16. Kubernetes 
17. Keycloak

Article series 

[1. Building Microservices With Spring Boot – Free Course With Practical Project](https://javatodev.com/building-microservices-with-spring-boot-free-course-with-practical-project/)

[2. Microservices – Service Registration and Discovery With Spring Cloud Netflix Eureka](https://javatodev.com/microservices-service-registration-and-discovery-with-spring-cloud-netflix-eureka/)

[3. Microservices – Setup API Gateway Using Spring Cloud Gateway](https://javatodev.com/microservices-setup-api-gateway-using-spring-cloud-gateway/)

[4. Microservices – Authentication, and Authorization With Keycloak](https://javatodev.com/microservices-authentication-and-authorization-with-keycloak/)

[5. Microservices – Core Banking Service Implementation](https://javatodev.com/microservices-core-banking-service-implementation/)

[6. Microservices – User Service Implementation](https://javatodev.com/microservices-user-service-implementation/)

[7. Microservices – Fund Transfer Service Implementation](https://javatodev.com/microservices-fund-transfer-service-implementation/)

[8. Microservices – Utility Payment Service Implementation](https://javatodev.com/microservices-utility-payment-service-implementation/)

[9. Microservices – Communication With Spring Cloud OpenFeign](https://javatodev.com/microservices-communication-with-spring-cloud-openfeign/)

[10. Microservices – Exception Handling](https://javatodev.com/microservices-exception-handling/)

[11. Microservices – Centralized Configurations With Spring Cloud Config](https://javatodev.com/microservices-centralized-configurations-with-spring-cloud-config/)

#### Author

<h1 align="center">Hi 👋, I'm Chinthaka Dinadasa</h1>
<h3 align="center">A Passionate Java Fullstack Developer from Sri Lanka and Author of JavatoDev.com</h3>
