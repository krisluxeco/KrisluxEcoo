# Krislux Eco 🌿

Welcome to the official repository for **Krislux Eco**, our modern, high-performance web platform built to champion sustainability, luxury, and ecological innovation.

## 🚀 Overview

Krislux Eco is a cutting-edge Next.js application that seamlessly blends luxury aesthetics with eco-conscious functionality. Our platform offers a dynamic user experience featuring immersive 3D elements, smooth animations, and secure authentication. It supports features like bulk ordering, personalized quote carts, and a comprehensive blog for our community.

## ✨ Key Features

- **Immersive User Interface:** Built with Tailwind CSS, Framer Motion, and GSAP for fluid, modern micro-animations and page transitions.
- **3D Experiences:** Powered by Three.js and React Three Fiber to showcase our products in stunning 3D.
- **Secure Authentication:** Integrated with NextAuth (Auth.js) for robust credential and OAuth (Google) sign-ins.
- **Business Workflows:** Built-in support for quote carts, bulk ordering, and partner portals.
- **Admin Dashboard:** Comprehensive dashboard for managing products, blog posts, and user inquiries.
- **Database Integration:** Powered by MongoDB via Mongoose for flexible and scalable data storage.
- **Cloud Media Management:** Integrated with Cloudinary for fast and optimized image delivery.

## 🛠️ Technology Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **3D Graphics:** [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Email Services:** [Nodemailer](https://nodemailer.com/)

## 💻 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

Ensure you have the following installed on your machine:
- Node.js (v18 or higher)
- npm or yarn or pnpm
- A MongoDB Database instance (e.g., MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/krisluxeco.git
   cd krisluxeco
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication
   AUTH_SECRET=your_auth_secret_key
   AUTH_URL=http://localhost:3000
   
   # Google OAuth (Optional)
   AUTH_GOOGLE_ID=your_google_client_id
   AUTH_GOOGLE_SECRET=your_google_client_secret

   # Cloudinary (If applicable)
   CLOUDINARY_URL=your_cloudinary_url
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 📁 Project Structure

```text
src/
├── app/            # Next.js App Router (Pages, Layouts, API routes)
│   ├── admin/      # Admin dashboard routes
│   ├── api/        # Backend API routes
│   ├── user/       # User portal routes (bulk orders, quotes)
│   └── ...
├── components/     # Reusable React components (UI, Admin, 3D)
├── lib/            # Utility functions and DB connection (db.js)
├── models/         # Mongoose database schemas
└── ...
```

## 🌍 Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new). 
*Note: Ensure you configure your environment variables in the Vercel dashboard and whitelist Vercel IP addresses (0.0.0.0/0) in your MongoDB Network Access settings before deploying.*



## 📄 License

This project is proprietary and confidential. Unauthorized copying of this file, via any medium is strictly prohibited.

---
*Krislux Eco - Merging Luxury with Sustainability.*
