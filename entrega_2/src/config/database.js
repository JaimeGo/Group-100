const config = {
  default: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '6o7s6n2o',
    // username: 'postgres',
    // password: '6o7s6n2o',
    dialect: process.env.DB_DIALECT || 'postgres',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || '127.0.0.1',
  },
  development: {
    extend: 'default',
    database: '2513template_dev',
    // database: 'wican_dev',
  },
  test: {
    extend: 'default',
    database: 'wican_test',
  },
  production: {
    extend: 'default',
    database: 'wican_production',
  },
};

Object.keys(config).forEach((configKey) => {
  const configValue = config[configKey];
  if (configValue.extend) {
    config[configKey] = Object.assign({}, config[configValue.extend], configValue);
  }
});

module.exports = config;
