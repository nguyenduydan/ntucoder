// src/api/coderService.js
import api from "./apiConfig";

/**
 * Lấy danh sách coder với phân trang, sắp xếp.
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
        const response = await api.get("/coder", {
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
        console.error("Error fetching coder data:", error);
        throw error;
    }
};

/**
 * Lấy thông tin coder theo id.
 *
 * @param {string|number} id - ID của coder.
 * @returns {Promise<Object>} - Dữ liệu của coder.
 */
export const getById = async (id) => {
    try {
        const response = await api.get(`/coder/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching coder by id:", error);
        throw error;
    }
};

/**
 * Gửi yêu cầu tạo mới người dùng (coder).
 *
 * @param {Object} coderData - Dữ liệu người dùng cần tạo.
 * @returns {Promise<Object>} - Dữ liệu phản hồi từ API.
 */
export const create = async (coderData) => {
    try {
        const response = await api.post('/coder', coderData);
        return response.data;
    } catch (error) {
        console.error('Error creating coder:', error);
        throw error;
    }
};

/**
 * Cập nhật thông tin coder.
 *
 * @param {string|number} id - ID của coder cần cập nhật.
 * @param {Object} updateData - Dữ liệu cập nhật.
 * @returns {Promise<Object>} - Dữ liệu của coder sau khi cập nhật.
 */
export const update = async (id, updateData) => {
    try {
        const response = await api.put(`/coder/${id}/`, updateData, {
            headers: {
                "Content-Type": "multipart/form-data",  // Đảm bảo gửi dưới dạng form-data
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating coder:", error);
        throw error;
    }
};

/**
 * Xóa coder theo id.
 *
 * @param {Object} params - Các tham số cần thiết.
 * @param {string|number} params.id - ID của coder cần xóa.
 * @param {string|function} [params.deleteEndpoint] - Endpoint tùy chỉnh. Nếu là function, nó sẽ được gọi với tham số row.
 * @param {Object} [params.row] - Dữ liệu row, được truyền vào nếu deleteEndpoint là function.
 * @returns {Promise<Object>} - Kết quả xóa.
 */
export const deleteCoder = async ({ id }) => {
    if (!id) {
        console.error("LỖI: ID không hợp lệ!", id);
        return;
    }

    const endpoint = `/coder/${id}`;

    try {
        const response = await api.delete(endpoint);
        return response.data;
    } catch (error) {
        console.error("Error deleting:", error.response?.data || error.message);
        throw error;
    }
};
