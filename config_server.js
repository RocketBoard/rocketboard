var configServer = {};

configServer.clientId = process.env.PX_CLIENT_ID;
configServer.clientSecret = process.env.PX_CLIENT_SECRET;
configServer.redisUrl = process.env.REDISCLOUD_URL || 'http://localhost:36379'


module.exports = configServer;