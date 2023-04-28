import { onMount } from 'solid-js';

/**@ts-ignore */
export const loadCharts = () => import('https://esm.sh/@antv/g2plot');

export const Line = function <T>(props: { data: T[]; x: keyof T; y: keyof T }) {
    let container: HTMLDivElement;
    onMount(async () => {
        const { Line } = await loadCharts();

        const line = new Line(container, {
            data: props.data,
            xField: props.x,
            yField: props.y,
        });

        line.render();
    });
    return <div class="m-auto max-w-lg p-4" ref={container!}></div>;
};
