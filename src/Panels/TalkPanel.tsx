import { Panel } from '../components/Panel';
import './TalkPanel.css';
import { TalkDefault } from './Talk';
import { initTalkStore } from './Talk/TalkStore';
export const TalkPanel = () => {
    initTalkStore();
    return (
        <Panel id="talk">
            <div class="w-full flex-1 overflow-auto p-2">
                {/* <Comp></Comp> */}
                <TalkDefault></TalkDefault>
            </div>
        </Panel>
    );
};
