# Détection de localisation anormale avec des algorithmes de machine learning
  # Table de matière:
    I.	Introduction
      1.	Contexte et objectifs
       1.1 Objectifs principaux
      2.  Cas d'utilisation
    II.	Architecture Technique
      1.	Structure du projet
      2.	Technologies utilisées
      3.	Conteneurisation et déploiement      
    III.	Guide d'installation
      1.	Prérequis
    IV.	Guide d'utilisation
      
  # I.	Introduction
   # 1.	Contexte et objectifs
   Le projet de détection de localisation anormale est une solution innovante utilisant l'intelligence artificielle pour analyser en temps réel les données de géolocalisation 
   des flottes de véhicules. Le système apprend les schémas normaux de déplacement et détecte automatiquement les comportements inhabituels pouvant indiquer des risques 
   ou des inefficacités opérationnelles.
   # 1.1 Objectifs principaux:
     - Détection des anomalies basée sur des algorithmes ML
     - Génération d'alertes basée sur les anomalies détectées
     - Gestion des informations des véhicules
     - Gestion des comptes utilisateurs
   # 2. Cas d'utilisation
   Imaginons une entreprise de livraison qui souhaite surveiller ses camions en temps réel pour détecter des anomalies qui pourraient indiquer des problèmes, 
   comme un détour imprévu ou un arrêt prolongé. Ce système pourrait signaler ces anomalies, permettant à l'entreprise de réagir rapidement, 
   soit en contactant le conducteur, soit en ajustant l’itinéraire pour minimiser les impacts.   
  # II.	Architecture Technique
   # 1. Architecture du projet 
   Le projet est construit selon une architecture microservices, chaque microservice gère une fonctionnalité spécifique, voici les principaux composants :
   
        * Ace-Gateway (Spring boot)
         Service de passerelle API
         
        * Ace-Eureka (Spring boot)
         Service de découverte et registre des services
         
        * AnomalyDetectionService (Python)
         Service principal de détection des anomalies
         
        * AlertService (Spring boot)
         Service de Gestion et envoi des alertes
         
        * VehicleService (Spring boot)
         Service de Gestion des données des véhicules
         
        * UserService (Spring boot)
         Service de Gestion des utilisateurs
         
        * Frontend (Next.js)
        Service pour l'Application web principale 
        
   # 1.	Structure du projet
   
   AceFulPj/
   
      ├── .idea                     
      
      ├── Ace-Eureka/               
      
      ├── AceFrontend/              
      
      ├── Ace-Gateway/              
      
      ├── AlertService/             
      
      ├── AnomalyDetectionService/ 
      
      ├── UserService/              
      
      ├── VehicleService/          
      
      └── docker-compose.yml/      
   # 2.	Technologies utilisées
   
     2.1  Backend:
           Machine Learning et Python :
            Pour le développement de service AnomalyDetectionService. 
           Spring Boot :
            Pour le développement des autres microservices. 
           
     2.3  Base de Données  :
           MySql pour le stockage des données
          
     2.4	Client Frontend  :
           Next.js
   # 3.	Conteneurisation et déploiement  
   # 3.1 Configuration Docker

    version: '3.8'
    services:
      # Eureka Service Registry
      eureka-server:
        build:
          context: ./Ace-Eureka
        ports:
          - "8761:8761"
        container_name: ace-eureka
        networks:
          - ace-network
        environment:
          - EUREKA_CLIENT_REGISTER_WITH_EUREKA=false
          - EUREKA_CLIENT_FETCH_REGISTRY=false

    zookeeper:
      image: bitnami/zookeeper:latest
      container_name: zookeeper
      ports:
        - "2181:2181"
      environment:
        - ALLOW_ANONYMOUS_LOGIN=yes
      networks:
        - ace-network

    kafka:
      image: confluentinc/cp-kafka:latest
      container_name: kafka
      ports:
        - "9092:9092" # Internal and external communication
        - "29092:29092" # Host access
      environment:
        KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
        KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:29092
        KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
        KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
        KAFKA_BROKER_ID: 1
        KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      depends_on:
        - zookeeper
      networks:
        - ace-network


    # Gateway Service
    gateway-service:
      build:
        context: ./Ace-Gateway
      ports:
        - "8080:8080"
      container_name: ace-gateway
      networks:
        - ace-network
      depends_on:
        - eureka-server
      environment:
        - EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://ace-eureka:8761/eureka
        - SPRING_PROFILES_ACTIVE=docker

    # Vehicle Service
    vehicle-service:
      build:
        context: ./VehicleService
      ports:
        - "8081:8081"
      container_name: vehicle-service
      networks:
        - ace-network
      depends_on:
        - eureka-server
        - vehicle-db
        - gateway-service
      environment:
        - EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://ace-eureka:8761/eureka
        - SPRING_PROFILES_ACTIVE=docker
        - SPRING_DATASOURCE_URL=jdbc:mysql://vehicle-db:3306/vehicle_service
        - SPRING_DATASOURCE_USERNAME=root
        - SPRING_DATASOURCE_PASSWORD=root

    # User Service
    user-service:
      build:
        context: ./UserService
      ports:
        - "8082:8082"
      container_name: user-service
      networks:
        - ace-network
      depends_on:
        - eureka-server
        - user-db
        - gateway-service
      environment:
        - EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://ace-eureka:8761/eureka
        - SPRING_PROFILES_ACTIVE=docker
        - SPRING_DATASOURCE_URL=jdbc:mysql://user-db:3306/user_service
        - SPRING_DATASOURCE_USERNAME=root
        - SPRING_DATASOURCE_PASSWORD=root

    # Alert Service
    alert-service:
      build:
        context: ./AlertService
      ports:
        - "8083:8083"
      container_name: alert-service
      networks:
        - ace-network
      depends_on:
        - eureka-server
        - alert-db
        - gateway-service
      environment:
        - EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://ace-eureka:8761/eureka
        - SPRING_PROFILES_ACTIVE=docker
        - SPRING_DATASOURCE_URL=jdbc:mysql://alert-db:3306/alert_service
        - SPRING_DATASOURCE_USERNAME=root
        - SPRING_DATASOURCE_PASSWORD=root

    # Anomaly Detection Service
    anomaly-detection-service:
      build:
        context: ./AnomalyDetectionService
      ports:
        - "5000:5000"
      container_name: anomaly-detection-service
      networks:
        - ace-network
      depends_on:
        - kafka
        - vehicle-service
      environment:
        - KAFKA_BROKER=kafka:9092
        - VEHICLE_SERVICE_URL=http://vehicle-service:8081

      # MySQL for Vehicle Service
     vehicle-db:
       image: mysql:8
       container_name: vehicle-db
       networks:
         - ace-network
       environment:
         - MYSQL_ROOT_PASSWORD=root
         - MYSQL_DATABASE=vehicle_service
       ports:
         - "3307:3306"

     # MySQL for User Service
     user-db:
       image: mysql:8
       container_name: user-db
       networks:
         - ace-network
       environment:
         - MYSQL_ROOT_PASSWORD=root
         - MYSQL_DATABASE=user_service
       ports:
         - "3308:3306"

    # MySQL for Alert Service
    alert-db:
      image: mysql:8
      container_name: alert-db
      networks:
        - ace-network
      environment:
        - MYSQL_ROOT_PASSWORD=root
        - MYSQL_DATABASE=alert_service
      ports:
        - "3309:3306"

    # Angular Frontend
    ace-frontend:
      build:
        context: ./AceFrontend
      ports:
        - "4200:4200"
      container_name: ace-frontend
      networks:
        - ace-network
      depends_on:
        - gateway-service
      environment:
        - NG_PROXY=http://gateway-service:8080
    networks:
      ace-network:
        driver: bridge

  # III.	Guide d'installation
   # 1.	Prérequis
      1.2 Environnement de Développement

        Python 3.10
        Java JDK 17 ou supérieur
        Node.js 16.x ou supérieur
        Docker et Docker Compose
        Git
              
  # IV.	Guide d'utilisation
     1. Clone the repository:

        git clone https://github.com/OubaallaElMehdi/AceFulPj.git
     2. Backend:
        # Configuration de la Base de Données :

         - Créez une base de données pour chaque microservice.

         - Configurez les informations de connexion dans les fichiers application.properties de chaque microservice : spring.datasource.url=jdbc:mysql://localhost:3306/app_db spring.datasource.username=root spring.datasource.password=

        # Démarrage des Microservices Backend :

         - Accédez au répertoire de chaque microservice.
         - Compilez et exécutez avec Maven :
                mvn clean install
                mvn spring-boot:run

        # Ordre recommandé : . Lancer le serveur Eureka (port : 8761). ensuite Lancer les autres microservices et après le Gateway API (8080).
  
      3. Frontend:
        # Accéder au dossier Frontend
           cd AceFulPj\Frontend

        # Installer les dépendances
          npm install

        # Lancer en développement
          npm run dev

        # Build pour production
          npm run build
      
      4. Configuration Docker

         # Construction de toutes les images
            docker-compose build

         # Lancement des services
            docker-compose up -d
