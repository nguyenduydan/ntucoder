// src/api/TestCaseService.js
import api from "./apiConfig";

/**
 * Lấy danh sách TestCase với phân trang, sắp xếp.
 *
 * @param {Object} params - Các tham số query.
 * @param {number} params.page - Số trang cần lấy.
 * @param {number} params.pageSize - Số dòng mỗi trang.
 * @param {boolean} params.ascending - Thứ tự sắp xếp.
 * @param {string} params.sortField - Trường sắp xếp.
 * @returns {Promise<Object>} - Chứa data, totalPages và totalCount.
 */

export const getListTestCase = async ({ page, pageSize, ascending, sortField, totalCount }) => {
    const dynamicTimeout = (totalCount - pageSize + 1) * 1000;
    try {
        const response = await api.get("/TestCase", {
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
        console.error("Error fetching TestCase data:", error);
        throw error;
    }
};

/**
 * Gửi yêu cầu tạo mới người dùng (TestCase).
 *
 * @param {Object} TestCaseData - Dữ liệu người dùng cần tạo.
 * @returns {Promise<Object>} - Dữ liệu phản hồi từ API.
 */
export const create = async (TestCaseData) => {
    try {
        const response = await api.post('/TestCase', TestCaseData);
        return response.data;
    } catch (error) {
        console.error('Error creating TestCase:', error);
        throw error;
    }
};
/**
 * Xóa TestCase theo id.
 *
 * @param {Object} params - Các tham số cần thiết.
 * @param {string|number} params.id - ID của TestCase cần xóa.
 * @param {string|function} [params.deleteEndpoint] - Endpoint tùy chỉnh. Nếu là function, nó sẽ được gọi với tham số row.
 * @param {Object} [params.row] - Dữ liệu row, được truyền vào nếu deleteEndpoint là function.
 * @returns {Promise<Object>} - Kết quả xóa.
 */
export const deleteTestCase = async ({ id }) => {
    if (!id) {
        console.error("LỖI: ID không hợp lệ!", id);
        return;
    }

    const endpoint = `/TestCase/${id}`;

    try {
        const response = await api.delete(endpoint);
        return response.data;
    } catch (error) {
        console.error("Error deleting TestCase:", error.response?.data || error.message);
        throw error;
    }
};
