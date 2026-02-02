# Penushya Varri - Portfolio Website

> **Enterprise-Grade Personal Portfolio** - A modern, responsive portfolio website built with React, TypeScript, Tailwind CSS, and Supabase.

![React](https://img.shields.io/badge/React-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-blue.svg)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)

---

## 🌟 Features

### Public Portfolio Website
- **Animated Loading Screen** - Smooth particle effects with fade-out transition
- **Hero Section** - Dynamic gradient background with typewriter effect
- **Experiences Timeline** - Alternating card layout with certifications
- **Education Section** - Vertical timeline with academic credentials
- **Projects Showcase** - Featured projects with detailed individual pages
- **Skills Display** - Categorized skills with proficiency indicators
- **Certifications Grid** - Professional certifications with validation dates
- **Achievements & Publications** - Academic and professional highlights
- **Contact Form** - Integrated with email notifications
- **Newsletter Signup** - Build your subscriber base
- **Dark/Light Mode** - Seamless theme switching with localStorage persistence
- **Fully Responsive** - Perfect on mobile, tablet, and desktop

### Admin Dashboard
- **Secure Authentication** - Supabase-powered login system
- **Dashboard Overview** - Statistics and recent activity
- **Content Management** - CRUD operations for all sections
- **Message Manager** - View and manage contact form submissions
- **Subscriber Management** - Export subscribers to CSV
- **Resume Upload** - Manage downloadable resume
- **Settings Panel** - Site configuration and password management

---

## 🛠️ Technology Stack

### Frontend
- **React 18+** with **TypeScript** for type safety
- **Vite** for blazing-fast development
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **React Router DOM** for navigation
- **React Hook Form** for form handling
- **React Toastify** for notifications
- **React Markdown** for rich text rendering
- **Lucide React** for beautiful icons

### Backend & Database
- **Supabase** - PostgreSQL database, authentication, storage, and real-time subscriptions

### Additional Integrations
- **EmailJS/Resend** - Email notifications from contact form

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and **npm** or **yarn**
- **Supabase Account** (free tier available at [supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gniranjanvu/penushya-webpage.git
   cd penushya-webpage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Set up Supabase database and storage**
   
   **📚 For complete setup instructions, see [SETUP.md](SETUP.md)**
   
   Quick overview:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy the contents of `database-schema.sql`
   - Paste and execute the SQL script
   - Create storage buckets (`resumes` and `images`) in Storage section
   - Set up storage policies (see SETUP.md for details)

5. **Create admin user in Supabase**
   - Go to Authentication → Users in Supabase dashboard
   - Add a new user with:
     - Email: `prudhvirajchalapaka@gmail.com`
     - Password: `HareKrishna@07`
   - Or use your own credentials

6. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Database Schema

The application uses 14 Supabase tables:

1. **experiences** - Work experience entries
2. **education** - Academic qualifications
3. **projects** - Project portfolio
4. **project_images** - Project image gallery
5. **project_videos** - Project videos
6. **project_buttons** - Project action buttons
7. **skills** - Technical skills
8. **certifications** - Professional certifications
9. **achievements** - Achievements and awards
10. **publications** - Research papers and publications
11. **messages** - Contact form submissions
12. **subscribers** - Newsletter subscribers
13. **resume** - Resume files
14. **site_settings** - Site configuration

All tables include Row-Level Security (RLS) policies for secure data access.

---

## 📝 Default Data

The database comes pre-populated with:

### Education
- B.Tech in Robotics & Automation – Vignan University (2022-Present) – CGPA: 9.23
- Diploma in Automation & Robotics – CITD Hyderabad (2019-2021) – CGPA: 9.34
- 10th Standard – Sri Chaitanya School (2018-2019) – GPA: 10/10

### Contact Information
- Name: Penushya Varri
- Email: varripenushya9573@gmail.com
- LinkedIn: [linkedin.com/in/penushya](https://www.linkedin.com/in/penushya/)
- GitHub: [github.com/Penushya](https://github.com/Penushya)

---

## 🔐 Admin Access

- **Login URL**: `http://localhost:5173/admin/login`
- **Default Username**: `harekrishna` (or use email: `prudhvirajchalapaka@gmail.com`)
- **Default Password**: `HareKrishna@07`

### Admin Features
- Dashboard with statistics
- Manage all content sections (Coming Soon)
- View and respond to messages
- Export subscriber list to CSV
- Change password and site settings

---

## 🎨 Design Features

- **Glassmorphism Effects** - Modern frosted glass UI elements
- **Gradient Backgrounds** - Dynamic animated gradients
- **Micro-interactions** - Smooth hover and transition effects
- **Scroll Animations** - Elements fade in as you scroll
- **Dark Mode** - Automatic theme detection with manual toggle
- **Responsive Grid** - Adaptive layouts for all screen sizes

---

## 🔒 Security Features

- ✅ Row-Level Security (RLS) in Supabase
- ✅ Protected admin routes
- ✅ Secure authentication with session management
- ✅ Input validation and sanitization
- ✅ XSS protection via React
- ✅ Environment variables for sensitive data

---

## 📦 Build & Deployment

### Build for Production
```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy

**Recommended platforms:**
- **Vercel** (recommended for React apps)
- **Netlify**
- **GitHub Pages**
- **Cloudflare Pages**

#### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

#### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

Make sure to add your environment variables in the hosting platform's settings.

---

## 🧪 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👤 Author

**Penushya Varri**
- Email: varripenushya9573@gmail.com
- LinkedIn: [@penushya](https://www.linkedin.com/in/penushya/)
- GitHub: [@Penushya](https://github.com/Penushya)

---

## �� Acknowledgments

- React Team for the amazing framework
- Supabase for the backend infrastructure
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for animation capabilities
- Lucide for the beautiful icon set

---

Made with ❤️ and passion for Robotics & Automation
