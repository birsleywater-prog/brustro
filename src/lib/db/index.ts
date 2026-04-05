import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

// Ensure /db directory exists (local only)
if (!env.DATABASE_URL || env.DATABASE_URL.startsWith('file:')) {
  const dbDir = join(process.cwd(), 'db');
  mkdirSync(dbDir, { recursive: true });
}

const client = createClient({
  url: env.DATABASE_URL || 'file:db/database.sqlite',
  authToken: env.DATABASE_AUTH_TOKEN || ''
});

export const db = drizzle(client, { schema });

// Auto-create tables if they don't exist (simple init without migrations)
export async function initDb() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      image TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      details TEXT,
      image TEXT,
      gallery TEXT,
      price REAL,
      volume TEXT,
      category_id INTEGER REFERENCES categories(id),
      is_featured INTEGER DEFAULT 0,
      in_stock INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS banners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      cta_text TEXT,
      cta_link TEXT,
      image TEXT,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT,
      content TEXT,
      image TEXT,
      published_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT,
      company TEXT,
      content TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      avatar TEXT,
      is_active INTEGER DEFAULT 1
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      items_json TEXT NOT NULL,
      total REAL,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

// Seed default data
export async function seedDb() {
  const catCount = await client.execute('SELECT COUNT(*) as cnt FROM categories');
  if (Number(catCount.rows[0].cnt) > 0) return;

  await client.executeMultiple(`
    INSERT INTO categories (name, slug, description, image) VALUES
    ('Bottles', 'bottles', 'Individual serving bottles from 250ml to 2L', '/images/category-bottles.jpg'),
    ('Jars', 'jars', 'Large volume jars for homes and offices', '/images/category-jars.jpg');

    INSERT INTO products (name, slug, description, details, volume, price, category_id, is_featured, sort_order) VALUES
    ('250ml Bottle', '250ml-bottle', '${publicEnv.PUBLIC_APP_NAME}''s portable 250ml bottle offers crisp, refreshing hydration — ideal for on-the-go refreshment.', 'Fassai certified. Triple-stage purification. Tamper-proof seal.', '250ml', 10.00, 1, 1, 1),
    ('500ml Bottle', '500ml-bottle', 'The handy 500ml bottle from ${publicEnv.PUBLIC_APP_NAME} will help you quench your thirst. Ideal for hydration on the go.', 'Fassai certified. Triple-stage purification. Tamper-proof seal.', '500ml', 15.00, 1, 1, 2),
    ('1 Litre Bottle', '1-litre-bottle', '${publicEnv.PUBLIC_APP_NAME}''s 1-liter is the ideal hydration partner for all kinds of activities and travelling plans.', 'Fassai certified. Triple-stage purification. Tamper-proof seal.', '1L', 20.00, 1, 1, 3),
    ('2 Litre Bottle', '2-litre-bottle', 'Enjoy the lasting hydrating experience in our 2 Litre bottle, enough to keep you going.', 'Fassai certified. Triple-stage purification. Tamper-proof seal.', '2L', 35.00, 1, 1, 4),
    ('5 Litre Jar', '5-litre-jar', 'Stay hydrated with cool water for your requirements at home or at work.', 'Fassai certified. Food-grade PET jar. Refillable and reusable.', '5L', 50.00, 2, 1, 5),
    ('20 Litre Jar', '20-litre-jar', '${publicEnv.PUBLIC_APP_NAME}''s 20L bottle is ideal for large gatherings and sustained refreshment.', 'Fassai certified. Food-grade PC jar. Industrial-grade quality.', '20L', 90.00, 2, 1, 6);

    INSERT INTO banners (title, subtitle, cta_text, cta_link, is_active, sort_order) VALUES
    ('West Bengal''s First Automated Water Plant', 'Premium packaged drinking water with strict quality control and 12+ years of industry experience.', 'Enquire Now', '/contact', 1, 1),
    ('Pure. Safe. Refreshing.', 'From 250ml bottles to 20L jars — we cater to all types of orders with 24/7 working time.', 'View Products', '/products', 1, 2);

    INSERT INTO testimonials (name, role, company, content, rating, is_active) VALUES
    ('Rajesh Sharma', 'Operations Manager', 'HM Hotels Kolkata', '${publicEnv.PUBLIC_APP_NAME} has been our trusted water partner for 3 years. Consistent quality, on-time delivery, and professional service. Highly recommended.', 5, 1),
    ('Priya Banerjee', 'Event Coordinator', 'Celebration Events', 'We ordered 20L jars for our corporate event and ${publicEnv.PUBLIC_APP_NAME} delivered flawlessly. The water quality is excellent and pricing is very competitive.', 5, 1),
    ('Arjun Das', 'Factory Owner', 'Das Industries', 'As a bulk buyer, ${publicEnv.PUBLIC_APP_NAME} never disappoints. Their automated plant ensures consistency in every batch. Great product, great team.', 5, 1);

    INSERT INTO blog_posts (title, slug, excerpt, content, published_at) VALUES
    ('Facts & Figures: How Much Water Should You Actually Drink?', 'how-much-water-should-you-drink', 'Discover the science behind daily water intake recommendations and how to stay optimally hydrated.', '<p>Water is the essence of life. The commonly cited figure of 8 glasses (about 2 liters) per day is a reasonable goal for most adults, but it varies based on body weight, activity level, and climate...</p><p>According to the National Academies of Sciences, men need about 3.7 liters and women 2.7 liters of total water per day from all beverages and foods combined.</p>', '2024-06-08 00:00:00'),
    ('Hydration Hacks: Creative Ways to Stay Refreshed Throughout the Day', 'hydration-hacks-stay-refreshed', 'Practical tips and creative strategies to make drinking water a natural part of your daily routine.', '<p>Most people struggle to drink enough water throughout the day. Here are some proven hydration hacks to keep you refreshed...</p><p>Start your morning with a full glass before coffee. Keep a water bottle on your desk. Eat water-rich foods like cucumbers and watermelon.</p>', '2024-06-08 00:00:00'),
    ('Tips for Choosing the Right Bottled Water: What Consumers Need to Know', 'choosing-right-bottled-water', 'A comprehensive guide to understanding water quality standards, certifications, and what to look for.', '<p>Not all bottled water is created equal. When choosing packaged drinking water, look for Fassai certification which ensures the product meets Indian safety standards...</p><p>${publicEnv.PUBLIC_APP_NAME} water undergoes triple-stage purification and is Fassai certified, ensuring you get only the best quality hydration.</p>', '2024-06-08 00:00:00');

    INSERT OR IGNORE INTO site_settings (key, value) VALUES
    ('about_hero_title', 'West Bengal''s First Automated Water Plant'),
    ('about_hero_description', 'We are committed to providing the best packaged drinking water with industry experience of more than 12 years.'),
    ('about_story_title', 'Pure Water, Pure Commitment'),
    ('about_story_content_1', '${publicEnv.PUBLIC_APP_NAME} was founded with a singular mission — to bring the highest quality packaged drinking water to homes and businesses across West Bengal. As the state''s first fully automated water plant, we combine advanced technology with rigorous quality control.'),
    ('about_story_content_2', 'With over 12 years of industry experience, our team understands the importance of pure, safe drinking water. Every bottle that leaves our facility undergoes triple-stage purification and strict quality checks.'),
    ('about_image', '');
  `);
}
