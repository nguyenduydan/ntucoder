import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    Tabs, TabList, Tab,
    ModalBody,
    Spinner,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

const UpdateInfo = lazy(() => import('./UpdateInfo'));
const UpdatePassword = lazy(() => import('./UpdatePassword'));

const MotionDiv = motion.div;

const variants = {
    enter: (direction) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
    }),
};

const ModalEdit = ({ coderID, isOpen, onClose, onUpdated }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const handleTabsChange = (index) => {
        setDirection(index > tabIndex ? 1 : -1);
        setTabIndex(index);
    };

    useEffect(() => {
        if (isOpen) {
            setTabIndex(0);
            setDirection(0);
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={tabIndex === 0 ? '3xl' : 'md'} isCentered scrollBehavior='inside'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">Thông tin lập trình viên</ModalHeader>
                <ModalCloseButton />
                <Tabs isFitted colorScheme="blue" index={tabIndex} onChange={handleTabsChange}>
                    <TabList px={4} pt={2}>
                        <Tab>Cập nhật thông tin</Tab>
                        <Tab>Đổi mật khẩu</Tab>
                    </TabList>

                    <ModalBody overflow="auto" maxH="70vh" px={4} pt={4}>
                        <AnimatePresence initial={false} custom={direction}>
                            <MotionDiv
                                key={tabIndex}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                            >
                                <Suspense fallback={<Spinner />}>
                                    {tabIndex === 0 ? (
                                        <UpdateInfo coderID={coderID} onClose={onClose} onUpdated={onUpdated} />
                                    ) : (
                                        <UpdatePassword coderID={coderID} />
                                    )}
                                </Suspense>
                            </MotionDiv>
                        </AnimatePresence>
                    </ModalBody>
                </Tabs>
            </ModalContent>
        </Modal>
    );
};

export default ModalEdit;
