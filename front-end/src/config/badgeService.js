// src/api/badgeService.js
import api from "./apiConfig";

/**
 * Lấy danh sách badge với phân trang, sắp xếp.
 *
 * @param {Object} params - Các tham số query.
 * @param {number} params.page - Số trang cần lấy.
 * @param {number} params.pageSize - Số dòng mỗi trang.
 * @param {boolean} params.ascending - Thứ tự sắp xếp.
 * @param {string} params.sortField - Trường sắp xếp.
 * @returns {Promise<Object>} - Chứa data, totalPages và totalCount.
 */

export const getList = async ({ page, pageSize, ascending, sortField, totalCount }) => {
    const dynamicTimeout = (totalCount - pageSize + 1) * 1000;
    try {
        const response = await api.get("/badge", {
            params: {
                Page: page,
                PageSize: pageSize,
                ascending,
                sortField,
            },
            timeout: dynamicTimeout
        });
        const dataWithStatus = Array.isArray(response.data.data)
            ? response.data.data.map(item => ({ ...item, status: true }))
            : [];
        return {
            data: dataWithStatus,
            totalPages: response.data.totalPages || 0,
            totalCount: response.data.totalCount || 0,
        };
    } catch (error) {
        console.error("Error fetching badge data:", error);
        throw error;
    }
};

/**
 * Lấy thông tin badge theo id.
 *
 * @param {string|number} id - ID của badge.
 * @returns {Promise<Object>} - Dữ liệu của badge.
 */
export const getById = async (id) => {
    try {
        const response = await api.get(`/badge/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching badge by id:", error);
        throw error;
    }
};

/**
 * Gửi yêu cầu tạo mới người dùng (badge).
 *
 * @param {Object} badgeData - Dữ liệu người dùng cần tạo.
 * @returns {Promise<Object>} - Dữ liệu phản hồi từ API.
 */
export const create = async (badgeData) => {
    try {
        const response = await api.post('/badge', badgeData);
        return response.data;
    } catch (error) {
        console.error('Error creating badge:', error);
        throw error;
    }
};

/**
 * Cập nhật thông tin badge.
 *
 * @param {string|number} id - ID của badge cần cập nhật.
 * @param {Object} updateData - Dữ liệu cập nhật.
 * @returns {Promise<Object>} - Dữ liệu của badge sau khi cập nhật.
 */
export const update = async (id, updateData) => {
    try {
        const response = await api.put(`/badge/${id}/`, updateData, {
            headers: {
                "Content-Type": "multipart/form-data",  // Đảm bảo gửi dưới dạng form-data
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating badge:", error);
        throw error;
    }
};

/**
 * Xóa badge theo id.
 *
 * @param {Object} params - Các tham số cần thiết.
 * @param {string|number} params.id - ID của badge cần xóa.
 * @param {string|function} [params.deleteEndpoint] - Endpoint tùy chỉnh. Nếu là function, nó sẽ được gọi với tham số row.
 * @param {Object} [params.row] - Dữ liệu row, được truyền vào nếu deleteEndpoint là function.
 * @returns {Promise<Object>} - Kết quả xóa.
 */
export const deletebadge = async ({ id, deleteEndpoint, row }) => {
    // Xây dựng endpoint dựa trên deleteEndpoint nếu có
    const endpoint = deleteEndpoint
        ? typeof deleteEndpoint === 'function'
            ? deleteEndpoint(row)
            : deleteEndpoint
        : `/badge/${id}`; // Mặc định là /badge/:id (RESTful)

    try {
        const response = await api.delete(endpoint);
        return response.data;
    } catch (error) {
        console.error("Error deleting badge:", error);
        throw error;
    }
};
