# Zolltor Tariff Simulator

A React-based web application that serves as a virtual trade expert, providing real-time tariff rates, future projections, and strategic recommendations for international trade decisions.

## Features

- **Tariff Lookup**: Search for current tariff rates and future projections
- **Product Watchlist**: Monitor tariff changes for critical trade routes
- **HS Code Details**: Comprehensive product-specific information
- **User Authentication**: Secure login and registration system
- **Email Notifications**: Real-time alerts for tariff changes
- **Market Intelligence**: Data-driven insights for trade decisions

## Technology Stack

- **Frontend**: React 18 with React Router
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd zolltor
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Application Structure

```
src/
├── components/
│   └── Header.jsx          # Navigation header component
├── pages/
│   ├── TariffLookup.jsx    # Main tariff search page
│   ├── ProductWatchlist.jsx # User's monitored products
│   ├── HSCodeDetails.jsx   # Detailed product information
│   ├── UserProfile.jsx     # User settings and preferences
│   └── AuthPage.jsx        # Login and registration
├── data/
│   └── dummyData.json      # Mock data for development
├── App.jsx                 # Main application component
├── main.jsx               # Application entry point
└── index.css              # Global styles and Tailwind CSS
```

## Key Pages

### Tariff Lookup

- Search by HS Code, origin, and destination country
- View current tariff rates and future projections
- Access market intelligence data
- AI-powered analysis and recommendations

### Product Watchlist

- Monitor import and export products
- Color-coded alerts for rate changes
- Bulk operations (CSV upload/download)
- Country-specific perspective based on user location

### HS Code Details

- Comprehensive product information
- Historical trend analysis
- Top supplying countries data
- Recent news and regulatory updates

### User Profile

- Manage account information
- Configure notification settings
- Change password
- Set country of operation

## Authentication

The application supports multiple authentication methods:

- Email and password
- Social login (Google, LinkedIn, Twitter, Facebook)
- Account creation with country-specific setup

## Data Management

The application uses mock data stored in `src/data/dummyData.json` for development purposes. In a production environment, this would be replaced with API calls to a backend service.

## Responsive Design

The application is fully responsive and optimized for:

- Desktop computers
- Tablets
- Mobile devices

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

- The application uses React Router for client-side routing
- State management is handled with React hooks
- Tailwind CSS provides utility-first styling
- Lucide React provides consistent iconography
- Form validation and error handling included
- Local storage used for user session persistence

## Future Enhancements

- Integration with real tariff data APIs
- Advanced filtering and search capabilities
- Data visualization charts and graphs
- Export functionality for reports
- Multi-language support
- Push notifications for mobile
- Advanced analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software developed for Zolltor.

## Contact

For questions or support, please contact the development team.
