import { useContext } from 'solid-js';
import { Data } from '../../App';
import { Notice } from '../../utils/notice';
import { useTranslation } from '../../../i18n';
import { FloatPanelWithAnimate } from '@cn-ui/core';
import { CheckBox } from './CopyBtn';

export const ToolBox = () => {
    const {
        enMode,
        usersCollection,
        emphasizeSymbol,
        iconBtn,
        redo,
        undo,
        visibleId,
        showLangInLine1,
    } = useContext(Data);

    const { t } = useTranslation();
    return (
        <FloatPanelWithAnimate
            animateProps={{
                extraClass: 'animate-duration-300',
                anime: 'scale',
            }}
            popup={() => (
                <div class="blur-background pointer-events-auto flex flex-col gap-2 rounded-md p-2">
                    {/* 中英文切换符号 */}
                    <span class="btn bg-blue-700 text-sm" onclick={() => enMode((i) => !i)}>
                        {iconBtn()
                            ? t('toolbar1.' + (enMode() ? 'en' : 'zh'))[0]
                            : t('toolbar1.' + (enMode() ? 'en' : 'zh'))}
                    </span>
                    <span class="btn flex-none" onclick={() => showLangInLine1((i) => !i)}>
                        <CheckBox value={showLangInLine1}></CheckBox>
                        {t('toolbar1.showLang')}
                    </span>
                    {/* 强调括号更换 */}
                    <span
                        class="btn  bg-indigo-700   text-sm "
                        onClick={() => {
                            emphasizeSymbol((i) => (i === '{}' ? '()' : '{}'));
                            Notice.success(t('toolbar1.hint.bracketsChange'));
                        }}
                    >
                        {emphasizeSymbol().split('').join(' ')}
                    </span>
                    {/* 清空所有 TAG  */}
                    <span
                        class="btn  bg-violet-700 text-sm "
                        onClick={() => {
                            globalThis.confirm('清空所有 TAG') && usersCollection([]);
                        }}
                    >
                        清空所有 TAG
                    </span>
                    <span class="btn  bg-purple-700 text-sm " onClick={() => undo()}>
                        撤销
                    </span>
                    {/* 清空所有 TAG  */}
                    <span class="btn  bg-fuchsia-700 text-sm " onClick={() => redo()}>
                        重做
                    </span>
                    <span class="btn bg-sky-700" onclick={() => visibleId('artist')}>
                        {iconBtn() ? 'upload' : '艺术家列表'}
                    </span>
                </div>
            )}
        >
            <div class="font-icon btn m-0 h-full w-full bg-indigo-700">build</div>
        </FloatPanelWithAnimate>
    );
};
