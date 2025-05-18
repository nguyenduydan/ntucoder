import React, { useState, useEffect } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    Tabs, TabList, TabPanels, Tab,
    ModalBody,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import UpdateInfo from './UpdateInfo';
import UpdatePassword from './UpdatePassword';

const MotionTabPanel = motion(TabPanels);

const variants = {
    enter: (direction) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
        transition: { duration: 0.2 } // tăng thời gian lên 0.8s
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.2 } // có thể để center cũng có transition nếu muốn
    },
    exit: (direction) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
        transition: { duration: 0.2 }
    }),
};


const ModalEdit = ({ coderID, isOpen, onClose, onUpdated }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const handleTabsChange = (index) => {
        setDirection(index > tabIndex ? 1 : -1);  // Xác định hướng slide
        setTabIndex(index);
    };

    useEffect(() => {
        if (isOpen) {
            setTabIndex(0);       // Luôn mở tab đầu tiên
            setDirection(0);      // Reset hướng khi mở modal
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered scrollBehavior='inside'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">Thông tin lập trình viên</ModalHeader>
                <ModalCloseButton />
                <Tabs
                    isFitted
                    colorScheme="blue"
                    index={tabIndex}
                    onChange={handleTabsChange}
                >
                    <TabList px={4} pt={2}>
                        <Tab>Cập nhật thông tin</Tab>
                        <Tab>Đổi mật khẩu</Tab>
                    </TabList>
                    <ModalBody overflow="auto" maxH="70vh" px={0} pb={0}>
                        <AnimatePresence initial={false} custom={direction}>
                            {tabIndex === 0 && (
                                <MotionTabPanel
                                    key="info"
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                    px={4}
                                >
                                    <UpdateInfo coderID={coderID} onClose={onClose} onUpdated={onUpdated} />
                                </MotionTabPanel>
                            )}
                            {tabIndex === 1 && (
                                <MotionTabPanel
                                    key="password"
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                    px={4}
                                >
                                    <UpdatePassword coderID={coderID} />
                                </MotionTabPanel>
                            )}
                        </AnimatePresence>
                    </ModalBody>
                </Tabs>
            </ModalContent>
        </Modal>
    );
};

export default ModalEdit;
