import qs from 'qs';
import type { ITagData } from '../app/main/App';
import { AV } from './cloud';
import { loadTags, searchTags as localSearchTags } from '../components/LocalSearch';

/** 所有的 Tags 操作聚合到这里 */
export class TagAPI {
    /** 搜索 Tags 的接口，请勿乱用 */
    static async searchTags(q: string, r18Mode = false) {
        await loadTags(); // 确保本地标签数据已加载
        const results = await localSearchTags(q, r18Mode);
        return results as ITagData[];
    }
    /** /tags/change 页面的 Tag 修改 */
    static uploadTag(tag: ITagData & { delete: boolean }) {
        const it = new AV.Object('tags');
        Object.entries(tag).forEach(([key, value]) => {
            it.set(key, value);
        });
        return it.save();
    }
}
