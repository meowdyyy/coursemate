# CourseMate Server

This is the backend server for the CourseMate application, a platform for university students to share and access past academic resources.

## Database Setup

CourseMate uses MongoDB Atlas as its database. Follow these steps to set up your own MongoDB Atlas database:

1. **Create a MongoDB Atlas account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
   - Create a new project.

2. **Create a cluster**:
   - Click "Build a Cluster" and select the free tier option (M0).
   - Choose your preferred cloud provider and region.
   - Click "Create Cluster" (this may take a few minutes).

3. **Set up database access**:
   - In the left sidebar, click "Database Access" under Security.
   - Click "Add New Database User".
   - Create a username and password (save these credentials).
   - Set privileges to "Read and Write to Any Database".
   - Click "Add User".

4. **Set up network access**:
   - In the left sidebar, click "Network Access" under Security.
   - Click "Add IP Address".
   - For development, you can click "Allow Access from Anywhere" (not recommended for production).
   - Click "Confirm".

5. **Get your connection string**:
   - Once your cluster is created, click "Connect".
   - Select "Connect your application".
   - Copy the connection string.
   - Replace `<username>` and `<password>` with your database user credentials.
   - Replace `<dbname>` with `coursemate`.

6. **Configure your environment**:
   - Create a `.env` file in the server directory.
   - Add your connection string as `MONGODB_URI=your_connection_string`.
   - Add your JWT secret as `JWT_SECRET=your_jwt_secret`.
   - Add your port as `PORT=5050`.

Example `.env` file:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/coursemate?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
PORT=5050
```

## Running the Server

1. Install dependencies:
```
npm install
```

2. Start the server:
```
node server.js
```

The server will be running at http://localhost:5050.

## API Endpoints

- `POST /users/signup`: Register a new user
- `POST /users/signin`: Login a user
- `GET /profile`: Get user profile
- `PUT /profile`: Update user profile
- `GET /notes`: Get all notes (with optional filters)
- `GET /notes/:id`: Get a specific note
- `POST /notes/upload`: Upload a new note
- `PUT /notes/:id`: Update a note
- `POST /notes/:id/download`: Track a note download
- `POST /notes/:id/rate`: Rate a note
- `GET /courses`: Get all available courses
- `POST /dashboard/courses`: Add a course to user's dashboard
- `GET /dashboard/courses`: Get user's dashboard courses
- `DELETE /dashboard/courses/:courseId`: Remove a course from user's dashboard
