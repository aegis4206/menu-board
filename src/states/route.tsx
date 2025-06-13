import { atom } from "jotai";
import { MenuItem } from "../types/menu";
// import { FaUserCircle } from 'react-icons/fa';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { IoHomeOutline } from "react-icons/io5";
import { VscTypeHierarchySub, VscGroupByRefType } from "react-icons/vsc";
import { AiFillPicture } from "react-icons/ai";


// import Auth_user from "../Pages/Auth_user";
import Index from "../Pages/Index";
import Posts from "../Pages/Posts";
import Types from "../Pages/Types";
import Tabs from "../Pages/Tabs";
import Board from "../Pages/Board";

// children會在sidebar顯示，noSideBarRoute則不會，且則一存在
export const sideBarMenuData = atom<MenuItem[]>([
    {
        name: "首頁",
        path: "",
        icon: <IoHomeOutline />,
        pageNode: <Index />,
        noSideBarRoute: [
            {
                name: "白板",
                path: "/type/:type_id",
                pageNode: <Board />,
            },
        ]
    },
    {
        name: "後台管理",
        path: "management",
        icon: <MdOutlineManageAccounts />,
        children: [
            {
                name: "分類管理",
                path: "management/types",
                icon: <VscTypeHierarchySub />,
                pageNode: <Types />,
            },
            {
                name: "分頁管理",
                path: "management/tabs",
                icon: <VscGroupByRefType />,
                pageNode: <Tabs />,
            },
            {
                name: "圖片管理",
                path: "management/posts",
                icon: <AiFillPicture />,
                pageNode: <Posts />,
            },
            // {
            //     name: "用戶管理",
            //     path: "management/users",
            //     icon: <FaUserCircle />,
            //     pageNode: <Auth_user />,
            // },
        ],
    },

]);