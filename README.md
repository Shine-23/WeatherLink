# WeatherLink
## Real-Time Community Weather & Chat Platform
WeatherLink is a full-stack, real-time web application that combines live weather updates with city-based community chat.
Users can search for cities, receive real-time weather updates, trigger weather alerts, and chat with others in the same city all powered by an event-driven architecture.
## Features
- Weather
- Real-Time City Chat
- Authentication
- Event-Driven Architecture
## Real-Time Flow
1. User searches for a city
2. Backend fetches weather (or uses cache)
3. Weather update sent to Kafka
4. Kafka consumer processes update
5. Weather pushed to users via Socket.IO
6. Alerts trigger WeatherBot messages in chat
## Architecture Overview
```
Frontend (React + Vite)
        |
        | REST + WebSocket
        v
Backend (Node.js + Express)
        |
        | Kafka Events
        v
  Apache Kafka
        |
        v
Kafka Consumer (Weather Processor)
        |
        v
MongoDB (Weather Cache + Chat Messages)

```
## Tech Stack
### Frontend
- React (Vite)
- React Router
- Axios
- Socket.IO Client
- Bootstrap + Custom CSS
### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Passport.js (Google OAuth)
### Distributed
- Apache Kafka
- Socket.IO
### External APIs
- OpenWeather API
## Running the Project Locally
1. Start Kafka: ```docker compose up -d```
2. Backend: ```npm run start```
3. Frontend: ```npm run dev```
