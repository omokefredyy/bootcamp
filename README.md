# 🚀 Bootcamp Elite

**Build. Teach. Elevate.** A premium online learning platform connecting elite instructors with ambitious students through live sessions, AI-powered tools, and collaborative learning experiences.

![Bootcamp Elite](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Supabase](https://img.shields.io/badge/Supabase-Integrated-green)

---

## ✨ Features

### For Students
- 📚 **Live Interactive Sessions** - Join real-time video conferences with instructors
- 🤖 **AI-Powered Learning** - Get instant help from AI tutors and automated lecture summaries
- 💬 **Community Chat** - Connect with peers in global chat rooms and direct messages
- 🎨 **Collaboration Tools** - Work together on whiteboards and shared projects
- 📊 **Progress Tracking** - Monitor your learning journey with detailed analytics
- 🎁 **Referral System** - Earn rewards by inviting friends

### For Instructors
- 🎓 **Multi-Bootcamp Management** - Create and manage multiple courses from one dashboard
- 💰 **Revenue Analytics** - Track earnings, student enrollments, and platform fees (10%)
- 📅 **Session Scheduling** - Schedule live sessions with automatic student notifications
- 📤 **Content Distribution** - Upload materials (PDFs, videos, links) for students
- 💳 **Instant Withdrawals** - Withdraw earnings directly to your account
- 📈 **Student Insights** - View enrollment status, payment tracking, and progress

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (custom design system)
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI Integration**: Google Gemini API
- **State Management**: React Hooks
- **Authentication**: Supabase Auth

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account ([supabase.com](https://supabase.com))
- Google Gemini API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/omokefredyy/bootcamp.git
   cd bootcamp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Rename `.env.example` to `.env` and add your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Initialize the database**
   
   - Go to your Supabase dashboard
   - Navigate to **SQL Editor**
   - Copy and run the contents of `db_schema.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

---

## 📁 Project Structure

```
bootcamp/
├── components/          # Reusable UI components
│   ├── AITutor.tsx
│   ├── GlobalChat.tsx
│   ├── LectureRoom.tsx
│   ├── LectureSummaryList.tsx
│   └── ...
├── views/              # Main application views
│   ├── Landing.tsx
│   ├── Auth.tsx
│   ├── Dashboard.tsx   # Student dashboard
│   ├── TutorDashboard.tsx
│   └── Paywall.tsx
├── services/           # API and data services
│   ├── dataService.ts  # Supabase data layer
│   └── gemini.ts       # AI integration
├── types.ts            # TypeScript interfaces
├── supabaseClient.ts   # Supabase configuration
├── db_schema.sql       # Database schema
└── App.tsx             # Root component
```

---

## 🗄️ Database Schema

The application uses the following main tables:

- **profiles** - User accounts (students & instructors)
- **bootcamps** - Course information
- **enrollments** - Student-bootcamp relationships
- **sessions** - Live session scheduling
- **materials** - Course materials (PDFs, videos, etc.)
- **updates** - Announcements and notifications
- **chat_messages** - Global chat history
- **transactions** - Payment and withdrawal records

See `db_schema.sql` for the complete schema with RLS policies.

---

## 🔐 Authentication Flow

1. Users sign up/login via Supabase Auth
2. Profile is created in the `profiles` table
3. Role-based routing:
   - **Students** → Paywall → Dashboard
   - **Instructors** → Direct access to Tutor Dashboard (no paywall)

---

## 💡 Key Features Implementation

### Real-time Chat
Uses Supabase's real-time capabilities with polling fallback for message updates.

### AI Lecture Summaries
Integrates Google Gemini API to generate:
- Concise lecture summaries
- Key technical takeaways
- Actionable insights

### Multi-Bootcamp Management
Instructors can:
- Create unlimited bootcamps
- Switch between bootcamps seamlessly
- Track individual bootcamp metrics

### Revenue System
- Platform fee: 10% of gross revenue
- Real-time balance calculation
- Withdrawal simulation (ready for payment gateway integration)

---

## 🎨 Design Philosophy

- **Premium Aesthetics** - Vibrant gradients, smooth animations, modern typography
- **User-Centric** - Intuitive navigation, clear CTAs, responsive design
- **Performance-First** - Optimized rendering, lazy loading, efficient state management

---

## 🚧 Roadmap

- [ ] Payment gateway integration (Stripe/Paystack)
- [ ] Video conferencing (Twilio/Agora)
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Certificate generation
- [ ] Gamification & badges

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Omokefredy**
- GitHub: [@omokefredyy](https://github.com/omokefredyy)
- Repository: [bootcamp](https://github.com/omokefredyy/bootcamp)

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Backend infrastructure
- [Google Gemini](https://ai.google.dev) - AI capabilities
- [Tailwind CSS](https://tailwindcss.com) - Styling framework
- [Vite](https://vitejs.dev) - Build tool

---

## 📞 Support

For support, email omokefredyy@example.com or open an issue in the repository.

---

<div align="center">
  <strong>Built with ❤️ for the future of online education</strong>
</div>
