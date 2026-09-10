const fs = require('fs');

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/GRPC_IDENTITY/g, 'GRPC_USER');
  
  // Add new auth vars
  const appendStr = `
# gRPC Auth Service
GRPC_AUTH_HOST=0.0.0.0
GRPC_AUTH_PORT=50052

# JWT
JWT_SECRET=super-secret-key-for-dev
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PASSWORD=
`;
  content += appendStr;
  fs.writeFileSync(file, content);
}

updateFile('.env');
updateFile('.env.example');
