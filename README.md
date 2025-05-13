# CourseMate

**CourseMate** is a student-centric platform designed to help users upload, browse, and download academic notes. It facilitates collaborative learning by offering document editing, commenting features, and a community-driven approach. Students can filter and search for notes, making it easier to find relevant academic resources. The platform also provides a profile page for each user and a video library featuring free courses.

## Features

- **Upload and Download Notes:** Upload your academic notes for others to download and learn from.
- **Document Editing:** Edit your notes before publishing them for quick changes.
- **Commenting System:** Engage with other students by commenting on notes.
- **Advanced Search and Filters:** Search and filter notes by field, branch, and course to find exactly what you need.
- **Profile Page:** Each user has their own profile page where their uploaded documents are displayed.
- **Free Course Library:** Access a collection of free course videos to further your learning.

## Tech Stack

- **Frontend:** React.js, HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **File Storage:** Multer for file uploads
- **Authentication:** JWT (JSON Web Tokens) for secure authentication
- **Version Control:** Git, GitHub

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/meowdyyy/coursemate.git
cd coursemate
```
2. Install dependencies
---For Frontend (React):
```bash
npm install
```
---For Backend (Node.js):
```bash
cd server
npm install
```
4. Configure environment variables:

    Create a .env file and add necessary configurations (e.g., database URL, cloud storage keys).
```bash
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret_key
```
6. Run the development server:
---For Frontend (React):
```bash
npm start
```
---For Backend (Node.js):
```bash
cd server
node server.js
```

## Contribution Guidelines

We welcome contributions to improve CourseMate. Here's how you can get involved:

- Fork the repository.
- Create a new branch (git checkout -b feature-branch).
- Make your changes.
- Push your changes and create a pull request.
