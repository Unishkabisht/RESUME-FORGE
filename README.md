#  Resume Forge Backend API

RESTful API backend for **Resume Forge** — a platform designed to create, manage, import, duplicate, and export resumes and cover letters with nested sections, custom template configurations, and user authentication.

Built using **Node.js**, **Express.js**, **Sequelize ORM**, and **MySQL**.

---
##  Postman API Documentation

Explore and test the complete API collection directly in Postman:
👉 **[View Postman API Documentation](https://documenter.getpostman.com/view/56589047/2sBY4SMyuy)**


##  Features

-  **User Authentication & Management**: Registration, login, password reset (JWT-based token authentication), and user profile management.
-  **Document Management**: Create, list, retrieve, update, duplicate, import, and delete resume or cover letter documents.
-  **Flexible Document Structure**:
  - **Sections**: Dynamic ordering and section headings within documents.
  - **Items**: Nested items inside sections for detailed experience, education, skills, projects, etc.
-  **Templates Support**: Browse resume templates with configurable styling options (retrievable by ID or slug/name).
-  **Ownership & Security**: Middleware-driven JWT verification and resource ownership authorization.

---

##  Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize ORM (`sequelize`, `sequelize-cli`)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcrypt`)
- **Environment Management**: `dotenv`

---

##  Project Architecture

```
RESUME-FORGE-BACKEND/
├── config/             # Database connection & Sequelize configuration
├── controllers/        # Request handlers (auth, document, section, template, user)
├── middlewares/        # Authentication & document ownership validation
├── migrations/         # Sequelize database schema migrations
├── models/             # Sequelize models (User, Document, Section, Item, Template, etc.)
├── routes/             # Express API routes definition
├── seeders/            # Database seeders
├── .env                # Environment configuration variables
├── app.js              # Application entry point
└── package.json        # Dependencies & scripts
```

---

##  Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MySQL Server](https://www.mysql.com/) running locally or remotely

---

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Unishkabisht/RESUME-FORGE.git
   cd RESUME-FORGE
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory (or update existing `.env`):

   ```env
   PORT=5000
   DATABASE_USER=root
   DATABASE_PASSWORD=your_mysql_password
   DATABASE_NAME=resume_forge_api
   DATABASE_HOST=127.0.0.1
   MYSQL_PORT=3306
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run Database Migrations**
   ```bash
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The API server will start on `http://localhost:5000`.

---

##  API Endpoints Overview

All routes are prefixed with `/api`.

###  Auth Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | ❌ |
| `POST` | `/api/auth/reset-password` | Reset user password | 🔑 |

---

###  User Routes (`/api/users`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/users/me` | Get current user profile | 🔑 |
| `PUT` | `/api/users/me` | Update current user profile | 🔑 |
| `DELETE` | `/api/users/me` | Delete current user account | 🔑 |

---

###  Document Routes (`/api/documents`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/documents` | List all documents belonging to user | 🔑 |
| `POST` | `/api/documents` | Create a new document (`type: resume / cover_letter`) | 🔑 |
| `POST` | `/api/documents/import` | Import raw document content | 🔑 |
| `GET` | `/api/documents/:id` | Get full assembled document by ID | 🔑 |
| `PUT` | `/api/documents/:id` | Update document title or template | 🔑 |
| `POST` | `/api/documents/:id/duplicate` | Duplicate an existing document with all sections & items | 🔑 |
| `DELETE` | `/api/documents/:id` | Delete a document | 🔑 |

---

###  Section & Item Routes (Nested under `/api/documents`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/documents/:id/sections` | Add section to document | 🔑 |
| `PATCH` | `/api/documents/:id/sections/:sectionId` | Update section heading/position | 🔑 |
| `DELETE` | `/api/documents/:id/sections/:sectionId` | Delete section | 🔑 |
| `POST` | `/api/documents/:id/sections/:sectionId/items` | Add item to section | 🔑 |
| `PATCH` | `/api/documents/:id/sections/:sectionId/items/:itemId` | Update section item | 🔑 |
| `DELETE` | `/api/documents/:id/sections/:sectionId/items/:itemId` | Delete section item | 🔑 |

---

###  Template Routes (`/api/templates`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/templates` | List all available templates | ❌ |
| `GET` | `/api/templates/:id` | Get template by ID or template name/slug | ❌ |

---

## Authentication Header

For endpoints requiring authentication, pass the JWT token in the `Authorization` header:

```http
Authorization: Bearer <your_jwt_token>
```

