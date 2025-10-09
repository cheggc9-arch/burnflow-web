# RewardFlow Burn Web Interface

A beautiful red-themed web dashboard for the RewardFlow Burn application, following the same design language as the main RewardFlow application but with a burn-focused red color scheme.

## 🎨 Design Features

### Red Theme
- **Primary Color**: `#dc2626` (burn-red)
- **Dark Accent**: `#991b1b` (burn-dark)
- **Light Background**: `#fef2f2` (burn-light)
- **Accent Color**: `#fca5a5` (burn-accent)

### Visual Elements
- **Gradient Backgrounds**: Dark space theme with red accents
- **Glowing Effects**: Red glow effects on burn-related elements
- **Pulse Animations**: Animated elements for active burn operations
- **Progress Bars**: Red gradient progress bars for burn operations

## 🚀 Features

### Dashboard Components

1. **Status Cards**
   - Burn Wallet Balance
   - Next Burn Timer (countdown)
   - Total Tokens Burned
   - Burn Status (Idle/Burning/Completed)

2. **Burn Progress** (Shows during active burns)
   - Buyback progress bar
   - Burn progress bar
   - Real-time status updates

3. **Burn History**
   - Complete history of all burn operations
   - Transaction signatures
   - SOL used and tokens burned
   - Timestamps and status

4. **Analytics**
   - Total burns count
   - Average burn size
   - Last burn time
   - Burn statistics

### Interactive Elements

- **Countdown Timer**: Shows time until next burn operation
- **Progress Tracking**: Visual progress bars during burn operations
- **Real-time Updates**: Live data updates without page refresh
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠 Technical Implementation

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **Tailwind CSS**: Utility-first CSS framework
- **Vanilla JavaScript**: No framework dependencies
- **Responsive Design**: Mobile-first approach

### Backend
- **Express.js**: Web server framework
- **REST API**: Clean API endpoints
- **Static File Serving**: Serves web assets
- **CORS Support**: Cross-origin resource sharing

### API Endpoints

- `GET /` - Main dashboard page
- `GET /api/status` - Burn service status
- `GET /api/burn-history` - Burn history data
- `POST /api/trigger-burn` - Manual burn trigger
- `GET /api/burn-stats` - Burn statistics
- `GET /api/health` - Health check

## 🚀 Running the Web Interface

### Option 1: Web Dashboard Only
```bash
npm run web
```
Access at: http://localhost:3001

### Option 2: Full Application (Recommended)
```bash
npm run app
```
Includes both burn service and web dashboard

### Option 3: Development Mode
```bash
npm run app-dev
```
Auto-restart on file changes

## 📱 Responsive Design

The web interface is fully responsive and works on:
- **Desktop**: Full feature set with large cards
- **Tablet**: Optimized layout for touch interaction
- **Mobile**: Compact design with touch-friendly elements

## 🎯 Key Features

### Countdown Timer
- Shows exact time until next burn operation
- Updates every second
- Visual pulse animation when active

### Burn Progress
- Two-stage progress tracking
- Buyback phase: SOL to token conversion
- Burn phase: Token transfer to burn address
- Real-time progress bars

### Burn History
- Complete transaction history
- Transaction signatures
- SOL amounts and token counts
- Timestamps and status indicators

### Real-time Stats
- Live burn wallet balance
- Total tokens burned
- Burn operation count
- Last burn timestamp

## 🔧 Configuration

The web interface automatically connects to the burn service and displays:
- Current burn wallet balance
- Next burn countdown
- Burn history from the service
- Real-time burn progress

## 🎨 Customization

### Color Scheme
The red theme can be customized by modifying the CSS variables in `public/index.html`:

```css
colors: {
    'burn-red': '#dc2626',      // Primary red
    'burn-dark': '#991b1b',     // Dark red
    'burn-light': '#fef2f2',    // Light red
    'burn-accent': '#fca5a5'   // Accent red
}
```

### Layout
The dashboard layout is built with Tailwind CSS and can be customized by modifying the HTML structure in `public/index.html`.

## 📊 Monitoring

The web interface provides comprehensive monitoring:
- **Service Status**: Burn service running status
- **Wallet Balance**: Real-time SOL balance
- **Burn Operations**: Complete operation history
- **Performance**: Response times and success rates

## 🔒 Security

- **CORS Protection**: Configured for secure cross-origin requests
- **Input Validation**: All API inputs are validated
- **Error Handling**: Graceful error handling and user feedback
- **Rate Limiting**: Built-in protection against abuse

## 🚀 Deployment

### Production Deployment
1. Set up environment variables
2. Install dependencies: `npm install`
3. Start the application: `npm run app`
4. Access dashboard at configured port

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "run", "app"]
```

### PM2 Deployment
```bash
pm2 start src/burn-app.js --name "rewardflow-burn"
pm2 startup
pm2 save
```

## 📈 Performance

- **Fast Loading**: Optimized assets and minimal dependencies
- **Real-time Updates**: Efficient data polling
- **Responsive**: Smooth animations and transitions
- **Scalable**: Handles multiple concurrent users

## 🎯 Future Enhancements

- **WebSocket Support**: Real-time updates without polling
- **Advanced Analytics**: Charts and graphs for burn data
- **Mobile App**: Native mobile application
- **Push Notifications**: Burn operation alerts
- **Multi-wallet Support**: Support for multiple burn wallets

## 📞 Support

For issues with the web interface:
1. Check browser console for errors
2. Verify API endpoints are responding
3. Check burn service is running
4. Review configuration settings

The web interface is designed to be intuitive and provide all necessary information for monitoring and managing the burn operations.
