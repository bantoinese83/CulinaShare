export const APP_CONFIG = {
  NAME: 'CulinaShare',
  DESCRIPTION: 'Share, discover, and plan your culinary adventures',
  VERSION: '1.0.0',
  URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const

export const RECIPE_CONFIG = {
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_INGREDIENTS: 50,
  MAX_INSTRUCTIONS: 50,
  MAX_INSTRUCTION_LENGTH: 500,
  MAX_REVIEW_LENGTH: 1000,
  MIN_RATING: 1,
  MAX_RATING: 5,
  DIFFICULTY_LEVELS: ['easy', 'medium', 'hard', 'expert'] as const,
  DIETARY_TAGS: [
    'vegetarian',
    'vegan',
    'gluten-free',
    'dairy-free',
    'nut-free',
    'keto',
    'paleo',
    'low-carb',
    'high-protein',
    'low-sodium',
    'sugar-free',
    'halal',
    'kosher',
  ] as const,
  CUISINE_TYPES: [
    'American',
    'Italian',
    'Mexican',
    'Chinese',
    'Japanese',
    'Indian',
    'French',
    'Thai',
    'Mediterranean',
    'Korean',
    'Vietnamese',
    'Greek',
    'Spanish',
    'German',
    'British',
    'Other',
  ] as const,
} as const

export const STORAGE_CONFIG = {
  BUCKETS: {
    RECIPE_IMAGES: 'recipe-images',
    PROFILE_PICTURES: 'profile-pictures',
    INSTRUCTION_IMAGES: 'instruction-images',
  },
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
} as const

export const UI_CONFIG = {
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  SIDEBAR_WIDTH: 280,
  HEADER_HEIGHT: 64,
} as const
