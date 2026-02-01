# CRITICAL FIXES NEEDED



## 1. Interview Question Bug - CRITICAL

**Problem:** User selected "Chemical Engineer Level 5" but got tech questions (latency, system design)

**Root Cause:** The interview prompt generation is not using the role parameter properly

**Fix Required:** Update AuraSingularityChamber to:

1. Parse role ID from URL params properly
2. Map role IDs to actual engineering domains
3. Generate role-specific questions

**Role Mappings:**

- `core-engineering` → Mechanical/Civil/Electrical questions
- `chemical` → Process Design, Thermodynamics, Chemistry
- `tcs-nqt` → Aptitude, Reasoning, Basic Coding
- `product-service` → Full Stack, System Design
- etc.

---



## 2. Supabase Credentials - PROVIDED

**URL:** https://skfnofbcompycyxrvmeo.supabase.co
**Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

**Action:** Update `.env.local` (ask user to add manually or use different approach)

---



## 3. Mobile Optimization

**Required:**

- Responsive layouts for all components
- Touch-friendly buttons (44x44px minimum)
- Hamburger menu for navigation
- Optimized font sizes
- Bottom nav bar for mobile

---



## 4. Real Analytics

**Current:** Simulated data in RealTimeAnalytics component
**Required:** Pull from Supabase

**Tables Needed:**

```sql
- analytics_events (user_id, event_type, timestamp, metadata)
- user_sessions (id, user_id, role, score, duration, created_at)
- user_locations (user_id, city, country)

```text

---

**Priority:**

1. Fix interview questions (CRITICAL) ⚠️
2. Add Supabase env vars
3. Mobile optimization
4. Real analytics
