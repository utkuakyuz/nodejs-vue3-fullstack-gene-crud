# Genetic Variants CRUD - Vue.js & Node.js

This project is a full-stack CRUD application I created to develop my Vue.js and Node.js skills. It's a simple application designed to view-add-delete genetic variant data.

## Development Notes

This project was developed for learning purposes. I arbitrarily added PostgreSQL database in a Docker container and didn't use real genetic data. The project is designed to to revisit Vue3 and enhance my Node.js (specifically Express and Sequelize) skills.

## Further Work

Moreover I want to transform this backend into a new Bun - TypeScript project to modernize, became typesafe and get hands on experience on Bun. 

## ACKNOWLEDGEMENT

Now I created a new Backend app inside backend-ts folder. This app is created for Type-Safe Service-Repository pattern application and I completed it. It runs exactly as expected and now is type safe.

## Tech Stack

- **Vue.js 3** (Composition API) for frontend
- **Node.js & Express.js** for RESTful API
- **PostgreSQL** database and Sequelize ORM
- **Docker** for containerization

### Running with Docker

```bash

cd project-directory

# Start with Docker Compose
docker compose up -d

# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
# PostgreSQL: localhost:5433
```

### Frontend

- **Vue 3** - Reactive UI with Composition API
- **Pinia** - State management
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Sequelize** - ORM for PostgreSQL

### Database

- **PostgreSQL** - Database running in Docker container

### DevOps

- **Docker**

## API Endpoints

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/api/variants`     | List all variants    |
| POST   | `/api/variants`     | Add new variant      |
| GET    | `/api/variants/:id` | Get specific variant |
| PUT    | `/api/variants/:id` | Update variant       |
| DELETE | `/api/variants/:id` | Delete variant       |

## Features

- **CRUD Operations** - Add, edit, delete, list genetic variants
- **Filtering** - Client Side Filter variants by gene and type
- **Docker Support** - Easy deployment and development environment

