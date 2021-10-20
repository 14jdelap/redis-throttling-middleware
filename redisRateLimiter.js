/*
1. Find IP Address: req.ip -> from (req, res, next)
2. Keep track of requests per IP Address
3. Deny access to addresses with 100 requests
4. 20m after a request's made, decrease by 1 || after 20 minutes set to 0 -> sliding window vs static window — SLIDING WINDOW

Get all the data from a single ip address

If data is null — DONE
- Create a key-value pair and set it in redis
  - Key: ip address
  - Value: array with a single object
    - Object: { miliseconds: miliseconds, count: 1 }
- Return the data

If data is not null
- Reduce the array and get the total count of the objects that happened in the last 1 minute? Assumes that some objects may be old
- If the total count is greater than 5
  - Increase count by 1 -> describe below
  - Return a JSON object with 5XX error
- If the total count is less than 5
  - Increase count by 1 -> describe below
  - Return the requested data

Increase count
- Lookup last array object
- Check if Date.now() - obj.timestamp is within 10s window
  - If true: increase obj.count by 1
  - Else: create a new object with a new timestamp and a count of 1 and push it to the end of the array

*/

const redis = require("redis");
const client = redis.createClient();

const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

client.on("error", (err) => console.log(err));
client.on("connect", () => console.log("Connected!"));

const rateLimiter = async (req, res, next) => {
  const ipAddress = req.ip;
  const data = await getAsync(ipAddress);

  if (data === null) {
    const payload = [{ miliseconds: Date.now(), count: 1 }];
    const stringifiedPayload = JSON.stringify(payload);
    await setAsync(ipAddress, stringifiedPayload).then(redis.print);
  } else {
    const 
  }
  const parsedData = JSON.parse(data);
  const currentTime = Date.now();
  const SIXTY_SECONDS = 60000
  const totalCount = parsedData.reduce((acc, obj) => {
    if ((currentTime - obj.miliseconds) > SIXTY_SECONDS) {
      return acc
    }
    return acc + obj.count
  }, 0)


  console.log(totalCount)

  

  // const currentCount = data.reduce(obj => obj.count, 0)

  // if (currentCount >= 1) {
  //   const payload = { status: 500, message: "You're throttled!" }

  //   increaseCount(ipAddress)
  //   decreaseCount(ipAddress);

  //   return res.json(payload);
  // }

  // if (currentCount === null) {
  //   ipAddresses[ipAddress] = 1
  // } else {
  //   ipAddresses[ipAddress] ++
  // }

  // decreaseCount(ipAddress);
  // next();
}

// const decreaseCount = (ipAddress) => {
//   setTimeout(() => ipAddresses[ipAddress] --, 2000);
// }

module.exports = rateLimiter;

// Is last entry within the hour block?
// If yes, increase counter by 1
// If not, create a new object
// timestamp shouldnt check
// When adding: filter objects
// Filtering is expensive
// Eviction policy: remove key completely if user hasn't used in last 24h