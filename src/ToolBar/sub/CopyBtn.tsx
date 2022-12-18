import copy from 'copy-to-clipboard';
import { useContext } from 'solid-js';
import { useTranslation } from '../../../i18n';
import { Data } from '../../App';
import { DragPoster } from '@cn-ui/headless';
import { TagsToString } from '../../use/TagsConvertor';
import { Notice } from '../../utils/notice';
import { FloatPanel } from '../../components/FloatPanel';

export function CopyBtn() {
    const { enMode, usersCollection, emphasizeSymbol, iconBtn } = useContext(Data);
    const { t } = useTranslation();
    const getTagString = () => {
        return TagsToString(
            usersCollection().map((i) => {
                // 中英文模式下的不同修改
                if (enMode()) {
                    return i;
                } else {
                    return { ...i, text: i.cn };
                }
            }),
            emphasizeSymbol()
        );
    };
    return (
        <FloatPanel
            popup={
                <div class="flex w-24 flex-col">
                    <span
                        class="btn flex-none"
                        onclick={() => {
                            copy(getTagString().replace('\n', ''));
                            Notice.success(t('toolbar2.hint.copy'));
                        }}
                    >
                        {iconBtn() ? 'copy' : t('toolbar2.copyWithoutBreak')}
                    </span>
                </div>
            }
        >
            <DragPoster
                send={(send) => send('PURE_TAGS', getTagString())}
                text={() => getTagString()}
            >
                <span
                    class="btn"
                    onclick={() => {
                        copy(getTagString());
                        Notice.success(t('toolbar2.hint.copy'));
                    }}
                    title={t('toolbar2.hint.copy_drag')}
                >
                    {iconBtn() ? 'copy' : t('toolbar2.copy')}
                </span>
            </DragPoster>
        </FloatPanel>
    );
}
