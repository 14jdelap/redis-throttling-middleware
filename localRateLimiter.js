/*
Problem: deny a request if the client has made more than 100 requests in the last 20 minutes

Assumption
- Client is the same if the IP address is the same

IP Address: parse

1. Find IP Address: req.ip -> from (req, res, next)
2. Keep track of requests per IP Address
3. Deny access to addresses with 100 requests
4. 20m after a request's made, decrease by 1 || after 20 minutes set to 0 -> sliding window vs static window — SLIDING WINDOW

app.use(rateMiddleware)

Make sure routes returns the string you want

"Keep track of requests per IP Address"
- Global hash that we store in-memory
- JSON file we read and write to: local db
-> Start with global hash, if time implement via JSON read/write

*/

const ipAddresses = {}

const rateLimiter = (req, res, next) => {
  const ipAddress = req.ip;

  if (ipAddresses[ipAddress] >= 1) {
    const payload = { status: 500, message: "You're throttled!" }

    ipAddresses[ipAddress] ++;
    decreaseCount(ipAddress);

    return res.json(payload);
  }

  if (ipAddresses[ipAddress] === undefined) {
    ipAddresses[ipAddress] = 1
  } else {
    ipAddresses[ipAddress] ++
  }

  decreaseCount(ipAddress);
  next();
}

const decreaseCount = (ipAddress) => {
  setTimeout(() => ipAddresses[ipAddress] --, 2000);
}

module.exports = rateLimiter;

// Is last entry within the hour block?
// If yes, increase counter by 1
// If not, create a new object
// timestamp shouldnt check
// When adding: filter objects
// Filtering is expensive
// Eviction policy: remove key completely if user hasn't used in last 24h