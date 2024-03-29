import './TalkPanel.css';
import { TalkDefault } from './Talk';
import { initTalkStore } from './Talk/TalkStore';
export const TalkPanel = () => {
    initTalkStore();
    return (
        <div class="w-full flex-1 overflow-auto p-2">
            {/* <Comp></Comp> */}
            <TalkDefault></TalkDefault>
        </div>
    );
};
