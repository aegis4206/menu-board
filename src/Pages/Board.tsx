import { Box, Tab, Tabs } from '@mui/material';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { EffectCoverflow, Pagination, FreeMode } from 'swiper/modules';
import { usePosts, useTabs } from '../utils/fetchUrls';
import { Fragment, useEffect, useRef, useState } from 'react';
import { PostsType, TabsType } from '../types/board';
import { useParams } from 'react-router-dom';
import PhotoSwipe from 'photoswipe';


import 'photoswipe/style.css';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/effect-coverflow';
import LexicalTool from '../components/lexicalTool';

const Board = () => {
    const [posts, setPosts] = useState<PostsType[]>([]);
    const [tabPosts, setTabPosts] = useState<PostsType[]>([]);
    const [tabs, setTabs] = useState<TabsType[]>([]);
    const postsApi = usePosts();
    const tabsApi = useTabs();
    const [tab, setTab] = useState<string | undefined>(undefined);
    const [clickTimeout, setClickTimeout] = useState<number | null>(null);
    const { type_id } = useParams();
    const [swiperActiveIndex, setSwiperActiveIndex] = useState(0);
    const swiperRef = useRef<SwiperRef | null>(null);


    useEffect(() => {
        getData(type_id);
    }, [type_id]);

    useEffect(() => {
        handleFilterTabPosts(tab ?? "0", posts);
    }, [tab]);

    const onTabChange = (_: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
        // handleFilterTabPosts(newValue);
    };

    const handleFilterTabPosts = (tabNumber: string, data: PostsType[] = posts) => {
        if (posts.length === 0 || tabs.length === 0) return;
        const filteredPosts = data.filter((post) => post.tab_id === tabNumber);
        setTabPosts(filteredPosts);
        if (swiperRef.current) {
            swiperRef.current.swiper.slideTo(0);
        }
    };

    const getData = async (typeId?: string) => {
        const PostRes = typeId ? await postsApi.get({ type_id: typeId }) : await postsApi.get();
        if (PostRes.success) {
            setPosts(PostRes.data as PostsType[]);

            const TypeRes = typeId ? await tabsApi.get({ type_id: typeId }) : await tabsApi.get();
            if (TypeRes.success) {
                setTabs(TypeRes.data as TabsType[]);
                setTab((TypeRes.data as TabsType[])[0]?.id);
            }
        }
    };



    const onSwiperSlideDoubleClick = (post: PostsType) => {
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            setClickTimeout(null);

            // 開啟 PhotoSwipe
            const img = new Image();
            img.src = `${import.meta.env.VITE_API_URL}${post.imgurl}`;
            const lightbox = new PhotoSwipe({
                dataSource: [
                    {
                        src: `${import.meta.env.VITE_API_URL}${post.imgurl}`,
                        width: img.naturalWidth,
                        height: img.naturalHeight,

                    },
                ],
                index: 0,
                showHideAnimationType: 'zoom', // 或 'fade'
                bgOpacity: 0.8,
            });

            lightbox.init();
        } else {
            const timeout = window.setTimeout(() => {
                setClickTimeout(null);
            }, 300);
            setClickTimeout(timeout);
        }
    };

    const isValidJson = (str: string): boolean => {
        try {
            const parsed = JSON.parse(str);
            return parsed?.root?.type === 'root';
        } catch {
            return false;
        }
    };

    return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
            <Box hidden={tabs.length === 0} sx={{ borderRight: 1, borderColor: 'divider', width: '100px' }}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={tab ?? false}
                    onChange={onTabChange}
                    sx={{ borderColor: 'divider', zIndex: 999999999 }}
                >
                    {tabs.map((tab) => (
                        <Tab key={tab.id} label={tab.name.toString()} value={tab.id} wrapped sx={{ paddingLeft: 0, paddingTop: 0, paddingBottom: 0 }} />
                    ))}
                </Tabs>
            </Box>
            <Box sx={{ overflowY: 'auto' }}>
                <Swiper
                    ref={swiperRef}
                    initialSlide={1}
                    slidesPerView={1}
                    spaceBetween={30}
                    // loop={tabPosts.length > 1}
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
                    style={{ height: 'auto', width: '100%' }}
                    onSlideChange={(swiper) => setSwiperActiveIndex(swiper.activeIndex)}
                >
                    {tabPosts.map((post, index) => (
                        <Fragment key={index}>
                            <SwiperSlide key={index} onClick={() => onSwiperSlideDoubleClick(post)}>
                                <img
                                    src={`${import.meta.env.VITE_API_URL}${post.imgurl}`}
                                    alt={`Slide ${index + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain', // 保持比例，圖片完整顯示
                                    }}
                                />
                            </SwiperSlide>
                        </Fragment>
                    ))}
                </Swiper>
                {tabPosts[swiperActiveIndex] && isValidJson(tabPosts[swiperActiveIndex].content) && (
                    <LexicalTool value={tabPosts[swiperActiveIndex].content} readOnly />
                )}
            </Box>
        </Box>
    );
};

export default Board;
