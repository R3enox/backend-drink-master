# 🍸Drink Master App 

### 👋 Welcome to the app!
Our app is more than just a collection of drinks - its a designed to be your own digital cocktail maker!
This app will allow you to easily find and add your favorite cocktail recipes and create your own unique ones. 

## Tech Stack 
The project builds RESTful APIs using Node.js, Express and Mongoose

<p align="left"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="70" height="60"/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" alt="mongodb" width="60" height="50"/>
<img src="https://raw.githubusercontent.com/swagger-api/swagger.io/wordpress/images/assets/SW-logo-clr.png" height="50">
<img src="/public/readme/google.png" height="40">
<img src="https://github.com/MarioTerron/logo-images/blob/master/logos/expressjs.png" height="30">
<img src="https://cloudinary-res.cloudinary.com/image/upload/c_scale,w_300/v1/logo/for_white_bg/cloudinary_logo_for_white_bg.svg" height="30"></p>

## Manual Installation

#### Installing Node and NPM

This project depends on Nodejs and Node Package Manager (NPM). Before continuing, you must download and install Node (the download includes NPM) from [https://nodejs.com/en/download](https://nodejs.org/en/download/).

Clone the repo:

```bash
git clone https://github.com/R3enox/backend-drink-master.git
cd backend-drink-master
```

Install the dependencies:

```bash
npm install
```


Set the environment variables:

```bash
cp .env.example .env
# open .env and modify the environment variables
```

## Commands

Running in development:

```bash
npm start
# or
npm run dev
```
## Environment Variables

The environment variables can be found and modified in the `.env` file.

```bash
# App name
APP_NAME = # default App Name

# Host
DB_HOST = mongodb://127.0.0.1:27017/database_name
FRONTEND = 
BACK = 
# Port
PORT = 3000

# JWT
ACCESS_SECRET_KEY =
REFRESH_SECRET_KEY =

# Cloudinary
CLOUDINARY_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET =

# Email delivery
MAILTRAP_USER = 
MAILTRAP_PASSWORD = 

```

## Project Structure

```
 |--controllers\    # Controllers
 |--helpers\        # Help functions
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models
 |--routes\         # Routes
 |--app.js          # Express
 |--server.js       # Database connection
```

### Authentication 

**Security**: the refresh + access token scheme is used. A reliable mechanism for controlling users' "sensitive information".

The authentication system used in this project is Auth2 `./controllers/authController.js`, which contains the logic to redirect the user to the Auth2 login page, manage the JWT token after a successful callback, and handle the installation and retrieval of the token from the storage. This token is then used by our (./routes/api/drinks.js) and passed as an authorization header for requests to our backend.

## Link to Swagger API documentation

[Swagger Docs](https://drink-master-4fm6.onrender.com/api-docs)

## Link to Frontend Repo
To start using our app, go to the [link](https://github.com/R3enox/frontend-drink-master) and sign up for the system. Once you have successfully logged in, enjoy the app's features 😎

## 😎 Our Fullstack Web Developer Team

- **Mykyta Yeremenko** - Team Lead [Github][1]
- **Natalia Mahera** - Scrum Master [Github][2]
- **Yakiv Hrubskyi** - [Github][3]
- **Mykola Pavlovych** - [Github][4]
- **Kateryna Mala** - [Github][5]
- **Vadym Bobyrenko** - [Github][6]
- **Serhii Lutsenko** - [Github][7]
- **Alex Prokopiev** - [Github][11]
- **Karina Ahadzhanian** - [Github][8]
- **Eduard Sorokolietov** - [Github][9]
- **Angelina Smaluch** - [Github][10]

[1]: https://github.com/R3enox
[2]: https://github.com/NataliaMahera
[3]: https://github.com/y-hrubskyi
[4]: https://github.com/Mykola1612
[5]: https://github.com/malaya1855
[6]: https://github.com/wadimcka
[7]: https://github.com/SergeyLu89
[8]: https://github.com/KarinaCor
[9]: https://github.com/soroked
[10]: https://github.com/AngelinaCholak
[11]: https://github.com/AlexProkopev

