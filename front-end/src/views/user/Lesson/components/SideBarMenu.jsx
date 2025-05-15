import React, { useState } from "react";
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, Icon, Badge } from "@chakra-ui/react";
import { FaRegFileAlt, FaClock, FaComments, FaQuestionCircle, FaBars } from "react-icons/fa";
import LessonContent from "./LessonContent";

export default function SideBarMenu(lesson) {
    const [activeTab, setActiveTab] = useState(0);

}
