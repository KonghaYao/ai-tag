import { Notice } from '../../utils/notice';
import type { PromptGPT } from '../prompt-gpt';

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
const createResultRecord = (funcType: string, final: string) => {
    const { username } = GlobalData.getApp('data');
    const record = new AV.Object('gpt_record');
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
            createResultRecord(memberName, result);
            return result;
        },
    };
};
