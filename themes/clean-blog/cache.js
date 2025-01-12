import redis from './redis.js'; // Import the Redis client

/**
 * Cache the query result in Redis and return it.
 * If data is already in Redis, return it from cache.
 * If not, query the database and store the result in Redis indefinitely.
 */
export const cacheQueryResults = async (key, queryFn) => {
  // Attempt to get cached data from Redis
  const cachedData = await redis.get(key);
  
  if (cachedData) {
    console.log('Cache hit');  // If data is found in the cache
    return JSON.parse(cachedData);  // Return the cached data as an object
  }
  console.log('Cache miss');  // If data is not found in the cache
  
  // If the data is not cached, fetch it from the database using the provided query function
  const result = await queryFn();

  // Cache the result in Redis indefinitely (without expiration time)
  redis.set(key, JSON.stringify(result));  // Store result as a JSON string without expiration

  return result;  // Return the fetched data
};
