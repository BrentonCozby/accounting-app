# Accounting App

A single-page application for tracking a company's expenditures. Built with the PERN stack (Postgres, Express, React, NodeJS).

### Features

* 3 different user roles (admin, manager, user), each with different permissions levels
* Can view all expenditures or expenditures for a certain user
* Summary reports available with expenditures per week, including total spending per week and avergage daily spending
* Expenditure tables allows filtering and sorting per column
* Independent REST API can be used by any app, such as Postman
* Unit tests for the UI services `yarn test`

### Technology used

* API created with NodeJS, Express, SQL
* Authentication with PassportJS, bcrypt, and jsonwebtoken (jwt saved in browser local storage)
* PostgreSQL database
* UI created with React; uses react-table for tables

### How to start the app

1) Start the PostgreSQL database
2) `node api/index.js` for the API
3) `yarn start` for the UI
4) `yarn test` for the unit tests
