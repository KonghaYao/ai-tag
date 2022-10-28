import { atom } from '@cn-ui/use';
import { sample } from 'lodash-es';
import { createResource } from 'solid-js';
import { IData } from '../App';
import { PickDataType } from '../Panels/RandomMaker';

export const useRandomMaker = () => {
    const [baseData] = createResource<{
        [key: string]: {
            name: string;
            id: number;
            tags: IData[];
        };
    }>(() =>
        fetch('./tagsClassify.json')
            .then((res) => res.json())
            .then((res) => res.data)
            .then((res) => {
                return res.reduce((col, cur) => {
                    col[cur.name] = cur;
                    cur.tags = cur.tags.map((i) => {
                        return {
                            en: i.name,
                            cn: i.name_cn,
                            count: Infinity,
                            r18: 0,
                            emphasize: 0,
                        } as IData;
                    });

                    return col;
                }, {});
            })
    );

    const pickData = atom<PickDataType[]>([]);
    return {
        baseData,
        pickData,
        addClassify(name: string) {
            if (pickData().find((i) => i.name === name)) return;
            pickData((i) => [...i, { name, tags: atom([sample(baseData()[name].tags)]) }]);
        },
    };
};
