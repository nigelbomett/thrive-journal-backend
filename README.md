# REST API with Node.Js using Typescript

This is a simple rest api developed using node.js and express with typescript for a journaling application.

## Getting Started

### Prerequisites

You will need to install
- Node.js and npm (or yarn)
- TypeScript
- Database(MySQL)

### Setup Database

#### Step 1: Install MySQL
If MySQL is not already installed on your system, you can download it from the MySQL Community Downloads page: "https://dev.mysql.com/downloads/mysql/"

#### Step 2: Create Database and User

1. Connect to MySQL: Use MySQL command-line tool or a GUI tool like MySQL Workbench 
to connect  to your MySQL server.

2. Create Database: Create a new database for your project.

3. Create User: Create a MySQL user and grant privileges on the database.

#### Step 3: Configure `.env` File

Create a `.env` file in the root directory of your project and add the following configuration

    # Database
    DB_NAME
    DB_USERNAME
    DB_PASSWORD
    DB_HOST

### Run the app locally

* git clone https://github.com/nigelbomett/thrive-journal-backend.git
* npm install
* npm start - This will start the application and run on port 25234
* npm run dev - This will start the application in development mode


## Features
* JWT Authentication
* CRUD operations
* Tests

## Authors
-[Nigel Bomett]("www.nigelbomett.com")

## Version History
* 0.1
    * Initial Release