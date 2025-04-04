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
