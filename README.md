# Crypto Balance System

A simple crypto balance system developed using NestJS monorepo architecture. The system allows users to manage their crypto assets and view current valuations. It consists of two microservices: `balance-service` and `rate-service`, along with a shared library for common utilities.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [API Documentation with Swagger](#api-documentation-with-swagger)
- [Development Process](#development-process)
- [Cache Mechanism](#cache-mechanism)
- [Testing](#testing)
- [Logs](#logs)
- [Example Requests](#example-requests)
  - [Postman](#postman)
  - [cURL](#curl)
- [Running Prettier](#running-prettier)
- [Accessing Data Storage](#accessing-data-storage)
- [Future improvments and Features](#future-improvements-and-features)

# Overview

This project is designed as a monorepo architecture using NestJS, where two independent microservices are integrated to form the core functionality:

### Balance Service

The balance-service microservice allows users to manage their crypto holdings and provides the following functionalities:

- **CRUD Operations** for managing user balances (add/remove assets, retrieve balances).
- **Calculate Total Balance**: It computes the total balance in a specified currency.
- **Cache Mechanism**: The service caches the list of user coins and their holdings.

### Rate Service

The rate-service microservice integrates with the CoinGecko API to fetch and store current cryptocurrency rates. It also includes the following:

- **Get Operations**: for fatching coins current rate and crypto coins list.
- **Caching Mechanism**: The service caches the latest crypto rates to minimize API calls.
- **Background Job**: A job runs periodically to update the rates in the cache, The user can config the interval.

### Shared Library

The shared library contains modules that are used by both the `balance-service` and `rate-service`:

- **File Management**: A simple file management module for handling file-based data storage.
- **Logging Module**: A shared logging utility for standardized logging across services.
- **Error Handling**: A basic error handling module to manage errors consistently.
  Shared Interfaces: Common interfaces used across services.
- **Utility Functions**: Helper functions for common needs, such as data formatting or calculations.

## Getting Started

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd crypto-balance-system
    ```
2.  **Set Up Environment Variables**:
    Create a `.env` file in the root directory based on the `.env_template` and add necessary environment variables:

    ```env
      BALANCE_SERVER_PORT=3001
      RATE_SERVER_PORT=3002
      RATE_SERVER_URL=http://localhost:3002

      # Optional, defualt=600000 (10 minutes)
      RATE_REFRESH_INTERVAL=
    ```

3.  **Build and Start Services with Docker**:
    First, build the Docker containers without cache to ensure fresh dependencies:

    ```bash
        docker-compose build --no-cache
    ```

    Then, bring up the services:

    ```bash
        docker-compose up -d
    ```

    The services will be available on the ports defined in your .env file.

## API Documentation with Swagger

This project uses [Swagger](https://swagger.io/) to automatically generate and display the API documentation. The documentation is available via the Swagger UI, which allows you to interact with the API directly through a web interface.

### Accessing the Swagger UI

Once the application is running, navigate to the following URL in your browser to access the Swagger UI:

```text
  http://localhost:3001/api #for balanace service api
  http://localhost:3002/api #for rate service api
```

## Development Process

- **Running Scripts**: You can run tests and scripts within the container by using the relevant `package.json` file located in each service directory.

  - Example to run tests for balance-service:
    ```bash
      docker-compose exec <container-name> npm run test
    ```

- **Logs**: You can view logs of any running container by using the following command:

  ```bash
    docker logs <container-name> -f
  ```

- **Accessing Data Storage**
  The JSON data files used for storing balances and rates are located inside the container in the /usr/src/app/data/dist directory. You can access them by executing:

  ```bash
    docker-compose exec balance-service
    cat /usr/src/app/data/dist/balanceData.json
  ```

- You can send requests to the services using `Postman` or `cURL`.

  - **Postman**
    Send a POST request to http://localhost:3001/balances with a JSON body:

    ```json
    {
      "userId": "12345",
      "asset": "bitcoin",
      "amount": 2.5
    }
    ```

  - **cURL**
    ```bash
      curl -X POST http://localhost:3001/balances \
        -H "X-User-ID: 12345" \
        -d '{"asset": "bitcoin", "amount": 2.5}'
    ```
    **The CoinGecko free API has a rate limit of 50 requests per minute. Make sure to not exceed this limit to avoid being blocked from making further requests.**

- Before merging your changes into the main branch, ensure that you have run both `Prettier` and `ESLint` to maintain consistent code quality across the project. This is essential to avoid any potential formatting issues or linting errors. You should make sure that there are zero errors reported by both tools. To do this, run the following commands:

  ```bash
    docker-compose exec <container-name> npm run lint
  ```

  ```bash
    # outside container in rootDir
    npm run format
  ```

## Future improvments and Features

- **Improve Caching Mechanism**

  - Enhance the current caching system by implementing Redis for even faster responses and reduced API calls to external services.

- **Transactions Between Users**
  - Implement a transfer mechanism that allows users to send funds to each other securely.
  - Maintain a transaction history so users can track their past transactions.
  - Ensure transactional integrity using MongoDB transactions or distributed transactions across microservices.
- **Integration with IAM Service**

  - Integrate with an Identity and Access Management (IAM) service to handle authentication and authorization.

- **Real-Time Updates via WebSockets**

  - Add WebSocket support to push live exchange rate updates to connected clients.
  - Notify users when a significant rate change occurs or if a configured threshold is met.

- **Fixes**
  - Hotfix for rate service mock tests.
  - Remove `any` type from tests and enforce `ESLint` rules on tests.
  - Add shared test utilities.
  - Add `nodemon` configuration for an easier development process.
