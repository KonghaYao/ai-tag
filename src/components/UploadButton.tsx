import { Component, JSX, JSXElement } from 'solid-js';

export const UploadButton: Component<
    {
        children: JSXElement;
        onUpload: (file: FileList) => void;
    } & JSX.InputHTMLAttributes<HTMLInputElement>
> = (props) => {
    let input: HTMLInputElement;
    return (
        <>
            <button
                class="btn"
                onClick={() => {
                    input.click();
                }}
            >
                {props.children}
            </button>
            <input
                {...props}
                ref={input}
                class="hidden"
                type="file"
                onChange={(e) => {
                    const data = (e.target as any).files;

                    props.onUpload(data);
                }}
            ></input>
        </>
    );
};
