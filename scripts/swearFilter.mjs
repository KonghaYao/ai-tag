import xlsx from 'xlsx';

const createList = () => {
    const a = xlsx.readFile('./scripts/swearList.csv');
    const sheet = a.Sheets['Sheet1'];
    const json = xlsx.utils.sheet_to_json(sheet);
    return json.map((i) => i.swear);
};

const swearList = createList();

const a = xlsx.readFile('./public/tags.csv', {
    bookType: 'csv',
    cellFormula: false,
    cellHTML: false,
});
const sheet = a.Sheets['Sheet1'];

const json = xlsx.utils.sheet_to_json(sheet);
const list = json.map((i) => {
    try {
        if (typeof i.en === 'string') {
            i.r18 = i.en.split(' ').some((word) => swearList.includes(word)) ? 1 : 0;
        } else {
            // 数值类型，不作为屏蔽词
            i.r18 = 0;
            console.log(i);
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
    return i;
});
a.Sheets['Sheet1'] = xlsx.utils.json_to_sheet(list);
xlsx.writeFile(a, './public/tags.csv', { bookType: 'csv' });
