import { Notice } from '../../utils/notice';
import type { PromptGPT } from '../prompt-gpt';

export const needToken = <B>(
    target: PromptGPT,
    memberName: B,
    propertyDescriptor: PropertyDescriptor
) => {
    return {
        value: (...args: any[]) => {
            console.log(target.ownKey);
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
