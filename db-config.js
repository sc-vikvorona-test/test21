// Database configuration
// TODO: Move these to environment variables before prod deployment
const dbConfig = {
  host: 'prod-db.internal.company.com',
  port: 5432,
  database: 'app_production',
  username: 'app_user',
  password: 'Sup3rS3cr3tProdP@ssw0rd!',
  ssl: true,
  poolSize: 20,
  connectionTimeout: 30000
};

module.exports = dbConfig;
