console.log('using postcss config');
module.exports = {
    purge: ['./{src,story,package}/**/*.{ts,tsx}'],
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
};
