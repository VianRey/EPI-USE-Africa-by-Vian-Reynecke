# Employee Hierarchy Management System

## [View Live Application](https://vian-epiuse.vercel.app/)

## Overview

This cloud-hosted application efficiently manages employee hierarchies, offering CRUD operations, reporting structure control, and visual hierarchy representation. It integrates Gravatar for avatars and is deployed on Vercel with Supabase for robust data persistence.

## Key Features

1. **Employee Management**
   - Create, read, update, and delete employee records
   - Input validation and error handling
   - Reporting line management with role-based restrictions

2. **Hierarchy Visualization**
   - Tree structure view with search functionality
   - List view with sorting and filtering options

3. **User Interface**
   - Responsive design with dark/light mode
   - Landing page with feature overview
   - About page with project information

## Technical Stack

- **Frontend**: Next.js, Next UI, Tailwind CSS
- **Backend**: API Gateway, Supabase (PostgreSQL)
- **Additional**: Gravatar integration, TypeScript
- **Deployment**: Vercel

## Architecture Highlights

- API Gateway for centralized request handling and security
- Repository Pattern for data access abstraction
- Observer Pattern for reactive UI updates
- Factory Pattern for consistent component creation

## Database Schema

**Table: employees**
- Key fields: id (UUID), name, surname, email, role (ENUM), reporting_line_manager, reporting_id
- Custom ENUM type for roles (e.g., HR Manager, IT Manager, etc.)

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`

## Deployment

The application is automatically deployed to Vercel upon pushing to the main branch.

## Acknowledgments

- Vercel and Supabase for hosting and database services
