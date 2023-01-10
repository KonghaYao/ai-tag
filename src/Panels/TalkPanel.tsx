import { Panel } from '../components/Panel';

import './TalkPanel.css';
import { TalkDefault } from '../Talk';
import { useContext } from 'solid-js';
import { Data } from '../App';
export const TalkPanel = () => {
    const { username } = useContext(Data);
    return (
        <Panel id="talk">
            <div class="w-full flex-1 overflow-auto p-2">
                {/* <Comp></Comp> */}
                <TalkDefault
                    {...{
                        appId: 'mnyUPAL9vkRPOc9skLlWxupw-gzGzoHsz',
                        appKey: 'SanjNh0jdz4fP1dS0Bc1Inrf',
                        serverURLs: 'https://mnyupal9.lc-cn-n1-shared.com',
                        defaultUserName: username(),
                    }}
                ></TalkDefault>
            </div>
        </Panel>
    );
};
