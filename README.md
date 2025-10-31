# Ping ChatAPP

A full-stack real-time communication application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Socket.IO, enabling instant bidirectional communication between users.

## 🚀 Live Demo

**[View Live Application](https://pingchatapp.netlify.app/)**

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Socket Events](#socket-events)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## ✨ Features

- **Real-Time Messaging**: Instant message delivery using Socket.IO
- **User Authentication**: Secure login and registration system
- **Online Status**: View which users are currently online
- **Message History**: Persistent message storage in MongoDB
- **Typing Indicators**: See when other users are typing
- **Read Receipts**: Track message delivery and read status
- **Responsive Design**: Mobile-friendly interface
- **User Profiles**: Customizable user profiles with avatars
- **Private Conversations**: One-to-one messaging capability
- **Group Chat**: Create and join group conversations
- **Message Notifications**: Real-time alerts for new messages

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library for building interactive interfaces
- **Socket.IO Client** - Real-time bidirectional communication
- **Axios** - HTTP client for API requests
- **React Router** - Navigation and routing
- **CSS3/Tailwind CSS** - Styling and responsive design

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Socket.IO** - Real-time event-based communication
- **MongoDB** - NoSQL database for data persistence
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### Additional Tools
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management
- **Nodemon** - Development server auto-restart

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PLP-MERN-Stack-Development/real-time-communication-with-socket-io-Aizohke.git
   cd real-time-communication-with-socket-io-Aizohke
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

## 🔐 Environment Variables

Create a `.env` file in the **server** directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/realtime-chat
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# Optional: File Upload (if using Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create a `.env` file in the **client** directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🚀 Running the Application

### Development Mode

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd server
   npm run dev
   # or
   npm start
   ```

3. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm start
   ```

4. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

### Production Build

```bash
# Build the client
cd client
npm run build

# Start the production server
cd ../server
npm start
```

## 📁 Project Structure

```
real-time-communication-with-socket-io-Aizohke/
├── client/                   # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── context/         # Context API
│   │   ├── utils/           # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
│
├── server/                   # Node.js backend
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── socket/              # Socket.IO logic
│   ├── utils/               # Helper functions
│   ├── server.js            # Entry point
│   ├── package.json
│   └── .env
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/avatar` - Upload user avatar

### Messages
- `GET /api/messages/:conversationId` - Get messages by conversation
- `POST /api/messages` - Send a new message
- `PUT /api/messages/:id/read` - Mark message as read
- `DELETE /api/messages/:id` - Delete a message

### Conversations
- `GET /api/conversations` - Get user's conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/:id` - Get conversation by ID

## 📡 Socket Events

### Client → Server
- `join` - Join a conversation room
- `leave` - Leave a conversation room
- `send_message` - Send a message
- `typing` - User is typing
- `stop_typing` - User stopped typing
- `mark_read` - Mark messages as read

### Server → Client
- `receive_message` - Receive new message
- `user_online` - User came online
- `user_offline` - User went offline
- `typing_indicator` - Show typing indicator
- `message_read` - Message read confirmation
- `error` - Error notification

## 📸 Screenshots

### Login Page
<img width="1365" height="718" alt="image" src="https://github.com/user-attachments/assets/e8067796-859b-4394-9893-2a0eb4a718d7" />


### Chat Interface
<img width="1363" height="762" alt="image" src="https://github.com/user-attachments/assets/b12d65a9-441e-4440-b717-5d4325ce879d" />



## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Aizohke**

- GitHub: [@Aizohke](https://github.com/Aizohke)
- Project Link: [https://github.com/PLP-MERN-Stack-Development/real-time-communication-with-socket-io-Aizohke](https://github.com/PLP-MERN-Stack-Development/real-time-communication-with-socket-io-Aizohke)

## 🙏 Acknowledgments

- [Socket.IO Documentation](https://socket.io/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- PLP MERN Stack Development Program

---

⭐ If you found this project helpful, please give it a star!

## 📞 Support

For support, email mathengeisaac04@gmail.com or open an issue in the repository.

---

**Made with ❤️ by Aizohke**
