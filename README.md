# University User Management System

## Technologies
**Frontend:** Next.js, TailwindCSS, NextAuth, React-Toastify

**Backend:** Node.js, Express.js, Prisma, Swagger, Bcryptjs

**Database:** mySQL

## How to run
### 1. Clone repository
1. Run `git clone https://github.com/NonRoute/University-User-Management-System`

### 2. Setup environment variables
1. Navigate to `server` directory 
2. Create file named `.env` by copying from `.env.example`
3. Navigate to `client` directory 
4. Create file named `.env.local` by copying from `.env.local.example`

### 3A. (Without Docker) Install dependencies
1. Install MySQL Workbench and update the `DATABASE_URL` in the `.env` file inside `server` directory to match with your connection string
2. Navigate to `server` directory 
3. Run `npm install`
4. Run `npx prisma migrate dev --name init` to setup the database schema
5. Run `npx prisma db seed` to seed the database with inital data
6. Run `npm run dev` to start the server
7. Navigate to `client` directory 
8. Run `npm install` and `npm run dev` to start the client
   
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3B. (With Docker)
1. Run `docker-compose up`
2. Wait until all service start. Once ready, it should look like this

<p align="left">
    <img src="./images/DockerFinish.png" width="500">
</p>

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ER diagram
<p align="center">
    <img src="./images/ERdiagram.png" width="1000">
</p>

## Frontend UI
<p align="center">
    <img src="./images/Landing.png" width="800">
</p>
<p align="center">
    <img src="./images/Login.png" width="800">
</p>
<p align="center">
    <img src="./images/Users.png" width="800">
</p>
<p align="center">
    <img src="./images/CreateUser.png" width="800">
</p>

## How I developed this project
1. Understanding the requirements
2. Choose frontend, backend languages and frameworks and database to use
3. Create ER diagram and database schema
4. Create UI design with Figma
5. Design API endpoints and develop backend server
6. develop frontend
7. Create Docker compose
