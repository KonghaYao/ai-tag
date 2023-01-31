import fs from 'fs';
const item = fs.readFileSync('./public/font.css', 'utf-8');
const defaultPath = '@chinese-fonts/jxzk@1.1.0/dist/江西拙楷/';
const list = ['https://esm.sh/', 'https://unpkg.com/'].map((i) => i + defaultPath);
let count = 0;
const newText = item.replace(/url\(['"](.*?)['"]\)/g, (item, it) => {
    count++;
    const base = list[count % list.length];
    console.log(base, count);
    return `url('${new URL(it, base)}')`;
});
fs.writeFileSync('./public/font.test.css', newText);
