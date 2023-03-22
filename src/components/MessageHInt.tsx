import { Animate } from '@cn-ui/animate';
import { reflect } from '@cn-ui/use';
import { debounce } from 'lodash-es';
import { createStore } from 'solid-js/store';

const [MessageStore, set] = createStore({
    visible: false,
    hint: '测试信息',
    color: '',
});
export const Message = {
    total(info: string) {
        set('hint', info);
        set('visible', true);
    },
    success(info: string) {
        this.total(info);
        this.close();
        set('color', 'bg-green-600');
    },

    info(info: string) {
        this.total(info);
        this.close();
        set('color', 'bg-blue-600');
    },

    warn(info: string) {
        this.total(info);
        set('color', 'bg-yellow-600');
        this.close();
    },
    close: debounce(() => {
        set('visible', false);
    }, 1000),
};
export const MessageHint = () => {
    const visible = reflect(() => MessageStore.visible);
    return (
        <section class="pointer-events-none fixed top-5 left-0 z-50 flex h-fit w-full justify-center text-center">
            <Animate anime="jumpFromBottom" trigger={visible}>
                <div
                    classList={{
                        [MessageStore.color || 'bg-green-600']: true,
                    }}
                    class="w-64 rounded-lg  text-white  transition-transform duration-300"
                >
                    {MessageStore.hint}
                </div>
            </Animate>
        </section>
    );
};
