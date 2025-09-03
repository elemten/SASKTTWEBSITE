# Table Tennis Saskatchewan - Complete Site Map

## 🏠 **Home**
- **Route**: `/`
- **Page**: `Index.tsx`
- **Description**: Main landing page with hero section, features, and overview

## 👥 **About Us** (`/about`)
- **Main Page**: `About.tsx` - Overview of the organization
- **Subsections**:
  - **History & Mission**: `/about/history-mission` → `HistoryMission.tsx`
  - **Team Members**: `/about/staff-board` → `StaffBoard.tsx`
  - **Governance**: `/about/governance` → `Governance.tsx`

## 🎯 **Services** (`/membership`)
- **Main Page**: `Membership.tsx` - Membership information and benefits
- **Related Services**:
  - **Coaching**: `/coaching` → `Coaching.tsx`
  - **Officials**: `/officials` → `Officials.tsx`
  - **Clubs**: `/clubs` → `Clubs.tsx`
  - **Club Registration**: `/clubs/register` → `ClubRegistration.tsx`

## 🏋️ **Training** (`/play/training`)
- **Main Page**: `Training.tsx` - Training programs overview
- **Training Options**:
  - **Training Programs**: `/play/training` → `Training.tsx`
  - **Clinics**: `/play/clinics` → `Clinics.tsx`
  - **Advanced & Para**: `/play/advanced-para` → `AdvancedPara.tsx`
  - **Where to Play**: `/play/locations` → `Locations.tsx`

## 📅 **Events**
- **Route**: `/events`
- **Page**: `Events.tsx`
- **Description**: Upcoming events, tournaments, and programs

## 🖼️ **Gallery**
- **Route**: `/gallery`
- **Page**: `Gallery.tsx`
- **Description**: Photo and video gallery of events and activities

## 📚 **Resources**
- **Route**: `/resources`
- **Page**: `Resources.tsx`
- **Description**: Educational materials, rules, and helpful information

## 📞 **Contact Us**
- **Route**: `/contact`
- **Page**: `Contact.tsx`
- **Description**: Contact information and contact form

## 🔐 **Authentication**
- **Sign In**: `/auth/sign-in` → `sign-in.tsx`
- **Sign Out**: `/auth/sign-out` → `sign-out.tsx`
- **Callback**: `/auth/callback` → `callback.tsx`
- **Forbidden**: `/auth/forbidden` → `forbidden.tsx`

## 👨‍💼 **Admin Panel**
- **Route**: `/admin`
- **Page**: `Admin.tsx`
- **Description**: Administrative dashboard and management tools

## 🚫 **404 Not Found**
- **Route**: `*` (catch-all)
- **Page**: `NotFound.tsx`
- **Description**: Page not found error page

---

## 📱 **Navigation Structure**

### **Main Navigation Menu**
1. **Home** → `/`
2. **About Us** (Dropdown)
   - History & Mission → `/about/history-mission`
   - Team Members → `/about/staff-board`
   - Governance → `/about/governance`
   - Our Story → `/about`
3. **Services** (Dropdown)
   - Membership → `/membership`
   - Coaching → `/coaching`
   - Officials → `/officials`
   - Clubs → `/clubs`
   - Club Registration → `/clubs/register`
4. **Training** (Dropdown)
   - Training Programs → `/play/training`
   - Clinics → `/play/clinics`
   - Advanced & Para → `/play/advanced-para`
   - Where to Play → `/play/locations`
5. **Events** → `/events`
6. **Gallery** → `/gallery`
7. **Resources** → `/resources`
8. **Contact Us** → `/contact`

### **Footer Links**
1. **Quick Links**
   - Home → `/`
   - Membership → `/membership`
   - Events → `/events`
2. **Programs**
   - SPED Training → `/events#sped`
   - Youth Programs → `/events#youth`
   - Tournaments → `/events#tournaments`
3. **Support**
   - Contact Us → `/contact`
   - FAQ → `/faq` (needs to be created)
   - Club Directory → `/clubs`
   - Resources → `/resources`

---

## 🔧 **Missing Pages to Create**
- **FAQ Page**: `/faq` → `FAQ.tsx` (referenced in footer)
- **Tournament Pages**: Individual tournament pages
- **News/Blog**: Latest updates and announcements
- **Rules & Regulations**: Official table tennis rules
- **Equipment Guide**: What equipment to use
- **Coaching Certification**: How to become a coach
- **Officials Training**: How to become an official

---

## 📍 **URL Structure Best Practices**
- **Consistent**: All URLs use kebab-case
- **Hierarchical**: Related pages grouped under parent routes
- **SEO-friendly**: Descriptive, readable URLs
- **Accessible**: Clear navigation paths for users

---

## 🚀 **Next Steps**
1. ✅ **Routes are properly configured** in `App.tsx`
2. ✅ **Navigation menu** includes all main sections
3. ✅ **Footer links** cover key pages
4. 🔄 **Update navigation** to ensure all dropdown items are properly linked
5. 🔄 **Enhance footer** with more comprehensive links
6. 📝 **Create missing pages** (FAQ, etc.)
7. 🔍 **Add breadcrumbs** for better navigation
8. 📱 **Mobile navigation** optimization
