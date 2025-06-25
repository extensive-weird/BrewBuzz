# ☕ BrewBuzz Backend

BrewBuzz is the backend server for a full-stack coffee shop platform designed to connect local cafés with their customers. Built with **Node.js**, **Express.js**, and **PostgreSQL**, this API handles user authentication, business management, reviews, cart operations, and ordering. It also integrates with the **Clover POS system** and **AWS S3** to streamline business operations and file handling.

This backend was designed with one goal in mind: **to give peace of mind to coffee shop owners** by eliminating the hassle of manually updating menus. Instead, BrewBuzz fetches real-time data directly from Clover, ensuring the menu shown in the app is always up to date.

---

## 📘 Table of Contents

1. [Project Overview](#1-project-overview)  
2. [Technologies Used](#2-technologies-used)  
3. [Setup Instructions](#3-setup-instructions)  
4. [Database Setup](#4-database-setup)  
5. [Available APIs](#5-available-apis)  
6. [Run Commands](#6-run-commands)  
7. [Dependencies](#7-dependencies)  

---

## 1. Project Overview

BrewBuzz is a modern backend API built to power a mobile application that connects local coffee lovers with independent coffee shops. The platform facilitates customer engagement, business management, order processing, and real-time interactions through a secure, scalable RESTful API.

---

## 2. Technologies Used

| Category      | Technology             |
|---------------|------------------------|
| Runtime       | Node.js                |
| Framework     | Express.js             |
| Database      | PostgreSQL, Dbeaver,   |
|               | Sequelize              |
| Auth          | JWT, bcrypt            |
| File Uploads  | AWS S3, Multer         |
| Email Service | Nodemailer             |
| POS Sync      | Clover API             |
| Dev Tools     | Dotenv, Nodemon        |

---

## 3. Setup Instructions

### 3.1 Clone the Repository
```bash
git clone https://github.com/24techdesign/BrewBuzzBackend.git
cd brewbuzz-backend
```

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Environment Configuration  
Create a `.env` file and configure the required variables.

---

## 4. Database Setup
  We recommend using **DBeaver** to manage your **PostgreSQL** instance.

### Steps:
1. Install DBeaver: https://dbeaver.io

2. Connect to PostgreSQL using the credentials provided.

3. Database Name: brewbuzz_db (or as specified in your .env)

4. Schema Management:
All schema definitions and updates are handled through Sequelize models in the backend codebase.

5. Model Sync:
The backend automatically syncs the models with the database when the server starts.



## 5. Available APIs

- For available APIs, please refer to the Swagger.YAML file in the codebase. 
- Once the project is started you should be able to view the list of available APIs using http://localhost:3001/api-docs 

---

## 6. Run Commands

```bash
# Install dependencies
npm install

# Run in development mode (with auto reload)
npm run dev

# Run in production mode
npm start
```

---

## 7. Dependencies

For dependencies, please refer to the packages in the package-lock.json file in the codebase.


## 📄 Help

For any questions and concerns please contact 24techdesign@gmail.com

---
