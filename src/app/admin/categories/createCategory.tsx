import { AV } from '../../../api/cloud';

export const createCategory = (name: string) => {
    const data = new AV.Object('gallery_category');
    data.set('categories', name);
    return data;
};
