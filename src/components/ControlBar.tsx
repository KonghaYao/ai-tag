import { useContext } from 'solid-js';
import { Data } from '../App';

export const ControlBar = () => {
    const { visibleId } = useContext(Data);
    return (
        <div class="flex h-8 items-center justify-evenly bg-gray-800">
            <button class="btn bg-green-700 text-gray-300" onclick={() => visibleId('feedback')}>
                反馈
            </button>
            <button class="btn bg-amber-700 text-gray-300" onclick={() => visibleId('')}>
                主页
            </button>
            <button class="btn bg-pink-700 text-gray-300" onclick={() => visibleId(null)}>
                关闭
            </button>
        </div>
    );
};
