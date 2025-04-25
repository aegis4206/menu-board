import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import { IoMdMenu } from "react-icons/io";
import { FaChevronLeft, FaUserCircle } from "react-icons/fa";
import { RiTranslate } from "react-icons/ri";
// import { FaGithub } from "react-icons/fa";

import Footer from './Footer'
import SideBarMenu from './SideBarMenu';
import Breadcrumbs from './Breadcrumbs';
import { Link } from 'react-router-dom';
import { Backdrop, CircularProgress } from '@mui/material';
import Snackbars from '../components/snackbar';
import { loadingAtom } from '../states/global';
import { drawerShowAtom } from '../states/global';
import { useAtom } from "jotai";
// import logo from '../assets/logo.png';
import { useTranslation } from 'react-i18next';
import ModalMessage from '../components/modalMessage';

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    // marginLeft: drawerWidth,
    // width: `calc(100% - ${drawerWidth}px)`,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
    [theme.breakpoints.up('sm')]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
    },
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    // width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      // width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        // width: theme.spacing(9),
        width: 0,

      },
      [theme.breakpoints.down('sm')]: {
        width: 0,
      },
    }),
    ...(open && {
      [theme.breakpoints.down('sm')]: {
        width: '100vw',
      },
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
      },
    }),
  },
}),
);

const CustomToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  px: [1],
  backgroundColor: '#004523',
  backgroundSize: '65%',
  backgroundPositionY: 'center',
  backgroundPositionX: '20%',
  backgroundRepeat: 'no-repeat',
  [theme.breakpoints.down('sm')]: {
    backgroundSize: '35%',
    backgroundPositionX: 'center',
  },
}));

export default function Dashboard(
  {
    children,
  }: {
    children: React.ReactNode
  }
) {

  const [loading,] = useAtom(loadingAtom);
  const [open, setOpen] = useAtom(drawerShowAtom);
  const { i18n } = useTranslation();
  const calcRef = useRef<HTMLDivElement>(null);
  const [calcHeight, setCalcHeight] = useState(0);


  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh');
  }

  // const [windowWidth, setWindowWidth] = React.useState(0);

  // const handleResize = () => {
  //   setWindowWidth(window.innerWidth);
  // };

  // React.useEffect(() => {
  //   setWindowWidth(window.innerWidth);

  //   window.addEventListener('resize', handleResize);

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  useEffect(() => {
    // if (window.innerWidth > 768) {
    //   setOpen(true);
    // }
    return () => {

    }
  }, []);

  useLayoutEffect(() => {
    const breadcrumbsHeight = calcRef.current?.offsetHeight || 0;
    setCalcHeight(breadcrumbsHeight);
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ maxHeight: '100vh', display: 'flex' }}>
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <IoMdMenu />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              <Link to="/">菜單白板</Link>
            </Typography>
            {/* <IconButton color="inherit" href='/#' target="_blank">
              <FaGithub />
            </IconButton> */}
            <IconButton onClick={toggleLanguage} color="inherit">
              <RiTranslate />
            </IconButton>
            <IconButton color="inherit">
              <FaUserCircle />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" sx={{}} open={open}>
          <CustomToolbar
            onClick={toggleDrawer} // 點擊logo收起選單
          >
            <IconButton
            // onClick={toggleDrawer}
            >
              <FaChevronLeft color='white' />
            </IconButton>
          </CustomToolbar>
          <Divider />
          <List component="nav"
            sx={{
              overflowY: 'auto',
              overflowX: 'hidden',
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE 和 Edge
              '&::-webkit-scrollbar': {
                display: 'none', // Chrome, Safari, Opera
              },
            }}>
            <SideBarMenu></SideBarMenu>
          </List>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          maxHeight: '100vh',
          overflowY: 'hidden',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >

        <Box ref={calcRef}>
          <Toolbar />
          {/* 縮排用 */}
          <Breadcrumbs />
          {/* 麵包屑 */}
        </Box>
        <Container maxWidth={false} sx={{
          maxHeight: `calc(100vh - ${calcHeight}px)`,
          height: `calc(100vh - ${calcHeight}px)`,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Box sx={{
            boxShadow: 3,
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            p: 2,
            bgcolor: '#fafafa',
            '&:hover': {
              borderColor: '#1976d2',
            },
            flexGrow: 1,
            height: '0', // 讓內容區域自動填滿剩餘空間
            overflowY: 'auto',

          }}>
            {children}
          </Box>
          <Footer />
        </Container>
      </Box>
      <Snackbars />
      <ModalMessage />
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: 9999,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
