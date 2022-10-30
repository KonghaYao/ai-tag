import Fuse from 'fuse.js';
import fs from 'fs';
const myIndex = Fuse.createIndex(['title', 'author.firstName'], books);
// Serialize and save it
fs.writeFile('fuse-index.json', JSON.stringify(myIndex.toJSON()));
