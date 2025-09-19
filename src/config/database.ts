export const DATABASE_CONFIG = {
  TABLES: {
    USERS: 'users',
    RECIPES: 'recipes',
    INGREDIENTS: 'ingredients',
    INSTRUCTIONS: 'instructions',
    REVIEWS: 'reviews',
    LIKES: 'recipe_likes',
    SAVES: 'recipe_saves',
    FOLLOWS: 'user_follows',
  },
  RLS_POLICIES: {
    USERS: {
      SELECT: 'users_select_policy',
      INSERT: 'users_insert_policy',
      UPDATE: 'users_update_policy',
      DELETE: 'users_delete_policy',
    },
    RECIPES: {
      SELECT: 'recipes_select_policy',
      INSERT: 'recipes_insert_policy',
      UPDATE: 'recipes_update_policy',
      DELETE: 'recipes_delete_policy',
    },
    INGREDIENTS: {
      SELECT: 'ingredients_select_policy',
      INSERT: 'ingredients_insert_policy',
      UPDATE: 'ingredients_update_policy',
      DELETE: 'ingredients_delete_policy',
    },
    INSTRUCTIONS: {
      SELECT: 'instructions_select_policy',
      INSERT: 'instructions_insert_policy',
      UPDATE: 'instructions_update_policy',
      DELETE: 'instructions_delete_policy',
    },
    REVIEWS: {
      SELECT: 'reviews_select_policy',
      INSERT: 'reviews_insert_policy',
      UPDATE: 'reviews_update_policy',
      DELETE: 'reviews_delete_policy',
    },
  },
} as const
