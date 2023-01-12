/** 上传文件到暂存网站，便于两个设备间进行数据交互, 大小限制 20MB */
export const FileUpload = (file: Blob) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('lifetime', '24');
    return fetch('https://safenote.co/api/file', {
        method: 'post',
        body: fd,
    });
};
