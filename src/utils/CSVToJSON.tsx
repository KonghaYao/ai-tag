import Papa from 'papaparse';
// XLSX 有 400 多 K 非常大，所以改为 papaparse
export function CSVToJSON<T>(csv: Blob) {
    return new Promise<T[]>((res) => {
        console.time('加载 csv 文件');
        /**@ts-ignore */
        Papa.parse(csv, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete(results, file) {
                console.timeEnd('加载 csv 文件');
                res(results.data as any);
            },
        });
    });
}
