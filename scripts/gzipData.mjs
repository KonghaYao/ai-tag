// 文件：gzip.js
import { createGzip } from 'zlib';
import { createReadStream, createWriteStream } from 'fs';
import { join } from 'path';

// 压缩
function gzip(source) {
    // 处理输入和输出的文件路径
    let gzipPath = `${source}.gz`;

    // 创建转化流
    let gzip = createGzip();

    // 创建可读流
    let rs = createReadStream(source);

    // 创建可写流
    let ws = createWriteStream(gzipPath);

    // 实现转化
    rs.pipe(gzip).pipe(ws);
}

gzip('./dist/tags.csv');
