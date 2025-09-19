export const env = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uwjhrtiomkyjtefrwjhm.supabase.co',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3amhydGlvbWt5anRlZnJ3amhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTg1MzEsImV4cCI6MjA3Mzg5NDUzMX0.RBTnjAemyx14I2A5CX9YN-r4vWp6kYNgMaIGKgiTnTU',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION,
} as const
