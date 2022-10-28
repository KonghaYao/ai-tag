import { useContext } from 'solid-js';
import { Data } from '../App';
import { Panel } from '../components/Panel';

export const HomePanel = () => {
    const { isPanelVisible, r18Mode, visibleId, lists, usersCollection } = useContext(Data);

    return (
        <Panel id="">
            <header class="w-full border-b-4 border-gray-800 py-2 text-center">
                Side APP 功能测试
            </header>
            <p class="indent-2">
                Side APP
                功能是微模块（非微前端）技术测试实践，采用多种方式复合资源模块，现在正在测试中。
            </p>
        </Panel>
    );
};
