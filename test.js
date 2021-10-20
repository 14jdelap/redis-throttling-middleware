const redis = require("redis");
const client = redis.createClient();

client.on("error", (err) => console.log(err));
client.on("connect", () => console.log("Connected!"));

const ipAddress = 5;

// client.get(ipAddress, redis.print)
// client.set(ipAddress, null, redis.print)
// client.flushdb()
