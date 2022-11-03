const decode = (val: string) => {
    if (val.startsWith('=')) {
        return { type: 'equals', val: val.slice(1) };
    } else if (val.startsWith('!=')) {
        return { type: 'does_not_equal', val: val.slice(2) };
    } else if (val[0] === '!') {
        return {
            type: 'does_not_contain',
            val: val.slice(1),
        };
    } else {
        return {
            type: 'contains',
            val: val,
        };
    }
};
/**
 * 搜索语法详解
 * username:=江夏尧 origin_tags:masterpiece 中文搜索
 */
export const searchDecode = (text: string = '') => {
    let [_, props, mainText] = (text + ' ').match(/(.+:\S+\s)*\s*(.*)/);
    props && (props = props.trim());
    let data: { props: string; type: string; val: string }[] = [];
    if (props) {
        data = props.split(' ').map((i) => {
            const [name, val] = i.split(':');

            return {
                props: name,
                ...decode(val),
            };
        });
    }
    return {
        mainText: mainText.trim(),
        data,
    };
};

/** Notion 搜索 filter  */
export const notionSearch = (text: string = '', allowProps: string[] = []) => {
    if (!text) return [];
    const { mainText, data } = searchDecode(text);

    return [
        {
            property: 'description',
            rich_text: {
                contains: mainText,
            },
        },
        ...data
            .filter((i) => {
                return allowProps.includes(i.props);
            })
            .map((i) => {
                const tag = i.props === 'username' ? 'title' : 'rich_text';
                return {
                    property: i.props,
                    [tag]: {
                        [i.type]: i.val,
                    },
                };
            }),
    ];
};
