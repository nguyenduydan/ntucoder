import React, { useState, useEffect } from 'react';
import { getDetail } from '@/config/apiService'; // Giả sử bạn có một hàm API getDetail để lấy thông tin coder
import AvatarLoadest from '@/components/fields/Avatar';

const CoderAvatar = ({ coderID, ...props }) => {
    const [coderDetail, setCoderDetail] = useState(null);

    useEffect(() => {
        const fetchCoderDetail = async () => {
            try {
                const data = await getDetail({ controller: "Coder", id: coderID });
                setCoderDetail(data);
            } catch (error) {
                console.error('Error fetching coder detail:', error);
            }
        };

        if (coderID) {
            fetchCoderDetail();
        }
    }, [coderID]);


    if (!coderDetail) {
        return <AvatarLoadest
            size="sm"
            name="Loading..."
            {...props} />;
    }

    // Sử dụng avatar từ dữ liệu coderDetail
    const avatarSrc = coderDetail.avatar || ""; // Nếu không có avatar, dùng ảnh mặc định

    return (
        <AvatarLoadest
            size="sm"
            name={coderDetail.coderName}
            src={avatarSrc} {...props}
        />
    );
};

export default CoderAvatar;
