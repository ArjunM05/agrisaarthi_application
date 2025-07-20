/// <reference types="vite/client" />

// CSS module declarations
declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: string;
  export default content;
}

declare module '*.sass' {
  const content: string;
  export default content;
}

// Image file declarations
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

// Environment variables
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_WEATHER_API_KEY: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
