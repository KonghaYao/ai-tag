import { useContext } from 'solid-js';
import { Data } from '../../app/main/App';
import { Notice } from '../../utils/notice';
import { useTranslation } from '../../../i18n';
import { FloatPanelWithAnimate } from '@cn-ui/core';
import { CheckBox } from './CheckBox';
import { ToolBarColor } from '../ColorJar';

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
    } = GlobalData.getApp('data');

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

                    <span
                        class={'btn text-sm ' + ToolBarColor.pick(8)}
                        onclick={() => enMode((i) => !i)}
                    >
                        {iconBtn()
                            ? t('toolbar1.' + (enMode() ? 'en' : 'zh'))[0]
                            : t('toolbar1.' + (enMode() ? 'en' : 'zh'))}
                    </span>

                    <CheckBox class={'' + ToolBarColor.pick(9)} value={showLangInLine1}>
                        {t('toolbar1.showLang')}
                    </CheckBox>

                    {/* 强调括号更换 */}
                    <span
                        class={'btn text-sm ' + ToolBarColor.pick(10)}
                        onClick={() => {
                            emphasizeSymbol((i) => (i === '{}' ? '()' : '{}'));
                            Notice.success(t('toolbar1.hint.bracketsChange'));
                        }}
                    >
                        {emphasizeSymbol().split('').join(' ')}
                    </span>
                    {/* 清空所有 TAG  */}
                    <span
                        class={'btn text-sm ' + ToolBarColor.pick()}
                        onClick={() => {
                            globalThis.confirm('清空所有 TAG') && usersCollection([]);
                        }}
                    >
                        清空所有 TAG
                    </span>
                    <span class={'btn text-sm ' + ToolBarColor.pick()} onClick={() => undo()}>
                        撤销
                    </span>
                    {/* 清空所有 TAG  */}
                    <span class={'btn text-sm ' + ToolBarColor.pick()} onClick={() => redo()}>
                        重做
                    </span>
                    <span
                        class={'btn text-sm ' + ToolBarColor.pick()}
                        onclick={() => visibleId('artist')}
                    >
                        {iconBtn() ? 'upload' : '艺术家列表'}
                    </span>
                </div>
            )}
        >
            <div class={'font-icon btn m-0 h-full w-full ' + ToolBarColor.pick()}>build</div>
        </FloatPanelWithAnimate>
    );
};
