# Phototeque Application

This is a Node.js application using Express and EJS for templating. The application displays a welcome message on the homepage.

## Project Structure

```
my-app/
│
├── src/
│ ├── controllers/
│ │ └── userController.js
│ │ └── AlbumController.js
│ ├── models/
│ │ └── User.js
│ │ └── Album.js
│ ├── routes/
│ │ └── userRoutes.js
│ │ └── albumRoutes.js
│ │ └── photoRoutes.js
│ ├── views/
│ │ ├── partials/
│ │ │ └── navbar.ejs
│ │ ├── layouts/
│ │ │ └── layout.ejs
│ │ └── user/
│ │   └── profile.ejs
│ │   └── login.ejs
│ │   └── register.ejs
│ │ └── albums/
│ │   └── photos.ejs
│ │   └── album.ejs
│ │   └── explore.ejs
│ └── config/
│   └── database.js
│
├── tests/
├── public/
│ ├── css/
│ │ └── style.css
│ ├── js/
│ │ └── script.js
│ └── images/
│   └── avatar.png
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── Dockerfile
├── docker-compose.yaml
├── package-lock.json
├── README.md
└── index.js
```


## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/pinsdev/phototheque.git
    cd 3NPM
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:

    ```plaintext
    NODE_ENV=development
    PORT=3000
    JWT_SECRET=your_jwt_secret
    MONGO_URI=mongodb://localhost:27017/phototeque
    MONGO_URI_TEST=mongodb://localhost:27017/phototeque_test
    NODE_ENV=development
    SESSION_SECRET=your_session_secret
    ```

4. Start the server:

    ```bash
    npm run start
    ```

    Or if you are using nodemon for development:

    ```bash
    npm run dev
    ```

## Running the App with Docker

To run this app using Docker, follow these steps:

### Using Docker Compose
1. **Install Docker**: If you haven't installed Docker, follow the installation instructions on [Docker's official documentation](https://www.docker.com/products/docker-desktop/).

2. **Run the App**:
   ```bash
   docker-compose up
   ```
   This command will build the images and start the containers defined in the `docker-compose.yaml` file.

3. **Access the App**: Open your web browser and go to `http://localhost:3000` to access the app.

## Usage

- Visit `http://localhost:3000` in your browser to see the welcome message.
- You can add more routes, controllers, models, and views as needed to expand the functionality of your application.

## Project Details

### `index.js`

Sets up the Express server, loads environment variables, configures middlewares, sets the view engine to EJS, and starts the server.

### `src/controllers`

Contains controller logic. Example: `userController.js` handles requests for user-related routes.

### `src/models`

Contains data models. Example: `userModel.js` contains user data and methods to interact with it.

### `src/routes`

Defines the application routes. Example: `userRoutes.js` contains routes for user-related operations.

### `src/views`

Contains EJS templates for rendering HTML. Example: `index.ejs` displays the welcome message.

### `public`

Contains static files such as CSS, JavaScript, and images. Example: `style.css` contains styles for the welcome message.

### `test`

Contains all unit and integration test files.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any features, bug fixes, or enhancements.
