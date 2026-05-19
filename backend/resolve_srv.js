const dns = require('dns');
dns.setServers(['8.8.8.8']);
dns.resolveSrv('_mongodb._tcp.courserec.pvrw3b2.mongodb.net', (err, addresses) => {
  if (err) console.error(err);
  else {
    const hosts = addresses.map(a => `${a.name}:${a.port}`).join(',');
    console.log(`mongodb://${hosts}/courserec?ssl=true&replicaSet=atlas-xxx-shard-0&authSource=admin&retryWrites=true&w=majority`);
  }
});
