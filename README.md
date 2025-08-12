# BHEL GreenView

A comprehensive environmental monitoring and gamification platform for BHEL facilities, designed to promote sustainability through real-time metrics, employee engagement, and AI-driven insights.

## 🌱 Overview

BHEL GreenView is a Next.js application that empowers BHEL employees to actively participate in environmental sustainability initiatives. The platform combines real-time environmental monitoring with gamification elements to encourage green practices across all facilities.

## ✨ Features

- **Real-time Metrics Dashboard**: Monitor power usage, waste generation, and environmental metrics from BHEL facilities
- **Green Initiative Portal**: Submit, vote on, and track the impact of sustainability suggestions
- **Gamification System**: Earn points, badges, and compete on leaderboards for environmental achievements
- **Secure Authentication**: Employee directory integration for secure access
- **Data Integration**: Connect with facility sensors and meters through secure APIs
- **AI-Driven Anomaly Detection**: Intelligent trend analysis to identify unusual energy consumption and waste patterns

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account and project setup

### Installation

1. Clone the repository:
```bash
git clone https://github.com/qr6710752-netizen/BHEL-GreenView.git
cd BHEL-GreenView
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your Firebase configuration
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit AI development server
- `npm run genkit:watch` - Start Genkit AI with watch mode

### Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (dashboard)/       # Dashboard routes
│   ├── login/             # Authentication pages
│   └── signup/
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
└── ai/                    # AI/ML related code
```

To get started with development, explore the main dashboard at [`src/app/(dashboard)/page.tsx`](src/app/(dashboard)/page.tsx).

## 🎨 Design System

- **Primary Color**: Forest Green (#3F704F) - reflecting our environmental focus
- **Background**: Light Beige (#F5F5DC) - clean, neutral backdrop
- **Accent Color**: Golden Yellow (#FFC107) - highlighting key metrics and actions
- **Typography**: Inter font family for modern, clean readability
- **Icons**: Flat, line-based icons emphasizing energy and environmental themes

## 📚 Documentation

For detailed project specifications and features, see the [project blueprint](docs/blueprint.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary to BHEL.

## 🔧 Tech Stack

- **Framework**: Next.js 15.3.3 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives
- **Backend**: Firebase (Firestore, Authentication)
- **AI/ML**: Google AI Genkit
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
