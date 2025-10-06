# Rehman AI - Powerful AAC Communication App

![Rehman AI](https://img.shields.io/badge/AAC-Communication-blue)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Supabase](https://img.shields.io/badge/Supabase-Ready-green)

**Rehman AI** is a comprehensive, professional-grade Augmentative and Alternative Communication (AAC) application designed to empower individuals with speech disabilities to communicate effectively and independently.

## 🌟 Key Features

### 💬 **Advanced Communication Tools**
- **Visual Tile Grid**: Color-coded communication tiles with icons
- **Text-to-Speech**: High-quality speech synthesis with customizable voice, rate, and pitch
- **Sentence Builder**: Tap tiles to construct complete messages
- **Word Prediction**: AI-powered suggestions based on usage patterns
- **Quick Phrases Library**: 18+ pre-configured common phrases

### 🚨 **Emergency Communication**
- **Always-Visible Emergency Bar**: One-tap access to critical phrases
- **Pre-configured Emergency Messages**: "I need help", "Emergency", "I'm in pain", "Call for assistance"
- **Visual Alerts**: High-contrast red design for immediate recognition

### 🎯 **Smart Organization**
- **Category System**: Organize tiles by Basic, Feelings, People, Actions, Places, Food
- **Recently Used**: Quick access to frequently used tiles
- **Favorites**: Mark important tiles for easy access
- **Multi-Board Support**: Multiple communication boards per user

### ⚙️ **Comprehensive Settings**
- **Speech Controls**: Adjust voice, rate (0.1-2.0x), pitch (0.1-2.0)
- **Display Options**: 4 tile sizes, 2-6 column layouts
- **Accessibility Features**: Scanning mode, high contrast, large touch targets
- **Auto-Speak**: Speak immediately when tiles are tapped

### 🔒 **Caregiver Controls**
- **PIN Protection**: 4-digit PIN prevents unauthorized changes (default: 1234)
- **Edit Mode**: Secure editing of tiles, categories, and settings
- **Usage Analytics**: Track communication patterns
- **Cloud Sync**: Access settings from any device

### 📊 **Intelligence & Learning**
- **Usage Tracking**: Records which tiles are used most
- **Word History**: Learns vocabulary preferences
- **Prediction Engine**: Suggests words based on context
- **Adaptive Layout**: Surfaces frequently used items

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier works great)

### Installation

```bash
# Clone the repository
git clone https://github.com/turtleneck444/speak-kindred.git
cd speak-kindred

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase credentials to .env

# Run database migrations
# (Instructions in supabase/migrations/)

# Start development server
npm run dev
```

### First-Time Setup

1. **Create Account**: Sign up with email and password
2. **Explore Interface**: 12 default tiles are pre-configured
3. **Test Emergency Bar**: Try emergency communication features
4. **Customize Settings**: Adjust speech rate, tile size, and layout
5. **Add Content**: Enter edit mode (lock icon) to customize tiles

## 📱 User Interface

### Main Screen Components

```
┌─────────────────────────────────────────────────┐
│  Rehman AI    [Settings] [Lock] [Sign Out]  │ Header
├─────────────────────────────────────────────────┤
│  🚨 Emergency: [Help] [Call] [Pain] [911]      │ Emergency Bar
├─────────────────────────────────────────────────┤
│  Current Sentence: "I want water"               │
│  [Speak] [Quick Phrases] [Delete] [←] [Clear] │ Utterance Bar
├─────────────────────────────────────────────────┤
│  ✨ Suggested: [please] [now] [cold]           │ Word Prediction
├─────────────────────────────────────────────────┤
│  📁 [All] [Basic] [Feelings] [People] [Food]  │ Categories
├─────────────────────────────────────────────────┤
│  🕐 Recently: [Water] [Bathroom] [Yes] [Help] │ Recent Tiles
├─────────────────────────────────────────────────┤
│  ┌────┬────┬────┬────┐                         │
│  │Yes │ No │Help│Food│  Communication Tiles    │
│  ├────┼────┼────┼────┤                         │
│  │Bath│Thx │Cold│Hot │  (Grid Layout)          │
│  └────┴────┴────┴────┘                         │
└─────────────────────────────────────────────────┘
```

## 🎨 AAC Color Standards

Rehman AI follows industry-standard AAC color conventions:

- 🔵 **Blue** - Basic communication, requests ("I want")
- 🟢 **Green** - Affirmative, positive responses ("Yes", "Good")
- 🔴 **Red** - Negative, stop, emergency ("No", "Help")
- 🟡 **Yellow** - Questions, needs ("Bathroom", "Food")
- 🟣 **Purple** - Social, emotions ("Happy", "Love")
- 🟠 **Orange** - Descriptions, gratitude ("Thank you")

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18.3** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 5.4** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Lucide React** - Icons

