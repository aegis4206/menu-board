import { Box, Tab, Tabs } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, FreeMode } from 'swiper/modules';
import { usePosts, useTabs } from '../utils/fetchUrls';
import { useEffect, useState } from 'react';
import { PostsType, TabsType } from '../types/board';
import { useParams } from 'react-router-dom';
import FsLightbox from 'fslightbox-react';

import 'swiper/css';
// import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/effect-coverflow';


const Board = () => {
    const [posts, setPosts] = useState<PostsType[]>([]);
    const [tabPosts, setTabPosts] = useState<PostsType[]>([]);
    const [tabs, setTabs] = useState<TabsType[]>([]);
    const [togglerFsLightbox, setTogglerFsLightbox] = useState(false);
    const [fsLightboxImgList, setFsLightboxImgList] = useState<string[]>([]);
    const postsApi = usePosts();
    const tabsApi = useTabs();
    const [tab, setTab] = useState(0);
    const [clickTimeout, setClickTimeout] = useState<number | null>(null);
    const { type_id } = useParams();


    useEffect(() => {
        getPosts(type_id);
        getTabsList(type_id);

        return () => {

        }
    }, [type_id])


    useEffect(() => {
        handleFilterTabPosts(tab, posts);
        return () => {

        }
    }, [posts, tabs])


    const onTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
        handleFilterTabPosts(newValue);
    }

    const handleFilterTabPosts = (tabNumber: number, data: PostsType[] = posts) => {
        if (posts.length === 0 || tabs.length === 0) return;
        const filteredPosts = data.filter((post) => post.tab_id === tabs[tabNumber].id);
        setTabPosts(filteredPosts);
    }


    const getPosts = async (typeId?: string) => {
        if (typeId) {
            const res = await postsApi.get({ "type_id": typeId });
            if (res.success) {
                setPosts((res.data as PostsType[]));
            }
        } else {
            const res = await postsApi.get();
            if (res.success) {
                setPosts((res.data as PostsType[]));
            }
        }
    }

    const getTabsList = async (typeId?: string) => {
        if (typeId) {
            const res = await tabsApi.get({ "type_id": typeId });
            if (res.success) {
                setTabs((res.data as TabsType[]));
            }
        } else {
            const res = await tabsApi.get();
            if (res.success) {
                setTabs((res.data as TabsType[]));
            }
        }
    }


    const onSwiperSlideDoubleClick = (post: PostsType) => {
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            setClickTimeout(null);
            setFsLightboxImgList([post.imgurl]);
            setTogglerFsLightbox(!togglerFsLightbox);
        } else {
            const timeout = setTimeout(() => {
                setClickTimeout(null);
            }, 300);

            setClickTimeout(timeout);
        }
    };

    return (
        <>
            <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
                {tabs.length > 0 && <Box sx={{ borderRight: 1, borderColor: 'divider' }}>
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={tab}
                        onChange={(_, value) => onTabChange(_, value)}
                        sx={{ borderColor: 'divider', zIndex: 999999999 }}
                    >
                        {tabs.map((tab) => (
                            <Tab key={tab.id} label={tab.name} id={tab.id} />
                        ))}
                    </Tabs>
                </Box>}
                <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={tabPosts.length > 1 ? true : false}
                    freeMode={{
                        enabled: true,
                        sticky: true,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    effect={'coverflow'}
                    centeredSlides={true}
                    grabCursor={true}
                    coverflowEffect={{
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    }}
                    modules={[FreeMode, Pagination, EffectCoverflow]}
                    style={{ height: '100%', width: '100%' }}
                >
                    {tabPosts.map((post, index) => (
                        <SwiperSlide key={index} onClick={() => onSwiperSlideDoubleClick(post)} >
                            <img src={post.imgurl} alt={`
                            Slide ${index + 1}`} style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain', // 保持比例，圖片完整顯示，可能有留白
                                    // objectFit: 'cover', // 保持比例，圖片填滿容器，可能裁切
                                }} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <FsLightbox
                    toggler={togglerFsLightbox}
                    sources={fsLightboxImgList}
                // slide={1} // 從指定索引開始顯示
                // onClose={() => setTogglerFsLightbox(!togglerFsLightbox)}
                />
            </Box>
        </>
    );
};

export default Board;