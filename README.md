# 🎲 Projet Motus (Microservices)

Ce projet est une application de jeu Motus, divisée en plusieurs microservices. Chaque microservice est conteneurisé avec Docker.

## Structure du projet

Le projet est structuré comme suit :

- `auth/` : Microservice d'authentification et d'enregistrement de l'utilisateur.
- `motus/` : Microservice principal du jeu Motus.
- `score/` : Microservice pour gérer les scores des joueurs.

Chaque microservice a son propre `Dockerfile` pour construire une image Docker, et il y a un `docker-compose.yaml` à la racine du projet pour orchestrer les microservices.

## Comment exécuter ce projet avec Docker

1. Clonez ce dépôt :
```git clone https://github.com/yourusername/yourrepository.git```

2. Build and run Docker containers :
```docker-compose up --build``` 



Les microservices sont maintenant accessibles aux adresses suivantes :

Authentification : http://localhost:3005
Motus            : http://localhost:3000
Score            : http://localhost:3001


## Dépendances

Ce projet utilise les dépendances suivantes :

axios
body-parser
connect-redis
cors
crypto
express
express-session
jsonwebtoken
os
redis
seedrandom




##Diagram Mermaid
```mermaid
flowchart TD
    subgraph auth["auth"]
        login["/login"]
        register["/register"]
    end
    subgraph motus["motus"]
        word["/word"]
        checkword["/checkword"]
    end
    subgraph score["score"]
        score_endpoint["/score"]
    end
    redis_db_auth[("Redis DB Auth")]
    redis_db_score[("Redis DB Score")]
    user["User"]
    user -->|POST| login
    user -->|POST| register
    login -->|GET| redis_db_auth
    register -->|SET| redis_db_auth
    login -->|Redirect| motus
    user -->|GET| word
    user -->|POST| checkword
    checkword -->|POST| score_endpoint
    score_endpoint -->|GET| redis_db_score

