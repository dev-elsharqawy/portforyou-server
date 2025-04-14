# Portfolio Analytics Backend

## 🚀 Project Overview

This is a modern, scalable backend service for a portfolio website analytics system, built with cutting-edge technologies to provide robust performance, security, and developer experience.

## 🛠 Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Web Framework**: Express
- **GraphQL**: Apollo Server
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Logging**: Winston
- **Media Storage**: Cloudinary

## 📦 Project Structure

```
backend/
├── config/           # Application configurations
├── lib/              # Core utilities and helpers
├── models/           # MongoDB schema models
├── modules/          # Feature modules (GraphQL resolvers/types)
├── utils/            # Utility functions
├── schema.ts         # GraphQL schema definition
└── server.ts         # Express/Apollo server setup
```

## 🔧 Prerequisites

- Node.js (v18+)
- MongoDB
- Cloudinary Account
- JWT Secret

## 🏁 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/portfolio-backend.git
cd portfolio-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Run the Development Server

```bash
npm run dev
```

## 🔐 Authentication

The backend uses JSON Web Tokens (JWT) for secure authentication. Tokens are generated upon successful login and must be included in the Authorization header for protected routes.

## 📊 Analytics System

The backend implements a sophisticated visitor tracking mechanism:
- Tracks unique visitors across portfolio templates
- Captures IP, country, browser, and device information
- Prevents duplicate visitor entries
- Provides aggregated analytics data

## 🧪 Testing

```bash
npm test
```

## 🚢 Deployment

The backend supports Docker containerization. Build and run the Docker image:

```bash
docker build -t portfolio-backend .
docker run -p 4000:4000 portfolio-backend
```

## 🛡️ Security Features

- Rate limiting to prevent abuse
- JWT authentication
- Secure MongoDB connection
- Input validation
- Logging with Winston for audit trails

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Your Name - your.email@example.com

Project Link: [https://github.com/your-username/portfolio-backend](https://github.com/your-username/portfolio-backend)
