import { describe, it, expect } from 'vitest';
import { stringToTags, TagsToString } from './TagsConvertor';

/**
 *
 * 全测试魔咒 (a), ((b c)), ((((d)))),[g],(e:1.5),[cow|horse],[cow|horse|dog|cat],[mountain:lake:0.25],[in foreground::0.6],[ in foreground:0.6]
 */
describe('魔咒字符串解析', () => {
    it('通用字符串转魔咒测试', () => {
        const data = stringToTags('(a), ((b c)), ((((d)))), [g]');
        expect(data).eql([
            { en: 'a', cn: 'a', count: Infinity, r18: 0, emphasize: 1 },
            { en: 'b c', cn: 'b c', count: Infinity, r18: 0, emphasize: 2 },
            { en: 'd', cn: 'd', count: Infinity, r18: 0, emphasize: 4 },
            { en: 'g', cn: 'g', count: Infinity, r18: 0, emphasize: -1 },
        ]);
    });
    it('SD (tag:number) 数值权重测试', () => {
        const data = stringToTags('(e:1.5)');
        expect(data).eql([
            { en: 'e', cn: 'e', weight: '1.5', count: Infinity, r18: 0, emphasize: 0 },
        ]);
    });
    it('SD [cow|horse] Alternating Words', () => {
        const data = stringToTags('[cow|horse],[cow|horse|dog|cat]');
        expect(data).eql([
            {
                en: 'cow|horse',
                cn: 'cow|horse',
                count: Infinity,
                r18: 0,
                emphasize: 0,
                alternatingArr: ['cow', 'horse'],
            },
            {
                en: 'cow|horse|dog|cat',
                cn: 'cow|horse|dog|cat',
                count: Infinity,
                r18: 0,
                emphasize: 0,
                alternatingArr: ['cow', 'horse', 'dog', 'cat'],
            },
        ]);
    });
    it('SD [from:to:when] Prompt editing', () => {
        const data = stringToTags('[mountain:lake:0.25],[in foreground::0.6],[ in foreground:0.6]');
        expect(data).eql([
            {
                cn: 'mountain:lake:0.25',
                count: Infinity,
                emphasize: 0,
                en: 'mountain:lake:0.25',
                r18: 0,
                weight: '0.25',
                fromTo: ['mountain', 'lake'],
            },
            {
                cn: 'in foreground::0.6',
                count: Infinity,
                emphasize: 0,
                en: 'in foreground::0.6',
                r18: 0,
                weight: '0.6',
                fromTo: ['in foreground', ''],
            },
            {
                cn: 'in foreground:0.6',
                count: Infinity,
                emphasize: 0,
                en: 'in foreground:0.6',
                weight: '0.6',
                r18: 0,
                fromTo: ['', 'in foreground'],
            },
        ]);
    });
    it('不同括号统一', () => {
        const data = stringToTags('(a), ((b c)), ((((d))))');
        const data1 = stringToTags('{a}, {{b c}}, {{{{d}}}}');
        const data2 = stringToTags('（a）, （（b c））, （（（（d））））');
        const data3 = stringToTags('（a）， （（b c））， （（（（d））））');
        expect(data)
            .eql(data1)
            .eql(data2)
            .eql(data3)
            .eql([
                { en: 'a', cn: 'a', count: Infinity, r18: 0, emphasize: 1 },
                { en: 'b c', cn: 'b c', count: Infinity, r18: 0, emphasize: 2 },
                { en: 'd', cn: 'd', count: Infinity, r18: 0, emphasize: 4 },
            ]);
    });
});
describe('魔咒数据转字符串', () => {
    it('通用字符串转魔咒测试', () => {
        const data = stringToTags('(a), ((b c)), ((((d)))), [g]');
        expect(TagsToString(data)).eql('(a),((b c)),((((d)))),[g]');
    });
    it('SD (tag:number) 数值权重测试', () => {
        const data = stringToTags('(e:1.5),(a:0.273)');
        expect(TagsToString(data)).eql('(e:1.5),(a:0.273)');
    });
    it('SD [cow|horse] Alternating Words', () => {
        const data = stringToTags('[cow|horse],[cow|horse|dog|cat]');
        expect(TagsToString(data)).eql('[cow|horse],[cow|horse|dog|cat]');
    });
    it('SD [from:to:when] Prompt editing', () => {
        const data = stringToTags('[mountain:lake:0.25],[in foreground::0.6],[ in foreground:0.6]');
        expect(TagsToString(data)).eql(
            '[mountain:lake:0.25],[in foreground::0.6],[in foreground:0.6]'
        );
    });
});
