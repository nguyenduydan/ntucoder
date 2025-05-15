import React, { useState, useEffect } from 'react';
import { getDetail } from '@/config/apiService'; // Giả sử bạn có một hàm API getDetail để lấy thông tin coder
import AvatarLoadest from '@/components/fields/Avatar';

const coderCache = new Map();

const useCoderDetail = (coderID) => {
    const [coderDetail, setCoderDetail] = useState(null);

    useEffect(() => {
        if (!coderID) return;

        const fetch = async () => {
            if (coderCache.has(coderID)) {
                setCoderDetail(coderCache.get(coderID));
                return;
            }
            try {
                const data = await getDetail({ controller: 'Coder', id: coderID });
                coderCache.set(coderID, data);
                setCoderDetail(data);
            } catch (e) {
                console.error(e);
            }
        };

        fetch();
    }, [coderID]);

    return coderDetail;
};


const CoderAvatar = ({ coderID, ...props }) => {
    const coderDetail = useCoderDetail(coderID);

    if (!coderDetail) {
        return <AvatarLoadest size="sm" name="Loading..." {...props} />;
    }

    return (
        <AvatarLoadest
            size="sm"
            name={coderDetail.coderName}
            src={coderDetail.avatar || ''}
            {...props}
        />
    );
};

export default CoderAvatar;
