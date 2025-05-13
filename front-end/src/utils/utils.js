import moment from "moment";

export const toSlug = (str) => {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
        .replace(/[^a-z0-9\s-]/g, "") // Xóa ký tự đặc biệt
        .trim()
        .replace(/\s+/g, "-"); // Thay khoảng trắng bằng dấu gạch ngang
};

export const getLuminance = (hex) => {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};


export const formatCurrency = (amount) => amount ?
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount) : "0 VND";

export const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return moment(dateString).locale("vi").format("DD/MM/YYYY HH:mm:ss");
};

export const formatNumber = (number) => new Intl.NumberFormat("vi-VN").format(number);

export const easeInExpo = (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1)));

/**
 * Hàm cập nhật progress với easing
 * @param {Function} setProgress - Hàm setState để cập nhật UI
 * @param {number} duration - Thời gian chạy thanh loading (ms)
 * @returns {Promise<void>} - Trả về Promise khi progress đạt 100%
 */
export const animateProgress = (setProgress, duration = 1000) => {
    return new Promise((resolve) => {
        const startTime = performance.now();

        const updateProgress = () => {
            const elapsedTime = performance.now() - startTime;
            const normalizedTime = Math.min(elapsedTime / duration, 1);
            const progressValue = easeInExpo(normalizedTime) * 100;

            setProgress(progressValue);

            if (progressValue < 100) {
                requestAnimationFrame(updateProgress);
            } else {
                resolve();
            }
        };

        requestAnimationFrame(updateProgress);
    });
};


// validate password
export function validatePassword(password) {
    if (!password) {
        return "Mật khẩu không thể bỏ trống.";
    }
    if (password.length < 6) {
        return "Mật khẩu phải có ít nhất 6 ký tự.";
    }
    if (!/[A-Z]/.test(password)) {
        return "Mật khẩu phải có ít nhất một chữ cái in hoa.";
    }
    if (!/[a-z]/.test(password)) {
        return "Mật khẩu phải có ít nhất một chữ cái thường.";
    }
    if (!/[0-9]/.test(password)) {
        return "Mật khẩu phải có ít nhất một chữ số.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return "Mật khẩu phải có ít nhất một ký tự đặc biệt.";
    }
    return ""; // Mật khẩu hợp lệ
}
