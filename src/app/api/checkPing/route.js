import { exec } from "child_process";

const pingCache = new Map(); // ip -> { online: boolean, time: timestamp }
const pingTimeout = 800; // 毫秒
const ttlPattern = /TTL=/i;

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const ip = searchParams.get("ip");

  if (!ip) {
    return new Response(JSON.stringify({ error: "缺少 IP 參數" }), { status: 400 });
  }

  const now = Date.now();
  const cache = pingCache.get(ip);
  if (cache && now - cache.time < 30 * 1000) {
    return new Response(JSON.stringify({ online: cache.online, cached: true }), { status: 200 });
  }

  return new Promise((resolve) => {
    exec(`ping -n 1 -w ${pingTimeout} ${ip}`, (error, stdout) => {
      const online = ttlPattern.test(stdout); // 確保真的有 TTL
      pingCache.set(ip, { online, time: Date.now() });
      
      resolve(new Response(JSON.stringify({ online }), { status: 200 }));
    });
  });
};
