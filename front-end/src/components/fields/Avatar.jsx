import React, { useState, useEffect, useCallback } from "react";
import { Avatar } from "@chakra-ui/react";
import { getCacheBustedUrl } from "@/utils/utils";

const AvatarLoadest = ({ src, name, onLoad, ...props }) => {
    const [avatarColor, setAvatarColor] = useState("rgb(0, 242, 255)"); // Màu mặc định

    const getAvatarColor = useCallback((src) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = src;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            const pixel = ctx.getImageData(
                img.width / 2,
                img.height / 2,
                1,
                1
            ).data;

            const rgbColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
            setAvatarColor(rgbColor);
            onLoad?.();
        };
    }, [onLoad]); // Memoize the function

    useEffect(() => {
        if (src) {
            getAvatarColor(src);
        }
    }, [src, getAvatarColor]); // `getAvatarColor` is now safe to be in the dependency array


    // Tạo shadow neon với màu avatarColor
    const neonShadow = `
        0 0 5px ${avatarColor},
        0 0 10px ${avatarColor},
        0 0 20px ${avatarColor},
        0 0 30px ${avatarColor}
    `;

    return (
        <Avatar
            name={name}
            src={getCacheBustedUrl(src)}
            alt="Coder Avatar"
            boxShadow={neonShadow}
            border="2px solid white"
            transition="box-shadow 0.3s ease-in-out"
            filter="saturate(1.2)"
            {...props}
        />
    );
};

export default AvatarLoadest;
