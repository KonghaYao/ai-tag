import { InputArea } from './InputArea';
import { CommentList } from './CommentList';
import { GlobalData } from '../../store/GlobalData';
export const TalkDefault = () => {
    const store = GlobalData.getApp('talk');

    return (
        <section class="flex flex-col border-slate-500" ref={store.scrollContainer}>
            <InputArea></InputArea>
            <CommentList></CommentList>
        </section>
    );
};
