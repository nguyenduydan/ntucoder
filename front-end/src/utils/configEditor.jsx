const editorConfig = {
    buttons: [
        'bold', 'italic', 'underline', 'strikethrough', 'ul', 'ol',
        'image', 'video', 'link', 'align', 'justify', 'source', 'clean',
    ],
    uploader: {
        insertImageAsBase64URI: true, // Chèn ảnh dưới dạng Base64
    },
    // Cấu hình cho phép chèn video
    video: {
        // Tùy chỉnh các cài đặt video nếu cần
        url: true, // Cho phép nhập URL video
    },
    min_height: 350,
    width: 'auto',
    placeholder: 'Nhập nội dung tại đây...',
    theme: 'default',

};

export default editorConfig;
