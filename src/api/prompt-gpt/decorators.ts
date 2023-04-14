import { Notice } from '../../utils/notice';
import type { PromptGPT } from '../prompt-gpt';

/** 检查输入不为空 */
export const checkInput = <B>(target: PromptGPT, _: B, propertyDescriptor: PropertyDescriptor) => {
    return {
        value: (...args: any[]) => {
            if (args[0].trim() === '') {
                const reason = '💢请输入文本';
                Notice.error(reason);
                return Promise.reject(new Error(reason));
            } else {
                return propertyDescriptor.value.apply(target, args);
            }
        },
    };
};

/** 检查全局是否放置 token */
export const needToken = <B>(
    target: PromptGPT,
    memberName: B,
    propertyDescriptor: PropertyDescriptor
) => {
    return {
        value: (...args: any[]) => {
            if (!target.ownKey) {
                const reason = '💢这个功能需要使用自己的 Token';
                Notice.error(reason);
                return Promise.reject(new Error(reason));
            } else {
                return propertyDescriptor.value.apply(target, args);
            }
        },
    };
};
import { AV } from '../cloud';
import { GlobalData } from '../../store/GlobalData';
const createResultRecord = (input: string, funcType: string, final: string) => {
    const { username } = GlobalData.getApp('data');
    const record = new AV.Object('gpt_record');
    record.set('input', input);
    record.set('func', funcType);
    record.set('result', final);
    record.set('user', username());
    return record.save();
};

export const UploadResult = <B extends string>(
    target: PromptGPT,
    memberName: B,
    propertyDescriptor: PropertyDescriptor
) => {
    return {
        value: async (...args: any[]) => {
            const result = await propertyDescriptor.value.apply(target, args);
            // console.log(memberName, result);
            createResultRecord(args[0], memberName, result);
            return result;
        },
    };
};
