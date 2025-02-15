# Crypto Balance System

A simple crypto balance system developed using NestJS monorepo architecture. The system allows users to manage their crypto assets and view current valuations. It consists of two microservices: `balance-service` and `rate-service`, along with a shared library for common utilities.

## Table of Contents
- [Overview](#overview)
- [Services](#services)
  - [Balance Service](#balance-service)
  - [Rate Service](#rate-service)
  - [Shared Library](#shared-library)
- [Getting Started](#getting-started)
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

## Overview

This project is designed as a monorepo architecture using NestJS, where two independent microservices are integrated to form the core functionality:
1. **Balance Service**: Manages the user's crypto balance and allows CRUD operations for assets.
2. **Rate Service**: Fetches real-time cryptocurrency rates from the CoinGecko API and stores them in a cache.
3. **Shared Library**: Contains utility functions and shared modules for file management, logging, and error handling.

## Services

### Balance Service
The balance-service microservice allows users to manage their crypto holdings and provides the following functionalities:

* **CRUD Operations** for managing user balances (add/remove assets, retrieve balances).
* **Calculate Total Balance**: It computes the total balance in a specified currency.

### Rate Service
The rate-service microservice integrates with the CoinGecko API to fetch and store current cryptocurrency rates. It also includes the following:

* **Caching Mechanism**: The service caches the latest crypto rates to minimize API calls.
* **Background Job**: A job runs periodically to update the rates in the cache.

### Shared Library
The shared library contains modules that are used by both the `balance-service` and `rate-service`:

* **File Management**: A simple file management module for handling file-based data storage.
* **Logging Module**: A shared logging utility for standardized logging across services.
* **Error Handling**: A basic error handling module to manage errors consistently.
Shared Interfaces: Common interfaces used across services.
* **Utility Functions**: Helper functions for common needs, such as data formatting or calculations.

### Cache Mechanism
The system employs a cache mechanism to optimize the performance of the services:

1. **Rate Service**: Stores the cache of cryptocurrency rates to reduce the frequency of API calls to the CoinGecko API.
2. **Balance Service**: Caches the list of user coins and their holdings. This cache is updated lazily, ensuring that the value of each coin is fetched only when needed, reducing redundant calculations.

## Getting Started

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd crypto-balance-system
   ```
2. **Set Up Environment Variables**: 
Create a `.env` file in the root directory based on the `.env_template` and add necessary environment variables:
    ```env
    BALANCE_SERVER_PORT=3001
    RATE_SERVER_PORT=3002
    RATE_SERVER_URL=http://localhost:3002
    RATE_REFRESH_INTERVAL= #optional, defualt=600000 (10 minutes)
    ```
3. **Build and Start Services with Docker**: 
First, build the Docker containers without cache to ensure fresh dependencies:

    ```bash
      docker-compose build --no-cache
    ```
    Then, bring up the services:
    ```bash
      docker-compose up -d
    ```
The services will be available on the ports defined in your .env file.

## Development Process
* **Running Scripts**: You can run tests and scripts within the container by using the relevant `package.json` file located in each service directory.
  * Example to run tests for balance-service:
    ```bash
      docker-compose exec <container-name> npm run test
    ```

* **Logs**: You can view logs of any running container by using the following command:
    ```bash
      docker logs <container-name> -f
    ```

* **Accessing Data Storage**
The JSON data files used for storing balances and rates are located inside the container in the /usr/src/app/data/dist directory. You can access them by executing:

  ```bash
    docker-compose exec balance-service 
    cat /usr/src/app/data/dist/balanceData.json
  ```

* You can send requests to the services using `Postman` or `cURL`.

  * **Postman**
  Send a POST request to http://localhost:3001/balances with a JSON body:

    ```json
      {
        "userId": "12345",
        "asset": "bitcoin",
        "amount": 2.5
      }
    ```
  * **cURL**
    ```bash
      curl -X POST http://localhost:3001/balances \
        -H "X-User-ID: 12345" \
        -d '{"asset": "bitcoin", "amount": 2.5}'
    ```
  **The CoinGecko free API has a rate limit of 50 requests per minute. Make sure to not exceed this limit to avoid being blocked from making further requests.**

* Before merging your changes into the main branch, ensure that you have run both `Prettier` and `ESLint` to maintain consistent code quality across the project. This is essential to avoid any potential formatting issues or linting errors. You should make sure that there are zero errors reported by both tools. To do this, run the following commands:
    ```bash
      docker-compose exec <container-name> npm run lint
    ```

    ```bash
      # outside container in rootDir
      npm run format
    ```

## Future improvments and Features
TODO