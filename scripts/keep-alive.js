/**
 * Keep-alive pinger — prevents Render free-tier cold starts (~9 s delay).
 *
 * Render's free web services sleep after 15 minutes of inactivity.
 * This script pings the homepage every 13 minutes to keep the server warm.
 *
 * RECOMMENDED: Use a free external service instead of running this locally.
 *   → https://uptimerobot.com  (free, monitors every 5 min, no server needed)
 *   → https://cron-job.org     (free cron, HTTP GET on a schedule)
 *
 * To run locally:
 *   node scripts/keep-alive.js
 *
 * To run in the background on a server / CI:
 *   nohup node scripts/keep-alive.js &
 */

const TARGET_URL = process.env.KEEP_ALIVE_URL || 'https://nelson-ferreira.com';
const INTERVAL_MS = 13 * 60 * 1000; // 13 minutes

async function ping() {
  const start = Date.now();
  try {
    const res = await fetch(TARGET_URL, { method: 'HEAD' });
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ping ${TARGET_URL} → ${res.status} (${ms}ms)`);
  } catch (err) {
    const ms = Date.now() - start;
    console.error(`[${new Date().toISOString()}] ping failed (${ms}ms):`, err.message);
  }
}

ping();
setInterval(ping, INTERVAL_MS);
console.log(`Keep-alive started. Pinging ${TARGET_URL} every ${INTERVAL_MS / 60000} minutes.`);
