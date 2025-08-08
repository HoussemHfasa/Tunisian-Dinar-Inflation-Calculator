# 📈 Tunisian Dinar Historical Value Calculator

A web application that calculates the historical value of Tunisian Dinar (TND) adjusted for inflation between different years using official Consumer Price Index (CPI) data from the Institut National de la Statistique (INS) of Tunisia.

## 🌐 Live Demo

**Test the project online:** [https://tunisian-dinar-calculator.vercel.app/](https://tunisian-dinar-calculator.vercel.app/)

## 📋 Overview

This application allows users to:
- Enter an amount in Tunisian Dinar (TND)
- Select two different years (e.g., 2025 and 1990)
- Get the equivalent purchasing power adjusted for inflation
- View historical CPI data across different time periods
- Understand how inflation has affected the value of money over time

**Example:** 10 TND in 2025 had the equivalent purchasing power of approximately 1.94 TND in 1990.

### 🌍 Language Support

The website is currently available in **French** as it is primarily designed for Tunisian users who speak French as their second language. However, users who prefer English can easily use **Google Chrome's automatic translation feature** to translate the entire interface to English or any other preferred language.

**To translate:** Simply right-click on the page in Chrome and select "Translate to English" or use the translation icon in the address bar.

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** components built on Radix UI
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **Wouter** for lightweight routing

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **PostgreSQL** with Drizzle ORM
- **XML parsing** for Tunisian INS API integration
- **Axios** for HTTP requests

### Data Sources
- **Tunisian INS API** - Official Consumer Price Index data
- **Static fallback data** for development and reliability
- **Multiple CPI base years** (1990, 2000, 2010) for comprehensive coverage

## 🚀 Installation and Setup

### Prerequisites
- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database (optional - uses in-memory storage by default)

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd TunisianDinar
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables (Optional)
Create a `.env` file in the root directory if you want to use a PostgreSQL database:
```env
DATABASE_URL=your_postgresql_connection_string
PORT=3000
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at: **http://127.0.0.1:3000**

### 5. Build for Production
```bash
npm run build
npm run start
```

## 📁 Project Structure

```
TunisianDinar/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and configurations
│   │   └── pages/          # Page components
│   └── index.html
├── server/                 # Backend Express server
│   ├── index.ts           # Main server file
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data storage layer
├── shared/                # Shared types and schemas
│   └── schema.ts
└── package.json
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🏗️ Key Features

### 📊 Inflation Calculator
- Calculate equivalent purchasing power between any two years
- Support for multiple CPI base years (1990, 2000, 2010)
- Real-time calculations with detailed metrics
- Annual and total inflation rate calculations

### 📈 Historical Data Display
- Table view of recent CPI values
- Multiple base year comparisons
- Data sourced from official Tunisian statistics

### 🌐 API Integration
- Integration with Tunisian INS XML-based API
- Automatic fallback to static data
- Graceful error handling and retry mechanisms

### 💻 User Experience
- Responsive design for all devices
- Intuitive form validation
- Toast notifications for user feedback
- Loading states and error handling

## 🎯 Educational Purpose

⚠️ **Important Notice:** This project is created for educational purposes only. The inflation calculations are based on available CPI data and should not be used for financial decision-making without consulting official sources.

## 📧 Contact

**Creator:** Houssem Hfasa  
**Email:** [houssemhfasa@gmail.com](mailto:houssemhfasa@gmail.com)

For questions, issues, or feedback about this project, please contact me via email.

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Houssem Hfasa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🤝 Contributing

This is an educational project, but contributions are welcome! Please feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Improve documentation

## 🙏 Acknowledgments

- **Institut National de la Statistique (INS) Tunisia** for providing official CPI data
- **Open source community** for the amazing tools and libraries used in this project
- **Vercel** for hosting the live demo

---

**Happy calculating! 📊✨**
