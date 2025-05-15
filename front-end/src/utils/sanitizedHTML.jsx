import DOMPurify from "dompurify";

const sanitizeHtml = (html) => {
    const ALLOWED_TAGS = [
        'a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body',
        'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div',
        'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr',
        'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'meter',
        'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp',
        'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template',
        'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'
    ];
    const ALLOWED_ATTR = [
        'href', 'src', 'alt', 'title', 'style', 'class', 'id', 'width', 'height', 'controls', 'frameborder', 'allowfullscreen', 'target', 'rel',
        'type', 'name', 'value', 'placeholder', 'maxlength', 'rows', 'cols', 'disabled', 'checked', 'readonly', 'required', 'pattern', 'min', 'max',
        'step', 'autoplay', 'loop', 'muted', 'poster', 'download', 'crossorigin', 'referrerpolicy', 'data', 'srcset', 'sizes', 'aria-*', 'role', 'tabindex'
    ];

    return DOMPurify.sanitize(html || "Chưa có thông tin", {
        ALLOWED_TAGS: ALLOWED_TAGS,  // Cho phép tất cả các thẻ HTML đã liệt kê
        ALLOWED_ATTR: ALLOWED_ATTR   // Cho phép tất cả các thuộc tính đã liệt kê
    });
};

export default sanitizeHtml;

