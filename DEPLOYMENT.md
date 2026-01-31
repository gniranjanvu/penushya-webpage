# DEPLOYMENT GUIDE

## Prerequisites

Before deploying, ensure you have:
1. A Supabase account (free tier available)
2. A hosting account (Vercel, Netlify, etc.)

## Step-by-Step Deployment

### 1. Set Up Supabase

1. **Create a Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Name: "Penushya Portfolio"
   - Choose a strong database password

2. **Execute Database Schema**
   - Go to SQL Editor in Supabase dashboard
   - Copy the entire contents of `database-schema.sql`
   - Paste and click "Run"
   - This creates all 14 tables with default data

3. **Create Admin User**
   - Go to Authentication → Users
   - Click "Add User"
   - Email: `prudhvirajchalapaka@gmail.com`
   - Password: `HareKrishna@07`
   - Click "Create User"

4. **Get API Credentials**
   - Go to Settings → API
   - Copy:
     - `URL` (looks like: https://xxxxx.supabase.co)
     - `anon/public` key

### 2. Deploy to Vercel (Recommended)

> **Note:** This project includes a `vercel.json` configuration file that handles SPA routing. This ensures that all routes (like `/admin/login`) are properly redirected to `index.html` so React Router can handle them, preventing 404 errors on direct URL access or page refresh.

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd penushya-webpage
   vercel
   ```

3. **Add Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

4. **Redeploy**
   ```bash
   vercel --prod
   ```

### 3. Alternative: Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the Project**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Add Environment Variables**
   - Go to Netlify Dashboard → Site Settings → Build & Deploy → Environment
   - Add the same environment variables as above

### 4. Configure EmailJS (Optional)

1. **Create EmailJS Account**
   - Go to https://www.emailjs.com
   - Create a free account

2. **Set Up Email Service**
   - Add an email service (Gmail, Outlook, etc.)
   - Note the Service ID

3. **Create Email Template**
   - Create a new template
   - Use these variables:
     - {{from_name}}
     - {{from_email}}
     - {{message}}
   - Note the Template ID

4. **Get Public Key**
   - Go to Account → API Keys
   - Copy your Public Key

5. **Add to Environment Variables**
   ```
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

### 5. Custom Domain (Optional)

**For Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

**For Netlify:**
1. Go to Domain Settings
2. Add custom domain
3. Configure DNS records

### 6. Post-Deployment Checklist

- [ ] Test admin login: `your-domain.com/admin/login`
- [ ] Verify all sections load correctly
- [ ] Test contact form submission
- [ ] Check responsive design on mobile
- [ ] Test dark/light mode toggle
- [ ] Verify navigation links work
- [ ] Test project detail pages

### 7. Adding Content

1. **Login to Admin Dashboard**
   - Navigate to: `your-domain.com/admin/login`
   - Use credentials created in Supabase

2. **Add Content via Supabase**
   - For now, add content directly in Supabase dashboard
   - Go to Table Editor
   - Add entries to: experiences, projects, skills, certifications, etc.

3. **Upload Resume**
   - Go to Storage in Supabase
   - Create a bucket named "resumes"
   - Upload your resume PDF
   - Copy the public URL
   - Add to `resume` table

### 8. Monitoring & Maintenance

**Vercel:**
- Check Analytics in Vercel dashboard
- Monitor build logs
- Set up custom error pages

**Supabase:**
- Monitor database usage
- Check API logs
- Review authentication logs

### 9. Troubleshooting

**Issue: Blank page on load**
- Solution: Check environment variables are set correctly
- Verify Supabase URL and anon key

**Issue: Admin login fails**
- Solution: Verify user exists in Supabase Authentication
- Check RLS policies are enabled

**Issue: Contact form doesn't send**
- Solution: Verify EmailJS credentials
- Check browser console for errors

**Issue: Images don't load**
- Solution: Check Storage bucket permissions in Supabase
- Ensure URLs are correct

### 10. Performance Optimization

Already implemented:
- ✅ Code splitting with React Router
- ✅ Lazy loading components
- ✅ Optimized images with Vite
- ✅ Minified CSS and JS
- ✅ Tree-shaking unused code

Additional optimizations:
- Add a CDN (Vercel/Netlify include this)
- Enable caching headers
- Add service worker for offline support
- Implement image lazy loading for project galleries

---

## Support

For issues or questions:
1. Check the main README.md
2. Review Supabase documentation
3. Check browser console for errors
4. Contact: varripenushya9573@gmail.com

---

## Security Notes

1. **Never commit .env files** to Git
2. **Keep Supabase anon key public** (it's safe, RLS protects data)
3. **Change admin password** after first login
4. **Review RLS policies** in Supabase
5. **Enable 2FA** on Supabase account
6. **Regular backups** of database (Supabase handles this)

---

## Success! 🎉

Your portfolio website is now live and ready to impress!

Remember to:
- Add your actual projects and experiences
- Upload a professional resume
- Customize colors in tailwind.config.js if needed
- Share your portfolio URL on LinkedIn and GitHub
