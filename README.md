# Brustro 💧

**Brustro** is a premium e-commerce platform for West Bengal's first automated packaged drinking water plant. The application provides a seamless experience for customers to browse water products (from 250ml bottles to 20L jars), manage a cart for enquiries, and read the latest industry news via an integrated blog.

## 🚀 Key Features

- **Product Catalog**: Full range of packaged drinking water variants with detailed specifications.
- **Enquiry System**: User-friendly cart system for customers to place bulk order enquiries.
- **Admin Dashboard**: Comprehensive management interface for banners, products, testimonials, blog posts, and enquiries.
- **Dynamic Content**: Managed banners, testimonials, and blog articles.
- **SEO Optimized**: Built-in SEO head components and schema markup for better search visibility.
- **Responsive Design**: Modern, premium UI built with Tailwind CSS, supporting all device sizes.

## 🛠 Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) (Svelte 5)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: LibSQL / SQLite
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js (v18+)
- npm or yarn

## ⚙️ Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd brisley
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and fill in the required variables. You can use `.env.template` as a reference.

```bash
cp .env.template .env
```

Key environment variables:
- `ADMIN_PASSWORD`: For admin dashboard access.
- `DATABASE_URL`: Path to your SQLite file or Turso DB URL.
- `PUBLIC_APP_NAME`: The name used across the site (e.g., "Bizaree").

### 4. Database Setup
Initialize the database and run migrations:

```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

### 5. Run the development server
```bash
npm run dev
```
Navigate to `http://localhost:5173` to view the app.

## 📜 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the production build locally.
- `npm run db:generate`: Generates Drizzle migrations based on your schema.
- `npm run db:migrate`: Runs pending migrations against the database.
- `npm run db:seed`: Seeds the database with initial content.

## 🏗 Project Structure

- `src/routes/`: Contains all the application pages and API endpoints.
- `src/lib/`: Reusable components, database schema, utilities, and stores.
- `src/lib/db/`: Drizzle schema definitions and database client setup.
- `scripts/`: Utility scripts for migrations and seeding.
- `static/`: Static assets like images and icons.

---
Built with ❤️ for Bizaree.
