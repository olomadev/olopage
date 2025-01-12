import Redis from 'ioredis';

// Create and configure the Redis client
const redis = new Redis({
  host: 'localhost',  // Redis server address
  port: 6379,         // Redis default port
});

export default redis;  // Export the Redis client for use in other files
