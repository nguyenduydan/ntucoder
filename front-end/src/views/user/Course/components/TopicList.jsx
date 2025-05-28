import React from 'react';
import { List, Text, SkeletonText } from '@chakra-ui/react';
import TopicAccordion from './TopicAccordion';

const TopicList = ({ course, isAuthenticated, isEnrolled, toast }) => {

    if (!Array.isArray(course?.topics) || course.topics.length === 0) {
        return <Text fontSize="md" color="gray.500">Không có chủ đề nào.</Text>;
    }

    return (
        <List spacing={0}>
            {course.topics.map((topic, index) => (
                <TopicAccordion
                    key={topic?.topicID || index}
                    topic={topic}
                    index={index}
                    isAuthenticated={isAuthenticated}
                    isEnrolled={isEnrolled}
                    toast={toast}
                />
            ))}
        </List>
    );
};

export default React.memo(TopicList);
