import { describe, it, expect } from 'vitest';
import { stringToTagData } from './stringToTags';

// describe('测试', () => {
//     it('正常括号测试', () => {
//         const info = stringToTagData(
//             'dream,(((extremely detailed, CG unity, 8k wallpaper))),{painting},((detailed flooding bare feet:1.5)),info'
//         );
//         console.log(info);
//     });
// });

describe('测试', () => {
    it('正常括号测试', () => {
        const info = stringToTagData(
            'dream,(((extremely detailed, CG unity, {8k wallpaper}))),{painting},(detailed flooding bare feet:1.5)'
        );
        // console.log(info);
        expect(info).eql([
            { text: 'dream', emphasize: 0 },
            { text: 'extremely detailed', emphasize: 3 },
            { text: 'CG unity', emphasize: 3 },
            { text: '8k wallpaper', emphasize: 4 },
            { text: 'painting', emphasize: 1 },
            { text: 'detailed flooding bare feet:1.5', emphasize: 1 },
        ]);
    });
    it('正常括号测试2', () => {
        const info = stringToTagData('(a), ((b c)), ((((d)))), [g]');
        // console.log(info);
        expect(info).eql([
            { text: 'a', emphasize: 1 },
            { text: 'b c', emphasize: 2 },
            { text: 'd', emphasize: 4 },
            { text: 'g', emphasize: -1 },
        ]);
    });
    it('负向括号获取', () => {
        const info = stringToTagData(',[info],[[black,cursor,delete]]');
        expect(info).eql([
            { text: 'info', emphasize: -1 },
            { text: 'black', emphasize: -2 },
            { text: 'cursor', emphasize: -2 },
            { text: 'delete', emphasize: -2 },
        ]);
    });
    it('重叠括号获取', () => {
        const info = stringToTagData(
            '(music {alpha}),{{music {beta}}},[music {fin}],{{{music} beta}},[[{music} beta]],ganyu (Ganshin Impact),'
        );
        // console.log(info);
        expect(info).eql([
            {
                emphasize: 1,
                text: 'music {alpha}',
            },
            {
                emphasize: 2,
                text: 'music {beta}',
            },
            {
                emphasize: -1,
                text: 'music {fin}',
            },
            {
                emphasize: 2,
                text: '{music} beta',
            },
            {
                emphasize: -2,
                text: '{music} beta',
            },
            {
                emphasize: 0,
                text: 'ganyu (Ganshin Impact)',
            },
        ]);
    });
});
