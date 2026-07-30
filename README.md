#  Resume Forge Backend API

RESTful API backend for **Resume Forge** — a platform designed to create, manage, import, duplicate, and export resumes and cover letters with nested sections, custom template configurations, and user authentication.

Built using **Node.js**, **Express.js**, **Sequelize ORM**, and **MySQL**.

---
##  Postman API Documentation

Explore and test the complete API collection:
* 👉 **[View Postman API Documentation Online](https://documenter.getpostman.com/view/56589047/2sBY4SNzfR)**

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


##  API Endpoints Overview

All routes are prefixed with the base URL: `http://localhost:5000/api`.

---

### 1. Auth Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | ❌ |
| `POST` | `/api/auth/reset-password` | Reset user password | 🔑 |

---

### 2. User Routes (`/api/users`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/users/me` | Get current user profile | 🔑 |
| `PUT` | `/api/users/me` | Update current user profile | 🔑 |
| `DELETE` | `/api/users/me` | Delete current user account | 🔑 |

---

### 3. Document Routes (`/api/documents`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/documents` | Create a new document (`type: resume / cover_letter`) | 🔑 |
| `GET` | `/api/documents` | List all documents belonging to user | 🔑 |
| `GET` | `/api/documents/:id` | Get full assembled document by ID | 🔑 |
| `PUT` | `/api/documents/:id` | Update document title or template | 🔑 |
| `POST` | `/api/documents/:id/duplicate` | Duplicate an existing document with all sections & items | 🔑 |
| `POST` | `/api/documents/import` | Import raw document content | 🔑 |
| `DELETE` | `/api/documents/:id` | Delete a document | 🔑 |

---

### 4. Section & Item Routes (Nested under `/api/documents` or `/api/sections`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/documents/:id/sections` | Add section to document | 🔑 |
| `PATCH` | `/api/documents/:id/sections/:sectionId` | Update section heading/position | 🔑 |
| `DELETE` | `/api/documents/:id/sections/:sectionId` | Delete section | 🔑 |
| `POST` | `/api/documents/:id/sections/:sectionId/items` | Add item to section | 🔑 |
| `PATCH` | `/api/documents/:id/sections/:sectionId/items/:itemId` | Update section item | 🔑 |
| `DELETE` | `/api/documents/:id/sections/:sectionId/items/:itemId` | Delete section item | 🔑 |

---

### 5. Template Routes (`/api/templates`)
Manage custom visual configurations including layout, typography, themes, and font styling options.
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/templates` | List all available resume/cover letter templates | ❌ |
| `GET` | `/api/templates/:id` | Get template details by ID or template name/slug | ❌ |

**Template Configuration Schema (`config` JSON structure)**:
* `theme`: Color theme palette (e.g. `"classic-navy"`, `"modern-emerald"`, `"minimal-dark"`)
* `fontFamily`: Primary font family (e.g. `"Inter"`, `"Roboto"`, `"Lora"`)
* `fontSize`: Base font size selection (e.g. `"10pt"`, `"11pt"`, `"12pt"`)
* `spacing`: Margin & padding scaling (e.g. `"compact"`, `"normal"`, `"loose"`)

---

### 6. Document Version Routes (Nested under `/api/documents` or `/api/versions`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/documents/:id/versions` | List all version snapshots for a document | 🔑 |
| `POST` | `/api/documents/:id/versions` | Create a new version snapshot | 🔑 |
| `GET` | `/api/documents/:id/versions/:versionId` | Get specific version snapshot | 🔑 |
| `DELETE` | `/api/documents/:id/versions/:versionId` | Delete a specific version snapshot | 🔑 |

---

### 7. Document Sharing Routes (`/api/share` and nested under `/api/documents`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/documents/:id/share` | Create/enable sharing for a document | 🔑 |
| `GET` | `/api/documents/:id/share` | Get active sharing details of a document | 🔑 |
| `DELETE` | `/api/documents/:id/share` | Disable sharing / delete share details | 🔑 |
| `GET` | `/api/share/:slug` | Retrieve public document content by unique share slug | ❌ |

---

### 8. Export Routes (`/api/exports` and nested under `/api/documents`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/documents/:id/export` | Export a document (logs export record) | 🔑 |
| `GET` | `/api/documents/:id/exports` | Get export logs specifically for a document | 🔑 |
| `GET` | `/api/exports` | Get all export log records of current user | 🔑 |
| `GET` | `/api/exports/:id` | Get details of a specific export log record | 🔑 |

---

### 9. Job Application Tracking Routes (`/api/applications`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/applications` | List all tracked job applications | 🔑 |
| `POST` | `/api/applications` | Create a new job application tracking entry | 🔑 |
| `GET` | `/api/applications/:id` | Get details of a tracked job application | 🔑 |
| `PUT` | `/api/applications/:id` | Update job application details / status | 🔑 |
| `DELETE` | `/api/applications/:id` | Delete application tracking entry | 🔑 |

---

## Authentication Header

For endpoints requiring authentication, pass the JWT token in the `Authorization` header:

```http
Authorization: Bearer <your_jwt_token>
```

---

##  Quick Start Postman / cURL Commands

You can run these commands directly or import them into Postman to test the backend API flow:

### 1. Register User (Unishka Bisht)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Unishka Bisht",
    "email": "[EMAIL_ADDRESS]",
    "password": "[PASSWORD]"
  }'
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "unishka.bisht@example.com",
    "password": "[PASSWORD]"
  }'
```

### 3. Create Document (Resume)
Make sure to replace `<your_jwt_token>` with the token received from the Login step:
```bash
curl -X POST http://localhost:5000/api/documents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "title": "Unishka Bisht - Software Engineering Resume",
    "type": "resume"
  }'
```


