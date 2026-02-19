# 🚀 Complete Supabase Setup Guide for PyFluent

## 📚 What is Supabase?

Supabase is an open-source Firebase alternative that provides:
- **PostgreSQL Database** - A powerful relational database
- **Authentication** - User signup, login, password reset
- **Row Level Security (RLS)** - Database-level security
- **Auto-generated APIs** - REST and GraphQL APIs
- **Real-time subscriptions** - Live data updates

---

## 🎯 Step-by-Step Supabase Setup

### **Step 1: Create a Supabase Account**

1. **Go to Supabase Website**
   - Open your browser
   - Visit: https://supabase.com
   - Click the **"Start your project"** button

2. **Sign Up**
   - Click **"Sign Up"** in the top right
   - You can sign up with:
     - GitHub account (recommended - fastest)
     - Email and password
   - Follow the verification steps

3. **Verify Your Email**
   - Check your email inbox
   - Click the verification link
   - You'll be redirected to the Supabase dashboard

---

### **Step 2: Create a New Project**

1. **Click "New Project"**
   - You'll see a green button that says **"New project"**
   - Click it

2. **Fill in Project Details**
   
   **Organization:**
   - If this is your first time, create a new organization
   - Name it something like "PyFluent" or "My Projects"
   
   **Project Name:**
   - Enter: `pyfluent` (or any name you like)
   
   **Database Password:**
   - Create a **STRONG** password
   - ⚠️ **IMPORTANT**: Save this password somewhere safe!
   - You'll need it if you want to connect directly to the database
   - Example: `MySecurePassword123!@#`
   
   **Region:**
   - Choose the region closest to you or your users
   - Examples:
     - `Southeast Asia (Singapore)` - for Asia
     - `US East (N. Virginia)` - for USA East Coast
     - `Europe (Frankfurt)` - for Europe
   
   **Pricing Plan:**
   - Select **"Free"** (perfect for development and small projects)
   - Free tier includes:
     - 500MB database space
     - 50,000 monthly active users
     - 2GB file storage
     - Unlimited API requests

3. **Click "Create new project"**
   - Wait 2-3 minutes while Supabase sets up your database
   - You'll see a progress indicator
   - ☕ Grab a coffee while it sets up!

---

### **Step 3: Get Your API Keys**

Once your project is ready:

1. **Go to Project Settings**
   - On the left sidebar, click the **⚙️ Settings** icon (at the bottom)
   - Click **"API"** in the settings menu

2. **Find Your Credentials**
   
   You'll see two important sections:
   
   **A) Project URL**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   - This is your `NEXT_PUBLIC_SUPABASE_URL`
   - Copy this entire URL
   
   **B) Project API Keys**
   
   You'll see two keys:
   
   - **`anon` `public`** key (this is what you need!)
     ```
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
     ```
     - This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - It's safe to use in your frontend code
     - Copy this entire key (it's very long!)
   
   - **`service_role` `secret`** key
     - ⚠️ **DO NOT USE THIS** in your frontend
     - This bypasses Row Level Security
     - Only use this for admin scripts on the server

3. **Save These Credentials**
   - Keep them handy - you'll need them in Step 5

---

### **Step 4: Set Up the Database**

Now we need to create all the tables for PyFluent.

1. **Open SQL Editor**
   - On the left sidebar, click **🗄️ SQL Editor**
   - Click **"New query"** button

2. **Run the Schema File**
   
   **Method 1: Copy and Paste**
   - Open the file: `d:/projects/pyfluent/database/schema.sql`
   - Copy ALL the content (Ctrl+A, then Ctrl+C)
   - Paste it into the Supabase SQL Editor
   - Click **"Run"** button (or press Ctrl+Enter)
   - Wait for it to complete (you'll see "Success" message)
   
   **What this does:**
   - Creates 14 tables (users, missions, lessons, etc.)
   - Sets up relationships between tables
   - Creates indexes for performance
   - Adds triggers for automatic updates

3. **Run the RLS Policies File**
   
   - Click **"New query"** again
   - Open the file: `d:/projects/pyfluent/database/rls-policies.sql`
   - Copy ALL the content
   - Paste it into the SQL Editor
   - Click **"Run"**
   - Wait for "Success" message
   
   **What this does:**
   - Enables Row Level Security on all tables
   - Sets up policies so users can only see their own data
   - Allows everyone to read public content (missions, lessons)
   - Restricts admin operations

4. **Run the Seed Data File**
   
   - Click **"New query"** again
   - Open the file: `d:/projects/pyfluent/database/seed.sql`
   - Copy ALL the content
   - Paste it into the SQL Editor
   - Click **"Run"**
   - Wait for "Success" message
   
   **What this does:**
   - Adds the first 3 missions
   - Adds lessons, vocabulary, coding tasks, quizzes
   - Gives you content to test with immediately

5. **Verify the Tables Were Created**
   
   - On the left sidebar, click **📊 Table Editor**
   - You should see all these tables:
     - users
     - missions
     - lessons
     - vocab_words
     - coding_tasks
     - quizzes
     - quiz_questions
     - english_writing_tasks
     - user_mission_progress
     - user_vocab_progress
     - streaks
     - english_writing_submissions
     - coding_task_submissions
     - quiz_submissions
   
   - Click on **"missions"** table
   - You should see 3 rows (Day 1, Day 2, Day 3)
   - ✅ If you see this, your database is set up correctly!

---

### **Step 5: Configure Authentication**

1. **Go to Authentication Settings**
   - On the left sidebar, click **🔐 Authentication**
   - Click **"Providers"** tab

2. **Enable Email Authentication**
   - Find **"Email"** in the list
   - Make sure it's **enabled** (toggle should be ON)
   - This allows users to sign up with email and password

3. **Configure Email Settings** (Optional for now)
   
   For development, you can skip this. For production:
   - Click **"Email"** provider
   - Configure SMTP settings (for sending emails)
   - Or use Supabase's default email service

4. **Set Site URL and Redirect URLs**
   
   - Click **"URL Configuration"** in the Authentication menu
   
   **Site URL:**
   ```
   http://localhost:3000
   ```
   
   **Redirect URLs:**
   Add these URLs (one per line):
   ```
   http://localhost:3000/**
   http://localhost:3000/auth/callback
   ```
   
   - Click **"Save"**
   
   **What this does:**
   - Tells Supabase where to redirect users after login
   - Prevents unauthorized redirects

---

### **Step 6: Connect Your App to Supabase**

1. **Create Environment File**
   
   - In your project folder: `d:/projects/pyfluent`
   - Create a new file called `.env.local`
   - **DO NOT** use `.env.local.example` - create a NEW file

2. **Add Your Credentials**
   
   Open `.env.local` and paste this (replace with YOUR values):
   
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   
   # Admin Configuration (your email address)
   NEXT_PUBLIC_ADMIN_EMAILS=your-email@example.com
   ```
   
   **Replace:**
   - `https://xxxxxxxxxxxxx.supabase.co` with YOUR Project URL from Step 3
   - `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` with YOUR anon key from Step 3
   - `your-email@example.com` with YOUR actual email address
   
   **Example:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk1NjQ4MDAsImV4cCI6MjAwNTE0MDgwMH0.abcdefghijklmnopqrstuvwxyz1234567890
   NEXT_PUBLIC_ADMIN_EMAILS=john@example.com
   ```

3. **Save the File**
   - Press Ctrl+S to save
   - ⚠️ **IMPORTANT**: Never commit this file to Git!
   - It's already in `.gitignore` so it won't be uploaded

---

### **Step 7: Test the Connection**

1. **Restart Your Development Server**
   
   - Stop the current server (Ctrl+C in terminal)
   - Start it again:
   ```bash
   npm run dev
   ```

2. **Open Your App**
   
   - Go to: http://localhost:3000
   - You should see the landing page

3. **Test Signup**
   
   - Click **"Get Started"** or **"Sign Up"**
   - Fill in the form:
     - Full Name: Test User
     - Email: test@example.com
     - Password: password123
   - Click **"Sign Up"**
   
   **What should happen:**
   - You'll be redirected to the dashboard
   - You'll see your stats (0 streak, 0 XP, etc.)
   - You'll see "Day 1" mission available
   
   ✅ **If you see this, everything is working!**

4. **Verify in Supabase**
   
   - Go back to Supabase dashboard
   - Click **🔐 Authentication** → **Users**
   - You should see your test user listed
   - Click **📊 Table Editor** → **users**
   - You should see your user profile

---

## 🔍 Understanding Supabase Concepts

### **1. Authentication**

**How it works:**
- User signs up → Supabase creates entry in `auth.users` table
- User logs in → Supabase creates a session token (JWT)
- Token is stored in browser cookies
- Every API request includes this token
- Supabase verifies the token automatically

**In PyFluent:**
```typescript
// Signup
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Logout
await supabase.auth.signOut()
```

### **2. Database Queries**

**Reading Data:**
```typescript
// Get all missions
const { data, error } = await supabase
  .from('missions')
  .select('*')

// Get specific mission
const { data, error } = await supabase
  .from('missions')
  .select('*')
  .eq('day_number', 1)
  .single()

// Get with relationships
const { data, error } = await supabase
  .from('missions')
  .select(`
    *,
    lesson:lessons(*),
    vocab_words(*)
  `)
```

**Writing Data:**
```typescript
// Insert
const { data, error } = await supabase
  .from('user_mission_progress')
  .insert({
    user_id: userId,
    mission_id: missionId,
    lesson_completed: true
  })

// Update
const { data, error } = await supabase
  .from('users')
  .update({ total_xp: 100 })
  .eq('id', userId)

// Delete
const { data, error } = await supabase
  .from('streaks')
  .delete()
  .eq('user_id', userId)
```

### **3. Row Level Security (RLS)**

**What it does:**
- Protects your data at the database level
- Users can only see/edit their own data
- Even if someone hacks your frontend, they can't access other users' data

**Example Policy:**
```sql
-- Users can only view their own progress
CREATE POLICY "Users can view own progress"
  ON user_mission_progress FOR SELECT
  USING (auth.uid() = user_id);
```

**How it works:**
- `auth.uid()` returns the logged-in user's ID
- Policy checks if `user_id` matches the logged-in user
- If not, the query returns no data

---

## 🛠️ Common Supabase Tasks

### **View Your Data**

1. Go to **📊 Table Editor**
2. Click any table (e.g., "users")
3. You'll see all rows in a spreadsheet-like view
4. You can:
   - Click a row to edit it
   - Click "Insert row" to add data manually
   - Click "Delete" to remove rows

### **Run Custom Queries**

1. Go to **🗄️ SQL Editor**
2. Click "New query"
3. Write your SQL:
   ```sql
   SELECT * FROM missions WHERE week_number = 1;
   ```
4. Click "Run"
5. See results below

### **Check Authentication**

1. Go to **🔐 Authentication**
2. Click **"Users"** tab
3. See all registered users
4. You can:
   - Delete users
   - Reset passwords
   - View user metadata

### **Monitor API Usage**

1. Go to **📊 Reports**
2. See:
   - API requests per day
   - Database size
   - Active users
   - Bandwidth usage

---

## ⚠️ Important Security Notes

### **DO:**
✅ Use the `anon` key in your frontend
✅ Enable Row Level Security (RLS)
✅ Keep `.env.local` in `.gitignore`
✅ Use strong database passwords
✅ Test your RLS policies

### **DON'T:**
❌ Use the `service_role` key in frontend
❌ Commit `.env.local` to Git
❌ Share your API keys publicly
❌ Disable RLS in production
❌ Store sensitive data without encryption

---

## 🐛 Troubleshooting

### **Problem: "Invalid API key"**

**Solution:**
- Check your `.env.local` file
- Make sure you copied the FULL anon key (it's very long!)
- Restart your dev server after changing `.env.local`

### **Problem: "Failed to fetch"**

**Solution:**
- Check your internet connection
- Verify your Supabase project is not paused
- Check the Project URL is correct

### **Problem: "Row Level Security policy violation"**

**Solution:**
- Make sure you ran `rls-policies.sql`
- Check if you're logged in
- Verify the policy allows your operation

### **Problem: "User already registered"**

**Solution:**
- Go to Supabase → Authentication → Users
- Delete the test user
- Try signing up again

### **Problem: Tables not showing up**

**Solution:**
- Go to SQL Editor
- Run `schema.sql` again
- Check for error messages
- Make sure you ran the ENTIRE file

---

## 📚 Additional Resources

### **Official Documentation:**
- Supabase Docs: https://supabase.com/docs
- JavaScript Client: https://supabase.com/docs/reference/javascript
- Authentication: https://supabase.com/docs/guides/auth
- Database: https://supabase.com/docs/guides/database

### **Video Tutorials:**
- Supabase YouTube: https://www.youtube.com/@Supabase
- Next.js + Supabase: Search "Next.js Supabase tutorial"

### **Community:**
- Discord: https://discord.supabase.com
- GitHub: https://github.com/supabase/supabase
- Twitter: @supabase

---

## ✅ Final Checklist

Before you start using PyFluent, make sure:

- [ ] Supabase project created
- [ ] Database password saved
- [ ] `schema.sql` executed successfully
- [ ] `rls-policies.sql` executed successfully
- [ ] `seed.sql` executed successfully
- [ ] All 14 tables visible in Table Editor
- [ ] 3 missions visible in missions table
- [ ] Project URL copied
- [ ] Anon key copied
- [ ] `.env.local` file created
- [ ] All environment variables set
- [ ] Dev server restarted
- [ ] Test signup successful
- [ ] Test user visible in Supabase

---

## 🎉 You're Ready!

If you've completed all the steps above, your PyFluent app is now connected to Supabase and ready to use!

**Next Steps:**
1. Sign up for an account
2. Complete Day 1 mission
3. Explore the dashboard
4. Check your progress in Supabase

**Need Help?**
- Check the troubleshooting section above
- Review the Supabase documentation
- Check your browser console for errors

---

**Happy Learning! 🚀**
