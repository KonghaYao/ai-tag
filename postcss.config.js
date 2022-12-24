console.log('using postcss config');
module.exports = {
    purge: ['./{src,story,package}/**/*.{ts,tsx,css}'],
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
};
