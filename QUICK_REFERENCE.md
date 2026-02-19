# PyFluent - Quick Reference

## 🚀 Getting Started (5 Minutes)

### 1. Install
```bash
npm install
```

### 2. Setup Supabase
- Create project at supabase.com
- Run SQL files in order:
  1. `database/schema.sql`
  2. `database/rls-policies.sql`
  3. `database/seed.sql`

### 3. Configure
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_ADMIN_EMAILS=your@email.com
```

### 4. Run
```bash
npm run dev
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `database/schema.sql` | Complete database structure |
| `database/rls-policies.sql` | Security policies |
| `database/seed.sql` | First 3 missions data |
| `lib/supabase.ts` | Database client |
| `lib/types.ts` | TypeScript types |
| `lib/utils.ts` | Helper functions |
| `lib/admin.ts` | Admin authorization |

---

## 🎯 User Journey

```
Landing Page → Signup → Dashboard → Roadmap → Mission → Complete → Repeat
```

### Mission Flow
1. **Lesson** - Read Markdown content
2. **Vocabulary** - Learn 5 developer words
3. **Coding** - Solve interactive tasks
4. **Quiz** - Answer 5 questions
5. **Writing** - Write in professional English

---

## 🗄️ Database Quick Reference

### Main Tables
- `users` - User profiles
- `missions` - 30-day curriculum
- `lessons` - Lesson content
- `vocab_words` - Vocabulary
- `coding_tasks` - Coding challenges
- `quizzes` + `quiz_questions` - Quizzes
- `user_mission_progress` - Progress tracking

### User Progress Fields
- `lesson_completed`
- `vocab_completed`
- `coding_task_completed`
- `quiz_completed`
- `writing_task_completed`
- `status`: locked | available | in-progress | completed

---

## 🎨 Styling Quick Reference

### Tailwind Classes
```tsx
// Buttons
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-success">Success</button>

// Cards
<div className="card">Content</div>
<div className="card card-hover">Hoverable</div>

// Badges
<span className="badge badge-primary">Badge</span>

// Inputs
<input className="input" />
```

### Custom Colors
- Primary: Blue (#0ea5e9)
- Success: Green (#22c55e)
- Warning: Yellow (#f59e0b)
- Danger: Red (#ef4444)

---

## 🔐 Admin Access

### Enable Admin
Add email to `.env.local`:
```env
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,another@example.com
```

### Admin Routes
- `/admin` - Dashboard
- `/admin/missions` - Manage missions
- `/admin/lessons` - Edit lessons
- `/admin/vocabulary` - Manage vocab
- `/admin/coding-tasks` - Create tasks
- `/admin/quizzes` - Build quizzes

---

## 📊 API Patterns

### Fetch User Progress
```typescript
const { data } = await supabase
  .from('user_mission_progress')
  .select('*, mission:missions(*)')
  .eq('user_id', userId)
```

### Update Progress
```typescript
await supabase
  .from('user_mission_progress')
  .update({ lesson_completed: true })
  .eq('user_id', userId)
  .eq('mission_id', missionId)
```

### Check Admin
```typescript
import { isAdmin } from '@/lib/admin'

if (!isAdmin(user.email)) {
  redirect('/dashboard')
}
```

---

## 🐛 Common Issues

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Supabase connection fails
- Check `.env.local` values
- Verify Supabase project is active
- Confirm RLS policies are applied

### Build errors
```bash
npm run build
```
Fix TypeScript errors shown

---

## 📝 Adding New Mission Content

### 1. Add Mission
```sql
INSERT INTO missions (day_number, title, description, week_number, xp_reward)
VALUES (4, 'Operators', 'Learn Python operators', 1, 100);
```

### 2. Add Lesson
```sql
INSERT INTO lessons (mission_id, content)
VALUES ('mission-uuid', '# Lesson Content...');
```

### 3. Add Vocabulary (5 words)
```sql
INSERT INTO vocab_words (mission_id, word, meaning, example_sentence, category)
VALUES ('mission-uuid', 'operator', 'Symbol for operations', 'Use + operator', 'programming');
```

### 4. Add Coding Tasks (3+)
```sql
INSERT INTO coding_tasks (mission_id, task_type, prompt, expected_answer, explanation)
VALUES ('mission-uuid', 'fill-blank', 'Complete: x ___ 5', 'x = 5', 'Use = for assignment');
```

### 5. Add Quiz (5 questions)
```sql
INSERT INTO quizzes (mission_id) VALUES ('mission-uuid');
INSERT INTO quiz_questions (quiz_id, question_text, options, correct_answer, explanation)
VALUES ('quiz-uuid', 'What is 2+2?', '["3","4","5"]', '4', 'Basic math');
```

### 6. Add Writing Task
```sql
INSERT INTO english_writing_tasks (mission_id, task_type, prompt)
VALUES ('mission-uuid', 'explain-solution', 'Explain operators in 2 lines');
```

---

## 🚢 Deploy to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push

# 2. Import to Vercel
# - Connect GitHub repo
# - Add environment variables
# - Deploy

# 3. Update Supabase
# - Add Vercel URL to allowed URLs
```

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

---

## ✅ Checklist

### Before Launch
- [ ] Complete all 30 days of content
- [ ] Test all mission flows
- [ ] Add progress analytics
- [ ] Add settings page
- [ ] Test on mobile
- [ ] Set up error tracking
- [ ] Configure email notifications
- [ ] Add loading states

### Post Launch
- [ ] Monitor user feedback
- [ ] Track completion rates
- [ ] Add advanced features
- [ ] Build mobile app
- [ ] Create certificates
- [ ] Add social features

---

**Need help? Check SETUP_GUIDE.md or PROJECT_SUMMARY.md**
