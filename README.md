# Feedback Collection System

A modern, full-stack feedback collection application built with Next.js, featuring a beautiful UI and smooth animations.

## Features

- Interactive feedback submission form with star rating
- Real-time form validation
- Smooth animations using Framer Motion
- Admin dashboard for viewing feedback
- Responsive design with glassmorphism effects
- Protected admin routes
- Local JSON storage

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form, Zod
- **Icons**: Lucide React

## Project Structure

```
├── app/
│   ├── admin/           # Admin dashboard
│   ├── api/            # API routes
│   │   └── feedback/   # Feedback endpoints
│   ├── page.tsx        # Main feedback form
│   └── layout.tsx      # Root layout
├── components/         # UI components
├── lib/               # Utility functions
└── data/             # Local storage
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## API Routes

### POST /api/feedback
Submit new feedback
- Required fields: name, rating, comment

### GET /api/feedback
Retrieve all feedback (protected)
- Requires auth token in query params

## Security Notes

- Admin routes are protected with a basic auth token
- In production, implement proper authentication
- Store sensitive data in environment variables

## Accessibility

- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly structure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT