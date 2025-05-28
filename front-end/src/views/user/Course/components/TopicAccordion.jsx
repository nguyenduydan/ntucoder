import React from 'react';
import {
    ListItem,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Box,
    Text,
    Flex,
    List,
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, } from '@chakra-ui/icons';
import { FaRegFileCode } from 'react-icons/fa';
import LessonItem from './LessonItem';

const TopicAccordion = ({ topic, index, isAuthenticated, isEnrolled, toast }) => {
    return (
        <ListItem key={topic?.topicID || index} bg="gray.100" borderRadius="md">
            <Accordion allowToggle>
                <AccordionItem key={topic?.topicID} border="none">
                    {({ isExpanded }) => (
                        <>
                            <h2>
                                <AccordionButton _expanded={{ bg: "gray.200" }} borderRadius="sm">
                                    <Box flex="1" textAlign="left" borderBottomWidth={2} borderStyle="dashed" py={2}>
                                        <Text fontSize="lg">
                                            <Text as="span" fontWeight="bold">Chủ đề {index + 1}:</Text> {topic?.topicName || "Không có tên"}
                                        </Text>
                                        <Flex alignItems='center' gap={2} fontSize="sm">
                                            <Text as='span'><FaRegFileCode /></Text>Tổng số bài học: {topic?.lessons?.length || 0}
                                        </Flex>
                                    </Box>
                                    {isExpanded ? <MinusIcon boxSize={4} /> : <AddIcon boxSize={4} />}
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                {topic.lessons?.length ? (
                                    <List spacing={2}>
                                        {topic.lessons.map((lesson) => (
                                            <LessonItem
                                                key={lesson.lessonID || Math.random()}
                                                lesson={lesson}
                                                isLoggedIn={isAuthenticated.isAuthenticated}
                                                isEnrolled={isEnrolled}
                                                toast={toast}
                                            />
                                        ))}
                                    </List>
                                ) : (
                                    <Text fontSize="md" color="gray.500">Không có bài học nào.</Text>
                                )}
                            </AccordionPanel>
                        </>
                    )}
                </AccordionItem>
            </Accordion>
        </ListItem>
    );
};

export default React.memo(TopicAccordion);
