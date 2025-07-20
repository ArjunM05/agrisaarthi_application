# AgroSaarthi Web Application

AgroSaarthi is a React-based web platform designed to empower farmers and agricultural suppliers. It provides tools for pest identification, pesticide information, and supplier inventory management, streamlining agricultural workflows and improving access to resources.

---

## 1. Application Overview

AgroSaarthi serves as a digital bridge between farmers and suppliers, offering:
- AI-powered pest identification
- Comprehensive pesticide database
- Supplier inventory and order management
- Role-based dashboards for farmers and suppliers

---

## 2. Technical Stack

- **Frontend Framework:** React 19.1.0 (TypeScript)
- **Build Tool:** Vite 6.3.5
- **UI Components:** React Bootstrap 5.3.7, custom styles
- **Routing:** React Router v7.6.2
- **State Management:** React Context API
- **Authentication:** Supabase (@supabase/supabase-js)
- **Chat Interface:** @botpress/webchat 3.1.0-beta.0
- **HTTP Client:** Axios 1.10.0

---

## 3. Application Structure

```
src/
├── Components/     # Reusable UI components
├── layouts/        # Layout components for different user types
├── pages/          # Page components
├── utils/          # Utility functions and API helpers
├── App.tsx         # Main application component with routing
└── main.tsx        # Application entry point
```

---

## 4. Key Features

### 4.1 User Authentication & Authorization
- Role-based access (Farmer/Supplier)
- Protected routes using `RequireAuth`
- JWT-based authentication via Supabase

### 4.2 User Roles

**Farmers:**
- Image-based pest identification
- Access pesticide information
- View supplier and pest history

**Suppliers:**
- Manage inventory
- View order and sales history

### 4.3 Core Functionalities
- **Pest Identification:** Upload images for AI-based pest detection
- **Pesticide Database:** Browse and search pesticide information
- **Inventory Management:** Suppliers can add, update, and track products
- **Profile Management:** Edit user details, role-specific info
- **Supplier History:** Track past interactions and orders

---

## 5. Technical Implementation Details

### 5.1 Routing
- Public routes: `/login`, `/registration`, `/contact`
- Protected routes: `/farmer/*`, `/supplier/*`
- Role-based redirection after login

### 5.2 State Management
- User session persisted in local storage
- Global state via React Context API

### 5.3 API Integration
- Supabase for authentication and database
- Custom API endpoints for app-specific features

---

## 6. Dependencies

- **Core:** React, React DOM, TypeScript
- **UI:** React Bootstrap, React Icons
- **Routing:** React Router
- **HTTP:** Axios
- **Authentication:** @supabase/supabase-js
- **Chat:** @botpress/webchat

---

## 7. Development Setup

### Prerequisites
- Node.js (latest LTS recommended)

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

---

## 8. Areas for Potential Improvement

- **Testing:** No automated tests or test libraries currently included
- **Documentation:** Limited inline code documentation
- **Error Handling:** Review and improve error boundaries and user feedback
- **Performance:** Consider code splitting and lazy loading for optimization

---

## 9. Security Considerations

- JWT-based authentication
- Protected and role-based routes
- Sensitive configuration via environment variables

---

## 10. Deployment

The app is Vite-configured and can be deployed to platforms like Vercel, Netlify, or any static web server.

---

## License

[MIT](LICENSE) (or specify your license here)

---

**AgroSaarthi** – Empowering agriculture with technology. 
