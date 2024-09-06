# Employee Hierarchy Management System

[View the live application](https://vian-epiuse.vercel.app/)

## Overview

This cloud-hosted application efficiently manages employee hierarchies, offering features for CRUD operations, reporting structure control, and visual hierarchy representation. Integrated with Gravatar for avatars, it is deployed on Vercel with Supabase for robust data persistence.

## Key Features

### 1. Landing Page
Provides an introduction and an overview of the application's features.

### 2. Home Page

- **2.1 Create Tab**
  - **Function**: Allows users to create new employees with input validation.
  - **Reporting Line Manager**: Restricts selection if the employee is the CEO (only one CEO allowed).
  - **Validation**: Ensures no duplicate emails, checks for missing inputs, and validates formats.
  - **Error Handling**: Displays relevant error messages for invalid or missing data.

- **2.2 Manage Tab**
  - **2.2.1 Hierarchy View**
    - Displays the employee hierarchy in a tree structure.
    - **Search**: Search by name, surname, or role, and highlight employees in the tree.
    - **Edit Functionality**: Allows data editing with validations:
      - Role change restrictions if others report to the user.
      - Prevents users from managing themselves or their subordinates.
      - Prevents deletion of employees with subordinates.
      - Includes all validations from the create tab.

  - **2.2.2 List View**
    - **Function**: Shows a sortable and filterable table of employees.
    - **Sort & Filter**: Sort by name, role, email, or manager with combined filtering.
    - **Search**: Uses the same criteria as the hierarchy view.

### 3. Hierarchy Page
Displays the organizational hierarchy in an expandable and collapsible tree format for easy navigation.

### 4. About Page
Offers project information and links to personal profiles.

### 5. Dark/Light Mode
Automatically adapts to the user’s system theme for a seamless experience.

## Technical Overview

The application uses an API Gateway architecture to centralize request handling and security while separating frontend and backend concerns.

### 1. Technologies

- **Frontend**:
  - **Next.js**: Handles server-side rendering (SSR) and static site generation (SSG) for enhanced performance.
  - **Next UI**: Provides pre-built components for forms, tables, and hierarchy views.
  - **Tailwind CSS**: Ensures responsive design and supports both dark and light modes.

- **Backend**:
  - **API Gateway**: Centralized entry point for requests, enhancing security and routing.
  - **Supabase**: Manages database operations and real-time updates using PostgreSQL.
  - **Gravatar**: Fetches profile pictures based on employee email hashes.

- **Deployment**:
  - **Vercel**: Facilitates fast, scalable deployment with CI/CD integration linked to the main branch of the GitHub repository.

### 2. Justification for Technology Choices

- **API Gateway**: Simplifies security and request routing between frontend and backend.
- **Next.js**: Enhances performance with client-side and server-side rendering.
- **TypeScript**: Ensures robust type-checking, improving code reliability.
- **Supabase**: Provides a powerful backend-as-a-service solution.
- **Gravatar Integration**: Simplifies fetching profile pictures based on email addresses.
- **Vercel**: Ensures seamless deployment and hosting for Next.js applications.

### 3. Design Patterns

- **Repository Pattern**: Abstracts data access through services or utilities, enhancing maintainability and testability.
- **Observer Pattern**: Keeps the UI synchronized with data changes through reactive updates.
- **Factory Pattern**: Centralizes the creation of complex components or views for different roles, ensuring consistency and flexibility.

## Database Setup Overview

### Database Management System: PostgreSQL

- **Table: employees**
  - **Purpose**: Stores comprehensive employee information, including personal details, employment information, and role assignments.
  - **Structure**:
    - `id (UUID)`: Unique identifier for each employee (primary key).
    - `name (VARCHAR)`: Employee's first name.
    - `surname (VARCHAR)`: Employee's last name.
    - `birth_date (DATE)`: Date of birth.
    - `employee_id (VARCHAR)`: Internal tracking identifier.
    - `salary (NUMERIC/DECIMAL)`: Employee's salary.
    - `email (VARCHAR)`: Email address for Gravatar and communication.
    - `updated_at (TIMESTAMP)`: Timestamp of last update.
    - `created_at (TIMESTAMP)`: Timestamp of creation.
    - `role (role)`: Employee’s role (custom ENUM type).
    - `reporting_line_manager (role)`: Role of the manager.
    - `reporting_id (INTEGER)`: Foreign key linking to the manager’s ID.

- **Custom ENUM Type: role**
  - **Definition**: ENUM type defining various roles within the organization.
  - **Values**:
    - HR Manager
    - IT Manager
    - Finance Manager
    - IT Intern
    - HR Specialist
    - Financial Analyst
    - Accountant
    - Senior Developer
    - System Administrator
    - Database Administrator
    - Recruiter

### 3. Design Considerations

- **Role Management**: Role-based and ID-based references in hierarchical relationships.
- **Data Integrity**: Foreign key constraints ensure valid employee references.
- **Consistency**: ENUM type enforces valid role values for uniform role assignments.

