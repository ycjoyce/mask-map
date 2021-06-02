module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
    ? '/mask-map/'
    : '/',
    pages: {
        index: {
            entry: './src/main.js',
            title: '口罩即時查',
        },
    },
};