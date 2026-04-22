import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 });

export function cacheMiddleware(key, ttl = 300) {
  return (req, res, next) => {
    const cacheKey = key || req.originalUrl;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      cache.set(cacheKey, data, ttl);
      return originalJson(data);
    };
    next();
  };
}

export function invalidateCache(pattern) {
  if (pattern) {
    const keys = cache.keys().filter(k => k.includes(pattern));
    keys.forEach(k => cache.del(k));
  } else {
    cache.flushAll();
  }
}

export default cache;
