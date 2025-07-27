# Nord Health Signup Application

A modern, accessible Vue 3 + Nuxt 4 application built with Nord Design System, featuring user authentication, theme management, and comprehensive form validation.

## 🚀 Features

### 🔐 Authentication System

- **Secure User Registration** - Complete signup flow with form validation
- **User Sign-in** - Login with email/password authentication
- **Session Management** - Automatic token refresh and session persistence
- **Protected Routes** - Middleware-based route protection
- **User Profile Management** - Update user information after registration
- **Mock Authentication Service** - Simulated backend with realistic delays and error handling
- **Spam Control** - Built-in protection against rapid form submissions

### 🎨 Theme & Design

- **Nord Design System Integration** - Professional healthcare UI components
- **Multi-Theme Support** - Light, Dark, and High Contrast themes
- **Real-time Theme Switching** - Instant theme changes with persistent preferences
- **Responsive Design** - Mobile-first approach with adaptive layouts
- **Accessibility First** - ARIA labels, screen reader support, keyboard navigation

### 🛡️ Security & Validation

- **Runtime Type Safety** - Zod schemas for form validation
- **Password Strength Indicator** - Visual password requirements with real-time feedback
- **Input Sanitization** - XSS prevention and secure form handling
- **Token-based Authentication** - JWT-style token management
- **Cookie Security** - HttpOnly cookies with proper security flags

### 🧪 Testing & Quality

- **Comprehensive Test Suite** - Unit tests for components and services
- **Test-Driven Development** - Components tested for functionality and edge cases
- **ESLint Configuration** - Vue.js team standards with strict TypeScript rules
- **Type Safety** - Full TypeScript integration with strict mode
- **Error Boundary** - Custom 404 and error pages with proper fallbacks

### 📱 User Experience

- **Progressive Enhancement** - Works without JavaScript for core functionality
- **Loading States** - Skeleton screens and loading indicators
- **Toast Notifications** - User feedback for actions and errors
- **Form Validation** - Real-time validation with clear error messages
- **Smooth Transitions** - Page transitions and micro-interactions

### 🏗️ Architecture

- **Domain-Driven Design** - Feature-based directory structure
- **Composition API** - Modern Vue 3 patterns throughout
- **Pinia State Management** - Reactive state with proper separation of concerns
- **Composable Logic** - Reusable business logic separated from UI
- **Absolute Imports** - Clean import statements with path aliases

## 📋 Prerequisites

- **Node.js** - Version 18+ (LTS recommended)
- **npm** - Version 9+ (comes with Node.js)
- **Git** - For version control

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nordhealth_signup_task
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or next available port).

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## 🧪 Testing

### Run Unit Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

## 🔧 Development Scripts

```bash
# Development server with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Testing
npm test
npm run test:run
npm run test:ui

# Building
npm run build
npm run generate
npm run preview
```

## 📁 Project Structure

```
app/
├── assets/              # Global styles and assets
├── entities/            # Domain entities
│   ├── auth/           # Authentication domain
│   │   ├── stores/     # Pinia stores
│   │   ├── services/   # Business logic
│   │   ├── types/      # TypeScript definitions
│   │   └── constants/  # Domain constants
│   └── theme/          # Theme management domain
├── features/           # Feature-specific components
│   └── signup/         # Signup feature
├── shared/             # Shared utilities
│   ├── composables/    # Reusable logic
│   ├── constants/      # Global constants
│   ├── types/          # Shared types
│   └── utils/          # Utility functions
├── layouts/            # Nuxt layouts
├── pages/              # Nuxt pages (routes)
├── middleware/         # Route middleware
└── plugins/            # Nuxt plugins
```

## 🎯 Key Technologies

- **Vue 3** - Progressive JavaScript framework
- **Nuxt 4** - Full-stack Vue framework
- **TypeScript** - Type-safe JavaScript
- **Pinia** - Vue state management
- **Nord Design System** - Healthcare-focused UI components
- **Zod** - Runtime type validation
- **VeeValidate** - Form validation
- **Vitest** - Modern testing framework
- **ESLint** - Code quality and consistency

## 🌐 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 📖 Usage Examples

### User Registration Flow

1. Navigate to `/sign-up`
2. Fill in email, password, and optional profile information
3. Password strength indicator provides real-time feedback
4. Form validation prevents submission of invalid data
5. Success page displays upon completion

### Theme Switching

1. Use theme toggle in the top-right corner
2. Choose between Light, Dark, and High Contrast modes
3. Preference is automatically saved and persists across sessions

### Authentication

- **Public routes**: `/`, `/sign-up`, `/sign-in`
- **Protected routes**: `/edit-profile`, `/success`
- Automatic redirection based on authentication status

## 🚀 Deployment

### Static Generation

```bash
npm run generate
```

### Server-Side Rendering

```bash
npm run build
npm run preview
```

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Development
NUXT_PUBLIC_API_BASE=http://localhost:3000

# Production
NUXT_PUBLIC_API_BASE=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Nord Health** - For the excellent design system and components
- **Vue.js Team** - For the amazing framework and ecosystem
- **Nuxt Team** - For the powerful full-stack framework

---

Built with ❤️ using Vue 3, Nuxt 4, and Nord Design System
