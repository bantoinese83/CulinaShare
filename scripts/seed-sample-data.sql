-- Sample data for CulinaShare statistics
-- This script adds realistic sample data to demonstrate the statistics

-- Add sample users (we'll create 50+ users)
INSERT INTO users (id, email, username, first_name, last_name, is_verified, is_active, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'user' || generate_series || '@example.com',
  'chef_' || generate_series,
  'Chef',
  'User ' || generate_series,
  true,
  true,
  NOW() - (random() * interval '365 days'),
  NOW() - (random() * interval '30 days')
FROM generate_series(1, 50);

-- Add sample recipes with various cuisines (we'll create 100+ recipes)
INSERT INTO recipes (id, user_id, title, description, prep_time, cook_time, total_time, servings, cuisine, difficulty, dietary_tags, image_url, is_published, is_featured, view_count, like_count, average_rating, total_ratings, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM users ORDER BY random() LIMIT 1),
  'Delicious ' || cuisine_name || ' Recipe ' || generate_series,
  'A wonderful ' || cuisine_name || ' dish that will delight your taste buds. This recipe combines traditional techniques with modern flavors.',
  (random() * 30 + 10)::integer,
  (random() * 60 + 15)::integer,
  (random() * 90 + 25)::integer,
  (random() * 8 + 2)::integer,
  cuisine_name,
  CASE 
    WHEN random() < 0.3 THEN 'easy'
    WHEN random() < 0.7 THEN 'medium'
    ELSE 'hard'
  END,
  CASE 
    WHEN random() < 0.2 THEN ARRAY['vegetarian']
    WHEN random() < 0.3 THEN ARRAY['vegan']
    WHEN random() < 0.4 THEN ARRAY['gluten-free']
    WHEN random() < 0.5 THEN ARRAY['dairy-free']
    ELSE ARRAY[]::text[]
  END,
  '/images/placeholder-recipe.jpg',
  true,
  random() < 0.1, -- 10% chance of being featured
  (random() * 1000)::integer,
  (random() * 100)::integer,
  (random() * 2 + 3)::numeric(3,1), -- Rating between 3.0 and 5.0
  (random() * 50)::integer,
  NOW() - (random() * interval '300 days'),
  NOW() - (random() * interval '30 days')
FROM (
  SELECT unnest(ARRAY[
    'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'French', 'Thai', 'Mediterranean',
    'American', 'Korean', 'Vietnamese', 'Greek', 'Spanish', 'Lebanese', 'Turkish', 'Moroccan',
    'Brazilian', 'Peruvian', 'Ethiopian', 'German', 'British', 'Russian', 'Polish', 'Hungarian',
    'Cajun', 'Southern', 'Tex-Mex', 'Fusion', 'Middle Eastern', 'Caribbean', 'African',
    'Scandinavian', 'Austrian', 'Swiss', 'Belgian', 'Dutch', 'Portuguese', 'Argentinian',
    'Chilean', 'Colombian', 'Cuban', 'Dominican', 'Ecuadorian', 'Guatemalan', 'Honduran',
    'Jamaican', 'Nicaraguan', 'Panamanian', 'Paraguayan', 'Salvadoran', 'Uruguayan',
    'Venezuelan', 'Canadian', 'Australian', 'New Zealand', 'South African', 'Egyptian',
    'Nigerian', 'Kenyan', 'Ghanaian', 'Senegalese', 'Tunisian', 'Algerian', 'Libyan'
  ]) as cuisine_name
) cuisines
CROSS JOIN generate_series(1, 2); -- 2 recipes per cuisine = 100+ recipes

-- Add some sample reviews to make the statistics more realistic
INSERT INTO reviews (id, user_id, recipe_id, rating, comment, is_verified, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM users ORDER BY random() LIMIT 1),
  (SELECT id FROM recipes WHERE is_published = true ORDER BY random() LIMIT 1),
  (random() * 4 + 1)::integer, -- Rating between 1 and 5
  CASE 
    WHEN random() < 0.3 THEN 'Amazing recipe! Highly recommend.'
    WHEN random() < 0.6 THEN 'Great taste and easy to follow.'
    WHEN random() < 0.8 THEN 'Good recipe, will make again.'
    ELSE 'Delicious! Perfect for dinner.'
  END,
  random() < 0.8, -- 80% chance of being verified
  NOW() - (random() * interval '200 days'),
  NOW() - (random() * interval '20 days')
FROM generate_series(1, 200); -- Add 200 reviews

-- Update recipe statistics based on reviews
UPDATE recipes 
SET 
  average_rating = subquery.avg_rating,
  total_ratings = subquery.rating_count
FROM (
  SELECT 
    recipe_id,
    AVG(rating)::numeric(3,1) as avg_rating,
    COUNT(*) as rating_count
  FROM reviews 
  GROUP BY recipe_id
) subquery
WHERE recipes.id = subquery.recipe_id;

-- Add some sample ingredients for the recipes
INSERT INTO ingredients (id, recipe_id, name, quantity, unit, notes, order_index, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  r.id,
  ingredient_name,
  (random() * 4 + 1)::numeric(5,2),
  unit_name,
  CASE WHEN random() < 0.2 THEN 'Optional ingredient' ELSE NULL END,
  generate_series,
  NOW(),
  NOW()
FROM recipes r
CROSS JOIN (
  SELECT unnest(ARRAY[
    'Salt', 'Pepper', 'Olive Oil', 'Garlic', 'Onion', 'Tomatoes', 'Basil', 'Oregano',
    'Parmesan Cheese', 'Mozzarella', 'Chicken Breast', 'Ground Beef', 'Rice', 'Pasta',
    'Bell Peppers', 'Mushrooms', 'Spinach', 'Carrots', 'Celery', 'Potatoes', 'Lemon',
    'Lime', 'Ginger', 'Cilantro', 'Parsley', 'Thyme', 'Rosemary', 'Bay Leaves',
    'Cumin', 'Paprika', 'Chili Powder', 'Cinnamon', 'Nutmeg', 'Vanilla', 'Sugar',
    'Flour', 'Butter', 'Eggs', 'Milk', 'Cream', 'Wine', 'Vinegar', 'Soy Sauce',
    'Worcestershire Sauce', 'Hot Sauce', 'Honey', 'Maple Syrup', 'Brown Sugar',
    'Bread Crumbs', 'Almonds', 'Walnuts', 'Pecans', 'Coconut', 'Raisins', 'Dates'
  ]) as ingredient_name
) ingredients
CROSS JOIN (
  SELECT unnest(ARRAY[
    'tsp', 'tbsp', 'cup', 'oz', 'lb', 'g', 'kg', 'ml', 'l', 'pinch', 'dash', 'clove', 'piece'
  ]) as unit_name
) units
CROSS JOIN generate_series(1, (random() * 8 + 3)::integer) -- 3-10 ingredients per recipe
WHERE r.is_published = true;

-- Add some sample instructions for the recipes
INSERT INTO instructions (id, recipe_id, step_number, description, image_url, time_estimate, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  r.id,
  generate_series,
  'Step ' || generate_series || ': ' || CASE 
    WHEN random() < 0.2 THEN 'Heat oil in a large pan over medium heat.'
    WHEN random() < 0.4 THEN 'Add the main ingredients and cook until tender.'
    WHEN random() < 0.6 THEN 'Season with salt and pepper to taste.'
    WHEN random() < 0.8 THEN 'Simmer for 15-20 minutes until flavors combine.'
    ELSE 'Serve hot and enjoy!'
  END,
  CASE WHEN random() < 0.3 THEN '/images/placeholder-recipe.jpg' ELSE NULL END,
  (random() * 10 + 5)::integer, -- 5-15 minutes per step
  NOW(),
  NOW()
FROM recipes r
CROSS JOIN generate_series(1, (random() * 6 + 4)::integer) -- 4-9 steps per recipe
WHERE r.is_published = true;
