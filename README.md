src/
├── app/ # Global providers, app-wide styles, main router
├── features/ # Domain-driven modules
│ ├── auth/ # Login, Register, useAuth hook, authService
│ ├── dashboard/ # Specific components, state, and logic
│ └── settings/
├── services/ # Platform-independent wrappers for Capacitor/APIs
│ ├── native/ # Capacitor plugin abstractions (Camera, Storage)
│ └── api/ # Axios/Fetch instances
├── shared/ # Global reusable pieces
│ ├── components/ # UI Kit (Buttons, Inputs)
│ ├── hooks/ # useLocalStorage, useDebounce
│ └── types/ # Global TypeScript interfaces
├── theme/ # Mobile-specific styling (Safe Areas, variables)
└── main.tsx # Entry point
