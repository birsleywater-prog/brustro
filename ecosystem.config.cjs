module.exports = {
    apps: [
        {
            name: 'brisley',
            script: 'build/index.js',
            env: {
                NODE_ENV: 'production',
                PORT: 3000
            }
        }
    ]
};
