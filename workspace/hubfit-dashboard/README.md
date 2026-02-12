# HubFit Client Adherence Dashboard

An interactive web dashboard for monitoring HubFit client adherence and engagement metrics.

## Features

- **Real-time Client Status**: Track clients as Active, At Risk, Ghosting, Expiring, or Archived
- **Interactive Charts**: Visualize adherence trends, client distribution, and weekly rates
- **Alert System**: High-priority notifications for ghosting (>14 days) and expiring (<7 days) clients
- **Searchable Client Table**: Sort and filter clients by status, last check-in, and more
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Auto-refresh**: Data updates automatically every 5 minutes
- **Data Export**: Export current dashboard data as JSON

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Interactive charting library
- **Lucide React** - Icon library
- **date-fns** - Date formatting

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository or navigate to the dashboard directory:
   ```bash
   cd workspace/hubfit-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Data Source

The dashboard reads real HubFit data from:
```
workspace/data/hubfit/hubfit_data_20260211_132817.json
```

### Current Real Data (as of 2026-02-11):
- **Total Clients**: 54
- **Active**: 12 clients (≤3 days since check-in)
- **At Risk**: 1 client (4-7 days since check-in)
- **Ghosting**: 30 clients (>7 days since check-in)
- **Archived**: 11 clients

### High Priority Alerts (18 clients):
1. Hassan Shariq - Ghosting 159 days
2. Ridhi Moza - Ghosting 136 days
3. Himanshu Sharma - Ghosting 133 days
4. Kriti Luked - Ghosting 130 days
5. Shrey Prashar - Ghosting 111 days
6. Sainikhil Nathi - Ghosting 110 days
7. Aditya Thanvi - Ghosting 103 days
8. Darsh Jain - Ghosting 96 days
9. Sathwik Parthi - Ghosting 95 days
10. Shivam Singh - Ghosting 88 days
11. Vatsal Patel - Ghosting 84 days
12. Lekshmi S - Ghosting 83 days
13. Aditi Jha - Ghosting 65 days
14. Aditya Menon - Ghosting 55 days
15. Adrian Gianchand - Ghosting 46 days
16. Maadhur Kapoor - Ghosting 35 days
17. Vaishnavi Pamulapati - Ghosting 28 days
18. Nita Ambedkar - Ghosting 28 days

The dashboard automatically loads and displays this real data, with fallback to generated data if the JSON file is not available.

## Project Structure

```
hubfit-dashboard/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── layout.tsx      # Root layout with theme provider
│   │   ├── page.tsx        # Main dashboard page
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── StatsCard.tsx   # Statistics overview cards
│   │   ├── AlertsPanel.tsx # Alert notifications panel
│   │   ├── ClientsTable.tsx# Interactive client table
│   │   ├── Charts.tsx      # Data visualization charts
│   │   └── ThemeProvider.tsx # Dark/light theme toggle
│   ├── lib/               # Utility functions
│   │   └── dataService.ts # Data loading and processing
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   └── data/              # Data files (auto-generated)
├── public/                # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features in Detail

### Client Status Categories

- **🟢 Active**: ≤3 days since last check-in
- **🟡 At Risk**: 4-7 days since last check-in
- **🔴 Ghosting**: >7 days since last check-in
- **⏰ Expiring**: Subscription ends in <14 days
- **💤 Archived**: Inactive/archived clients

### Alert System

- **High Priority**: Ghosting >14 days, Expiring <3 days
- **Medium Priority**: Expiring 3-7 days, No plans assigned
- **Low Priority**: Other notifications

### Charts

1. **Adherence Trend**: Line chart showing active/at-risk/ghosting clients over last 7 days
2. **Status Distribution**: Pie chart showing client status breakdown
3. **Weekly Adherence Rate**: Bar chart showing daily adherence rates

## Customization

### Branding

Update colors in `tailwind.config.js` to match NutriCepss branding:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-brand-color',
        // ...
      },
    },
  },
},
```

### Data Integration

To connect to real HubFit data:

1. Update `src/lib/dataService.ts` to parse your actual JSON structure
2. Ensure data files are placed in `workspace/data/hubfit/`
3. Files should follow the naming pattern: `summary_YYYY-MM-DD.json`

## Deployment

Build the application for production:

```bash
npm run build
```

The built application will be in the `.next` folder and can be deployed to any static hosting service (Vercel, Netlify, etc.) or run with:

```bash
npm start
```

## License

Proprietary - NutriCepss Internal Use