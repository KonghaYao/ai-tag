import AV from 'leancloud-storage';
import { CommentObject } from './CommentList';
export const useCommitComment = () => {
    // setting access
    let getAcl = () => {
        let acl = new AV.ACL();
        acl.setPublicReadAccess(!0);
        acl.setPublicWriteAccess(!1);
        return acl;
    };
    let commit = (info: { url: string; comment: string; nick: string }, atData?: CommentObject) => {
        // 声明类型
        let Comment = AV.Object.extend('Comment');
        // 新建对象
        let comment = new Comment();
        comment.set('url', info.url);
        comment.set('insertedAt', new Date());
        if (atData) {
            comment.set('rid', atData.attributes['rid'] || atData.id);
            comment.set('pid', atData.id);
        }
        comment.set('comment', info.comment);
        comment.set('nick', info.nick);

        comment.setACL(getAcl());
        return comment.save();
    };
    return { commit };
};
