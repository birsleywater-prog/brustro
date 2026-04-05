import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// ─── Categories ───────────────────────────────────────────────────────────────
export const categories = sqliteTable('categories', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    image: text('image'),
    createdAt: text('created_at').$defaultFn(() => new Date().toISOString())
});

// ─── Products ─────────────────────────────────────────────────────────────────
export const products = sqliteTable('products', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    details: text('details'),          // Rich text / HTML
    image: text('image'),            // Primary image path
    gallery: text('gallery'),          // JSON array of image paths
    price: real('price'),
    volume: text('volume'),           // e.g. "500ml", "20L"
    categoryId: integer('category_id').references(() => categories.id),
    isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),
    inStock: integer('in_stock', { mode: 'boolean' }).default(true),
    sortOrder: integer('sort_order').default(0),
    createdAt: text('created_at').$defaultFn(() => new Date().toISOString())
});

// ─── Banners ──────────────────────────────────────────────────────────────────
export const banners = sqliteTable('banners', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    ctaText: text('cta_text'),
    ctaLink: text('cta_link'),
    image: text('image'),
    backgroundImage: text('background_image'),
    isActive: integer('is_active', { mode: 'boolean' }).default(true),
    sortOrder: integer('sort_order').default(0)
});

// ─── Blog Posts ───────────────────────────────────────────────────────────────
export const blogPosts = sqliteTable('blog_posts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    excerpt: text('excerpt'),
    content: text('content'),
    image: text('image'),
    publishedAt: text('published_at').$defaultFn(() => new Date().toISOString()),
    createdAt: text('created_at').$defaultFn(() => new Date().toISOString())
});

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const testimonials = sqliteTable('testimonials', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    role: text('role'),
    company: text('company'),
    content: text('content').notNull(),
    rating: integer('rating').default(5),
    avatar: text('avatar'),
    isActive: integer('is_active', { mode: 'boolean' }).default(true)
});

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orders = sqliteTable('orders', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    customerName: text('customer_name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    address: text('address'),
    itemsJson: text('items_json').notNull(),  // JSON string of cart items
    total: real('total'),
    status: text('status').default('pending'),  // pending|confirmed|delivered
    notes: text('notes'),
    createdAt: text('created_at').$defaultFn(() => new Date().toISOString())
});

// ─── Contacts ─────────────────────────────────────────────────────────────────
export const contacts = sqliteTable('contacts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    message: text('message').notNull(),
    createdAt: text('created_at').$defaultFn(() => new Date().toISOString())
});

// ─── Site Settings ────────────────────────────────────────────────────────────
export const siteSettings = sqliteTable('site_settings', {
    key: text('key').primaryKey(),
    value: text('value').notNull()
});
