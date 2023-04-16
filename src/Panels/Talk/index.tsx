import { InputArea } from './InputArea';
import { CommentList } from './CommentList';
import { GlobalData } from '../../store/GlobalData';
import { ActiveUser } from '../../components/ActiveUser';
export const TalkDefault = () => {
    const store = GlobalData.getApp('talk');

    return (
        <section class="flex flex-col border-slate-500" ref={store.scrollContainer}>
            <ActiveUser></ActiveUser>
            <InputArea></InputArea>
            <CommentList></CommentList>
        </section>
    );
};