### Backend Services
- **Supabase** - Authentication & database
- **PostgreSQL** - Data storage
- **Row Level Security** - Data protection
- **Real-time Sync** - Instant updates

### Key Technologies
- **Web Speech API** - Text-to-speech (no internet required)
- **React Query** - Data fetching
- **React Router** - Navigation

## 📦 Project Structure

```
speak-kindred/
├── src/
│   ├── components/          # React components
│   │   ├── CategoryNav.tsx       # Category navigation
│   │   ├── EmergencyBar.tsx      # Emergency access
│   │   ├── WordPrediction.tsx    # Smart predictions
│   │   ├── RecentlyUsed.tsx      # Recent tiles
│   │   ├── QuickPhrasesPanel.tsx # Quick phrases
│   │   ├── SettingsPanel.tsx     # Settings UI
│   │   ├── TileGrid.tsx          # Main tile grid
│   │   ├── UtteranceBar.tsx      # Sentence builder
│   │   └── ui/                   # Base UI components
│   ├── hooks/               # Custom React hooks
│   │   └── useTTS.ts            # Text-to-speech hook
│   ├── integrations/        # External services
│   │   └── supabase/            # Supabase client & types
│   ├── pages/               # Route pages
│   │   └── Index.tsx            # Main application page
│   └── lib/                 # Utilities
├── supabase/
│   └── migrations/          # Database schema
└── public/                  # Static assets
```

## 🗄️ Database Schema

### Core Tables
- **profiles** - User settings and preferences
- **boards** - Communication boards
- **tiles** - Individual communication tiles
- **categories** - Tile organization
- **quick_phrases** - Pre-configured phrases
- **usage_events** - Tile usage tracking
- **word_history** - Word prediction data

### Advanced Features
- **Word Prediction Function** - PostgreSQL function for suggestions
- **Usage Analytics** - Track communication patterns
- **Recently Used View** - Efficient recent tile queries

## 🔐 Security & Privacy

- ✅ **Supabase Authentication** - Secure email/password auth
- ✅ **Row Level Security** - Database-level access control
- ✅ **PIN Protection** - Edit mode requires 4-digit PIN
- ✅ **Private Data** - Each user's data is isolated
- ✅ **HTTPS Only** - Encrypted connections
- ✅ **No Third-Party Tracking** - Privacy-first approach

## ♿ Accessibility Features

- ✅ **WCAG 2.1 AA Compliant**
- ✅ **Screen Reader Support** - Full ARIA labels
- ✅ **High Contrast Mode** - Optimized visibility
- ✅ **Large Touch Targets** - Easy interaction
- ✅ **Keyboard Navigation** - Full keyboard support
- ✅ **Focus Indicators** - Clear visual feedback
- ✅ **Adjustable Text Size** - 4 size options
- ✅ **Color Blind Friendly** - Icons supplement colors

## 📖 Documentation

- **[FEATURES.md](./FEATURES.md)** - Complete feature documentation
- **[API Documentation](./docs/api.md)** - Coming soon
- **[User Guide](./docs/user-guide.md)** - Coming soon

## 🎯 Use Cases

### For Individuals
- Cerebral palsy
- Autism spectrum disorders
- ALS/Motor neuron disease
- Stroke recovery
- Traumatic brain injury
- Temporary voice loss
- Learning disabilities

### For Settings
- Home use
- Schools and therapy centers
- Hospitals and clinics
- Rehabilitation facilities
- Care homes
- Public spaces

## 🛣️ Roadmap

### Phase 1 ✅ (Current)
- [x] Core tile communication
- [x] Text-to-speech
- [x] Category organization
- [x] Emergency access
- [x] Word prediction
- [x] Settings panel
- [x] Usage tracking

### Phase 2 🚧 (In Progress)
- [ ] Tile editor interface
- [ ] Custom image upload
- [ ] Multi-board navigation
- [ ] Export/import boards
- [ ] Offline PWA support

### Phase 3 📋 (Planned)
- [ ] Multi-language support
- [ ] Voice recognition
- [ ] Symbol libraries integration
- [ ] Advanced analytics dashboard
- [ ] Caregiver portal
- [ ] Mobile apps (iOS/Android)

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- Icons by [Lucide](https://lucide.dev)
- UI Components by [shadcn/ui](https://ui.shadcn.com)
- Backend by [Supabase](https://supabase.com)
- Inspired by the AAC community and professionals

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/turtleneck444/speak-kindred/issues)
- **Discussions**: [GitHub Discussions](https://github.com/turtleneck444/speak-kindred/discussions)
- **Email**: support@speakkindred.com (coming soon)

## 🌟 Star History

If you find Rehman AI helpful, please consider giving it a star! ⭐

---

**Rehman AI** - Empowering communication for everyone, everywhere.

Made with ❤️ for the AAC community
