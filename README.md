# BlogCMS - Modern Content Management System

A modern, full-featured blog CMS built with React, TypeScript, Node.js, and MongoDB.

## Features

### Backend Features
- **Authentication & Authorization**: JWT-based authentication with role-based access control (Admin, Editor, Reader)
- **RESTful API**: Complete CRUD operations for posts, categories, tags, and comments
- **Content Management**: Advanced post management with drafts, publishing, and scheduling
- **Comment System**: Nested comments with moderation capabilities
- **Media Management**: File upload and management system
- **Security**: Input validation, rate limiting, and security best practices

### Frontend Features
- **Modern UI**: Beautiful, responsive design with glassmorphism effects
- **Dark/Light Mode**: Persistent theme switching
- **Admin Dashboard**: Comprehensive admin interface with analytics
- **Rich Text Editor**: Advanced content creation tools
- **SEO Optimization**: Built-in SEO tools and meta management
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Technical Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, React Router, Tanstack Query
- **Backend**: Node.js, Express.js, TypeScript, MongoDB, Mongoose
- **Authentication**: JWT tokens with bcrypt password hashing
- **Real-time**: Socket.io for real-time features
- **Deployment**: Docker-ready with production configurations

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update environment variables in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/blog-cms
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. Build and start the server:
```bash
npm run build
npm start
```

For development:
```bash
npm run dev
```

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Posts
- `GET /api/posts` - Get all posts (with filters)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/featured` - Get featured posts

### Comments
- `GET /api/comments` - Get comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id/status` - Update comment status
- `DELETE /api/comments/:id` - Delete comment

## Database Models

### User Model
```typescript
{
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'editor' | 'reader';
  avatar?: string;
  bio?: string;
  isActive: boolean;
  isEmailVerified: boolean;
}
```

### Post Model
```typescript
{
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: ObjectId;
  category: ObjectId;
  tags: ObjectId[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  views: number;
  likes: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  isFeature: boolean;
  allowComments: boolean;
}
```

### Comment Model
```typescript
{
  content: string;
  author: ObjectId;
  post: ObjectId;
  parentComment?: ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  likes: number;
  replies: ObjectId[];
}
```

## Deployment

### VPS Ubuntu Deployment

1. **Server Setup**:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

2. **Application Deployment**:
```bash
# Clone repository
git clone <your-repo-url>
cd blog-cms

# Install dependencies
cd server && npm install
cd ../client && npm install

# Build applications
cd ../server && npm run build
cd ../client && npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

3. **Nginx Configuration**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **SSL Certificate**:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Docker Deployment

1. **Build Docker Images**:
```bash
# Build backend
cd server
docker build -t blog-cms-backend .

# Build frontend
cd ../client
docker build -t blog-cms-frontend .
```

2. **Run with Docker Compose**:
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/blog-cms
      - JWT_SECRET=your-jwt-secret
    depends_on:
      - mongodb

  frontend:
    build: ./client
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

```bash
docker-compose up -d
```

## Security Features

- JWT token authentication
- Bcrypt password hashing
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet security headers
- Role-based access control
- XSS protection

## Performance Optimization

- Image optimization and compression
- Lazy loading
- Code splitting
- Caching strategies
- Database indexing
- Pagination
- Search optimization

## Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

### E2E Testing
```bash
npm run test:e2e
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@blogcms.com or join our Slack channel.

## Roadmap

- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Social media integration
- [ ] Plugin system
- [ ] Mobile app
- [ ] GraphQL API
- [ ] Real-time collaboration
- [ ] Advanced SEO tools