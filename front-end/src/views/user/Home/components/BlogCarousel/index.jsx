import React from "react";
import BlogCaurosel from "./BlogCaurosel";

const BlogCarousel = React.memo(({ blogs }) => {
    // Component logic here - reuse existing BlogCarousel
    return <BlogCaurosel blogs={blogs} />;
});

BlogCarousel.displayName = 'BlogCarousel';
export default BlogCarousel;

