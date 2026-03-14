const DEFAULT_PORT = 3000;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const config = {
  port: Number(process.env.PORT) || DEFAULT_PORT,
  mongoUri: requireEnv("MONGODB_URI"),
  jwtSecret: requireEnv("JWT_SECRET"),
  allowedOrigins: (process.env.ALLOWED_ORIGINS || "http://127.0.0.1:5500,http://localhost:5500")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

module.exports = config;
