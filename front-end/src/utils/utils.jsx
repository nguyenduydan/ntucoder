import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi'); // Đặt ngôn ngữ toàn cục là tiếng Việt

// ------------------------ //
export const toSlug = (str) => {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
};

export const getLuminance = (hex) => {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const formatCurrency = (amount) =>
    amount
        ? new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount)
        : "0 VND";

export const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).tz('Asia/Ho_Chi_Minh').format("DD/MM/YYYY HH:mm:ss");
};

export const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).tz('Asia/Ho_Chi_Minh').format("DD/MM/YYYY");
};

export const formatRelativeTime = (dateString) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).fromNow(); // Sẽ trả về: "9 tiếng trước"
};

export const formatNumber = (number) =>
    new Intl.NumberFormat("vi-VN").format(number);

// ------------------------ //
export const easeInExpo = (t) =>
    t === 0 ? 0 : Math.pow(2, 10 * (t - 1));

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

// ------------------------ //
export function validatePassword(password) {
    if (!password) return "Mật khẩu không thể bỏ trống.";
    if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";
    if (!/[A-Z]/.test(password)) return "Mật khẩu phải có ít nhất một chữ cái in hoa.";
    if (!/[a-z]/.test(password)) return "Mật khẩu phải có ít nhất một chữ cái thường.";
    if (!/[0-9]/.test(password)) return "Mật khẩu phải có ít nhất một chữ số.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Mật khẩu phải có ít nhất một ký tự đặc biệt.";
    return "";
}

export const validateInputs = (inputs) => {
    const errors = {};

    Object.keys(inputs).forEach((key) => {
        const value = inputs[key];
        if (typeof value === "string" && !value.trim()) {
            errors[key] = "Không được bỏ trống.";
        } else if (value === null || value === undefined) {
            errors[key] = "Không được bỏ trống.";
        }
    });

    if (inputs.coderEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.coderEmail)) {
        errors.coderEmail = "Email không hợp lệ.";
    }

    if (inputs.coderName && !/^[^\d]+$/.test(inputs.coderName)) {
        errors.coderName = "Họ và tên không được chứa số.";
    }

    if (inputs.phoneNumber && !/^\d{10}$/.test(inputs.phoneNumber)) {
        errors.phoneNumber = "Số điện thoại phải có đúng 10 chữ số.";
    }

    if (inputs.password && inputs.password.length < 6) {
        errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (inputs.role !== undefined && (isNaN(inputs.role) || inputs.role === 0)) {
        errors.role = "Vui lòng chọn vai trò.";
    }

    return errors;
};

export const parseBackendErrors = (errorResponse) => {
    const messages = [];

    if (errorResponse?.errors) {
        for (const field in errorResponse.errors) {
            errorResponse.errors[field].forEach(msg => {
                messages.push(`${field}: ${msg}`);
            });
        }
    }

    return messages;
};

export const getCacheBustedUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("data:")) return url;
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${Date.now()}`;
};

export const maskEmail = (email) => {
    if (!email) return "";
    const [user, domain] = email.split("@");
    if (!user || !domain) return email;
    return user.length > 3
        ? `${user.slice(0, 3)}***@${domain}`
        : `***@${domain}`;
};

export const getMonacoLanguage = (compilerID) => {
    switch (compilerID) {
        case '.cpp': return 'cpp';
        case '.python':
        case '.py': return 'python';
        case '.java': return 'java';
        case '.js':
        case '.javascript': return 'javascript';
        case '.csharp':
        case '.cs': return 'csharp';
        default: return 'plaintext';
    }
};
