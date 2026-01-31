# QUICK START GUIDE

## 🚀 Get Your Portfolio Running in 5 Minutes

### Step 1: Prerequisites (2 minutes)
```bash
# Check Node.js version (should be 18+)
node --version

# If not installed, download from: https://nodejs.org
```

### Step 2: Clone & Install (1 minute)
```bash
# Clone the repository
git clone https://github.com/gniranjanvu/penushya-webpage.git
cd penushya-webpage

# Install dependencies
npm install
```

### Step 3: Supabase Setup (5 minutes)

1. **Create Supabase Project** (2 min)
   - Visit: https://supabase.com
   - Sign up (free)
   - Create new project
   - Wait for project setup

2. **Execute Database Schema** (1 min)
   - In Supabase: SQL Editor
   - Copy/paste entire `database-schema.sql`
   - Click "Run"
   - ✅ Creates all tables

3. **Get API Keys** (1 min)
   - Settings → API
   - Copy URL and anon key

4. **Create Admin User** (1 min)
   - Authentication → Users → Add User
   - Email: `prudhvirajchalapaka@gmail.com`
   - Password: `HareKrishna@07`

### Step 4: Configure Environment (30 seconds)
```bash
# Copy template
cp .env.example .env

# Edit .env and add:
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
```

### Step 5: Run! (30 seconds)
```bash
# Start development server
npm run dev

# Open browser to: http://localhost:5173
```

---

## ✅ Verify It Works

1. **Homepage loads** with all sections
2. **Dark mode toggle** works (top right)
3. **Navigation** scrolls to sections
4. **Admin login** at `/admin/login`
   - Use credentials from Step 3.4
5. **Dashboard** shows statistics

---

## 🎨 Customize Your Portfolio

### Update Personal Info

Edit default data in Supabase Table Editor:

**Education Table** (already populated):
- Your degrees are already there!
- Just update if needed

**Site Settings Table**:
```sql
UPDATE site_settings SET setting_value = 'Your Name' WHERE setting_key = 'site_name';
UPDATE site_settings SET setting_value = 'Your LinkedIn URL' WHERE setting_key = 'linkedin_url';
```

### Add Projects

In Supabase Table Editor → `projects`:
1. Click "Insert" → "Insert row"
2. Fill in:
   - title: "Your Project Name"
   - short_description: "Brief description"
   - full_description: "Detailed description (supports markdown)"
   - is_featured: true (for homepage)
   - is_published: true
3. Save

### Add Skills

In `skills` table:
- skill_name: "React"
- category: "Frontend"
- proficiency_level: 5 (1-5)
- is_published: true

### Add Experiences

In `experiences` table:
- company_name: "Company"
- role: "Your Role"
- start_date: "2023-01-01"
- is_current: true
- is_published: true

---

## 📱 Test Responsive Design

Open DevTools (F12) and test:
- Mobile (375px)
- Tablet (768px)
- Desktop (1920px)

---

## 🚀 Deploy to Production

### Vercel (Easiest)
```bash
npm install -g vercel
vercel
```

Follow prompts, then add environment variables in Vercel dashboard.

### Netlify
```bash
npm run build
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Add environment variables in Netlify dashboard.

---

## 🆘 Common Issues

**Issue: Blank page**
- Check .env file has correct Supabase credentials
- Verify Supabase project is running

**Issue: Build fails**
- Run `npm install` again
- Check Node.js version is 18+

**Issue: Can't login to admin**
- Verify user exists in Supabase Authentication
- Check email and password

**Issue: Dark mode doesn't work**
- Clear browser localStorage
- Refresh page

---

## 🎉 You're Done!

Your portfolio is running! Now:

1. **Add Your Content**
   - Projects
   - Skills
   - Experiences
   - Certifications

2. **Upload Resume**
   - Supabase Storage → Create bucket "resumes"
   - Upload PDF
   - Add URL to `resume` table

3. **Test Everything**
   - All links work
   - Contact form submits
   - Images load
   - Responsive on mobile

4. **Deploy**
   - Push to Vercel/Netlify
   - Share your portfolio!

---

## 📚 Learn More

- See `README.md` for full documentation
- See `DEPLOYMENT.md` for deployment guide
- See `database-schema.sql` for database structure

---

## 💡 Pro Tips

1. **Regular Backups**: Supabase auto-backups daily
2. **Version Control**: Commit changes regularly
3. **Test Locally**: Always test before deploying
4. **Performance**: Check PageSpeed Insights
5. **SEO**: Update meta tags in `index.html`

---

Need help? Contact: varripenushya9573@gmail.com

Happy coding! 🚀
