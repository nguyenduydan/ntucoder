// src/api/coderService.js
import api from "./apiConfig";

/**
 * Lấy danh sách Category với phân trang, sắp xếp.
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
        const response = await api.get("/Category", {
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
        console.error("Error fetching Category data:", error);
        throw error;
    }
};

/**
 * Lấy thông tin Category theo id.
 *
 * @param {string|number} id - ID của Category.
 * @returns {Promise<Object>} - Dữ liệu của Category.
 */
export const getById = async (id) => {
    try {
        const response = await api.get(`/Category/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Category by id:", error);
        throw error;
    }
};

/**
 * Gửi yêu cầu tạo mới người dùng (Category).
 *
 * @param {Object} coderData - Dữ liệu người dùng cần tạo.
 * @returns {Promise<Object>} - Dữ liệu phản hồi từ API.
 */
export const create = async (coderData) => {
    try {
        const response = await api.post('/Category', coderData);
        return response.data;
    } catch (error) {
        console.error('Error creating Category:', error);
        throw error;
    }
};

/**
 * Cập nhật thông tin Category.
 *
 * @param {string|number} id - ID của Category cần cập nhật.
 * @param {Object} updateData - Dữ liệu cập nhật.
 * @returns {Promise<Object>} - Dữ liệu của Category sau khi cập nhật.
 */
export const update = async (id, updateData) => {
    try {
        const response = await api.put(`/Category/${id}/`, updateData, {
            headers: {
                "Content-Type": "multipart/form-data",  // Đảm bảo gửi dưới dạng form-data
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating Category:", error);
        throw error;
    }
};

/**
 * Xóa Category theo id.
 *
 * @param {Object} params - Các tham số cần thiết.
 * @param {string|number} params.id - ID của Category cần xóa.
 * @param {string|function} [params.deleteEndpoint] - Endpoint tùy chỉnh. Nếu là function, nó sẽ được gọi với tham số row.
 * @param {Object} [params.row] - Dữ liệu row, được truyền vào nếu deleteEndpoint là function.
 * @returns {Promise<Object>} - Kết quả xóa.
 */
export const deleteCategory = async ({ id }) => {
    if (!id) {
        console.error("LỖI: ID không hợp lệ!", id);
        return;
    }

    const endpoint = `/Category/${id}`;

    try {
        const response = await api.delete(endpoint);
        return response.data;
    } catch (error) {
        console.error("Error deleting:", error.response?.data || error.message);
        throw error;
    }
};
