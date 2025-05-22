module.exports = {
    apps: [{
        name: 'capstone-portal',
        script: 'server.js',
        watch: true,
        // exec_mode: 'cluster',
        // instances: 'max',
        env: {
            NODE_ENV: 'development',
            APP_HOSTNAME: 'localhost',
            APP_PORT: 3000,
        },
        env_production: {
            NODE_ENV: 'production',
            APP_HOSTNAME: '0.0.0.0',
            // APP_PORT: 12345,
        }
    }]
};

// pm2 start ecosystem.config.js --env production