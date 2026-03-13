# Real-Time User Tracking System

A complete real-time user tracking application with unique URL generation and live dashboard visualization.

## Features

- **Unique URL Generation**: Create unique tracking URLs for different websites/pages
- **Real-Time Data Collection**: Track user visits with WebSocket technology
- **Live Dashboard**: Monitor visitor activity in real-time
- **Device & Browser Analytics**: Track device types, browsers, screen resolutions
- **Session Management**: Track unique visitors and sessions
- **Responsive Design**: Mobile-friendly interface

## Architecture

### Backend (Node.js + Express + Socket.IO)
- **Express Server**: RESTful API for creating trackers and fetching data
- **Socket.IO**: Real-time WebSocket connections for live updates
- **UUID Generation**: Unique tracking IDs for each tracker
- **In-Memory Storage**: Map-based storage for tracking data (easily replaceable with database)

### Frontend (React + Socket.IO Client)
- **React Router**: Navigation between home and dashboard pages
- **Real-Time Updates**: Live visitor tracking with Socket.IO
- **Responsive UI**: Modern, mobile-friendly design
- **Analytics Dashboard**: Visual representation of visitor data

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### 1. Create a Tracker
- Visit `http://localhost:3000`
- Enter a tracker name (optional)
- Click "Create Tracker"
- You'll receive two URLs:
  - **Tracking URL**: Share this URL or embed it as a pixel on your website
  - **Dashboard URL**: View real-time analytics

### 2. Track Visitors
- Share the tracking URL with visitors
- Embed as an image pixel: `<img src="http://localhost:5000/track/YOUR_TRACKING_ID" />`
- Or use as a tracking script: `<script src="http://localhost:5000/track/YOUR_TRACKING_ID"></script>`

### 3. Monitor Analytics
- Visit the dashboard URL to see real-time visitor data
- View device types, browsers, screen resolutions
- Track unique visitors and total visits
- Live updates as visitors arrive

## API Endpoints

### POST `/api/create-tracker`
Create a new tracking URL.

**Request Body:**
```json
{
  "trackerName": "My Website Tracker"
}
```

**Response:**
```json
{
  "success": true,
  "trackingId": "uuid-here",
  "trackingUrl": "http://localhost:5000/track/uuid-here",
  "dashboardUrl": "http://localhost:3000/dashboard/uuid-here"
}
```

### GET `/api/tracker/:trackingId/data`
Get tracking data for a specific tracker.

**Response:**
```json
{
  "id": "uuid-here",
  "name": "My Website Tracker",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "visits": [
    {
      "id": "visit-uuid",
      "timestamp": "2024-01-01T00:00:00.000Z",
      "ip": "127.0.0.1",
      "userAgent": "Mozilla/5.0...",
      "screenResolution": "1920x1080",
      "timezone": "America/New_York",
      "sessionId": "session-uuid"
    }
  ],
  "isActive": true
}
```

### GET `/api/trackers`
Get all trackers.

### GET `/track/:trackingId`
Tracking endpoint that collects visitor data and returns tracking script.

## Data Collected

The system collects the following anonymous data:
- Timestamp of visit
- User Agent (browser/device information)
- Screen resolution
- Timezone
- Language preference
- Referrer URL
- Session ID (for tracking unique visitors)
- IP address (for geographic data - optional)

## WebSocket Events

### Client to Server:
- `subscribe-tracker`: Subscribe to real-time updates for a specific tracker

### Server to Client:
- `tracking-update-{trackingId}`: Real-time visitor data updates

## Development

### Adding Database Support

To replace in-memory storage with a database:

1. Install database driver (e.g., `mongoose` for MongoDB)
2. Create schemas for trackers and visits
3. Replace Map operations with database operations
4. Add connection and error handling

### Adding More Analytics

Enhance the analytics by tracking:
- Click events
- Page scroll depth
- Time on page
- Geographic location
- Custom events

### Security Considerations

For production deployment:
- Add rate limiting to prevent abuse
- Implement authentication for dashboard access
- Sanitize and validate all inputs
- Use HTTPS for all connections
- Consider GDPR compliance

## Technologies Used

### Backend:
- Node.js
- Express.js
- Socket.IO
- UUID
- CORS

### Frontend:
- React
- React Router
- Socket.IO Client
- CSS3 (Flexbox & Grid)

## License

MIT License - feel free to use this project for your own tracking needs!
