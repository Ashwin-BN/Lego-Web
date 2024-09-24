# LEGO Collection

## Description
LEGO Collection is a web application designed to manage LEGO sets using Node.js and Express.js. This application allows users to perform CRUD (Create, Read, Update, Delete) operations on LEGO sets, providing a seamless experience with dynamic HTML rendering, responsive forms, and a robust PostgreSQL database integration through Sequelize ORM.

## Technologies Used and Features

### Frontend
- **EJS (Embedded JavaScript)**: Renders dynamic HTML content on the server side.
- **Tailwind CSS**: Builds a responsive and visually appealing user interface.
- **JavaScript**: Adds interactivity and client-side functionality.

### Backend
- **Node.js**: Provides server-side scripting capabilities.
- **Express.js**: A lightweight framework for handling routing and middleware.

### Database
- **PostgreSQL**: A robust, open-source relational database for storing and managing data.
- **Sequelize ORM**: A promise-based Node.js ORM for managing database operations with PostgreSQL.

## Key Features
- **CRUD Operations**: 
  - **Create**: Allows users to add new LEGO sets.
  - **Read**: Displays all LEGO sets with links to details about each set.
  - **Update**: Modify details of existing LEGO sets.
  - **Delete**: Remove LEGO sets from the collection.

- **User Authentication**: 
  - **Register**: New users can create an account to access the application.
  - **Login/Logout**: Manages user authentication; login is required for accessing and managing protected routes.

- **User History**: View login history and activity for authenticated users.

- **Error Handling**: 
  - **404 (Not Found)**: Displays an error page when a resource or page is not found.
  - **500 (Internal Server Error)**: Shows an error page for unexpected server issues, with detailed logs for debugging.

## Deployment
The application is published and hosted on [Cyclic](https://cyclic.sh/).

## Environment Variables
The application requires a `.env` file for environment variables, which is not included in the repository. The `.env` file should contain the following:

```
DATABASE_URL=your_postgresql_connection_string
```

Make sure to replace `your_postgresql_connection_string` with your actual PostgreSQL connection string.

## Getting Started
To run the application locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Lego-Web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables as described above.

4. Start the server:
   ```bash
   node server.js
   ```

5. Open your browser and navigate to `http://localhost:8080` to access the application.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
Special thanks to the contributors and libraries that made this project possible.
Let me know if you need any further adjustments or additional sections!
