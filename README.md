# NestJS Microservice Example

This project is a NestJS-based microservice example.

## Description

This project implements a microservice architecture using NestJS. It provides core functionalities including user
management, authentication and authorization, project management, and an API gateway to orchestrate communication
between services. This example serves as a robust foundation for building scalable and maintainable distributed
applications.

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:

* **Node.js**: A recent LTS version (e.g., v18.x or v20.x). You can download it from [nodejs.org](https://nodejs.org/).
* **npm**: Node Package Manager (comes with Node.js).
* **Docker**: (Optional, but recommended if using containerized services). Download
  from [docker.com](https://www.docker.com/products/docker-desktop/).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mahdi-vajdi/nestjs-microservice-example.git
   ```
2. Navigate to the project directory:
   ```bash
   cd nestjs-microservice-example
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Available Scripts

In the project directory, you can run the following commands:

- `npm run prebuild`: Removes the `dist` folder.
- `npm run build`: Builds the application.
- `npm run format`: Formats the code using Prettier.
- `npm run start`: Starts the application.
- `npm run start:dev`: Starts the application in watch mode.
- `npm run start:debug`: Starts the application in debug mode with watch.
- `npm run start:prod`: Starts the production build (specifically `dist/apps/dashboard-ms/main`).
- `npm run lint`: Lints the codebase using ESLint and auto-fixes issues.
- `npm run test`: Runs Jest tests.
- `npm run test:watch`: Runs Jest tests in watch mode.
- `npm run test:cov`: Runs Jest tests and generates a coverage report.
- `npm run test:debug`: Runs Jest tests in debug mode.
- `npm run test:e2e`: Runs end-to-end tests for the `dashboard-ms` application.

## Project Structure

This project uses a monorepo structure managed with npm workspaces:

- `apps/`: Contains the different microservice applications.
    - `apps/auth`: Authentication and authorization service.
    - `apps/gateway`: API Gateway to route requests to appropriate microservices.
    - `apps/project`: Project management service.
    - `apps/user`: User management service.
- `libs/`: Contains shared libraries used across applications.
    - `libs/common`: Common utilities and modules.
    - `libs/infrastructure`: Infrastructure-related modules (e.g., database, messaging).

## Microservices

This project consists of the following microservices:

- **Auth Service**: Handles user authentication, including registration, login, and token generation (e.g., JWT). It is
  also responsible for authorization, managing roles and permissions to control access to various resources and
  services.
- **Gateway Service**: Acts as the single entry point for all incoming client requests. It routes requests to the
  appropriate downstream microservices (`user`, `project`, etc.), and can also handle cross-cutting concerns like
  request aggregation, SSL termination, rate limiting, and authentication/authorization checks.
- **Project Service**: Manages all aspects of projects, including creation, retrieval, updates, and deletion of project
  data. It may also handle project-specific settings, tasks, or collaborations.
- **User Service**: Responsible for managing user-specific information, such as profiles, preferences, and other
  user-related data, distinct from authentication details which are handled by the Auth service.

## API Documentation

API documentation can be generated and viewed using Swagger (OpenAPI).
Once the application (specifically the Gateway service) is running, you can typically access the Swagger UI at
`http://<HOST>:<PORT>/api`.

## Deployment

- Building Docker images for each service.
- Using `docker-compose` for local/development deployment.
- Instructions for deploying to a cloud provider (e.g., AWS, Azure, GCP) or a Kubernetes cluster.
- Environment variable configuration.]

A basic approach using Docker might involve:

1. Ensure Docker is installed and running.
2. Navigate to the `docker` directory (if it contains relevant `Dockerfile`s or a `docker-compose.yml`).
3. Build the images: `docker-compose build` (or individual `docker build` commands).
4. Run the services: `docker-compose up`.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these general guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bug fix (`git checkout -b feature/your-feature-name` or
   `bugfix/issue-number`).
3. Make your changes and commit them with clear, descriptive messages.
4. Push your changes to your forked repository.
5. Open a Pull Request (PR) against the main repository's `develop` or `main` branch.
6. Ensure your PR includes a clear description of the changes and any relevant issue numbers.

## License

This project is released under
the [MIT License](https://github.com/mahdi-vajdi/nestjs-microservice-example/blob/master/LICENSE)