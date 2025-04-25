// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Box from '@mui/material/Box';
// import { FaUserLock } from "react-icons/fa";
// import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';
// import Alert from '@mui/material/Alert';
// import React, { useEffect, useState } from 'react';
// // import { useNavigate } from 'react-router-dom';


// import { useAtom } from "jotai";
// // import { loadingAtom, loginAtom } from "../states/global";
// import { loadingAtom, } from "../states/global";
// import { IconButton, InputAdornment, InputLabel, Input, FormControl, OutlinedInput } from '@mui/material';
// import { MdVisibility } from "react-icons/md";
// import { MdVisibilityOff } from "react-icons/md";

// interface inputType {
//     email: boolean,
//     password: boolean,
//     [key: string]: boolean
// }

// export default function Login() {
//     // const navigate = useNavigate();

//     const [signUpMode, setSignUpMode] = useState<boolean>(false)
//     const [message, setMessage] = useState<string>("")
//     const [resCode, setResCode] = useState<number>(200)
//     const [, setLoading] = useAtom(loadingAtom)
//     // const [, setLogin] = useAtom(loginAtom)

//     const [helperText, setHelperText] = useState({
//         email: '',
//         password: ''
//     })
//     const [inputError, setInputError] = useState<inputType>({
//         email: false,
//         password: false
//     })
//     const [remember, setRemember] = useState<boolean>(false)
//     const [formData, setFormData] = useState({
//         email: '',
//         password: ''
//     })

//     useEffect(() => {
//         const save = localStorage.getItem('save');
//         if (save == "true") {
//             const email = localStorage.getItem('email');
//             const password = localStorage.getItem('password');

//             // email && password && setFormData({ email, password });
//             setRemember(true)
//         }
//     }, [])


//     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//         setLoading(true)
//         event.preventDefault();
//         const { email, password } = formData
//         console.log("formData", formData)
//         // 信箱格式檢查
//         if (email == "") {
//             formatErrHandle("email", "請輸入信箱")
//             return
//         } else {
//             const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{1,5})+$/;
//             if (email && !reg.test(email.toString())) {
//                 formatErrHandle("email", "信箱格式錯誤")
//                 return
//             }
//         }

//         if (password == "") {
//             formatErrHandle("password", "請輸入密碼")
//             return
//         }

//         const body = {
//             email,
//             password
//         }
//         const res = signUpMode ? await registAPI.post(body) : await loginAPI.post(body);
//         // res.Code == 200 && setSignUpMode(false);
//         setResCode(res.Code)
//         setMessage(res.Msg)
//         setTimeout(() => setLoading(false), 2000)
//         if (remember && !signUpMode && res.Code == 200) {
//             localStorage.setItem('save', "true");
//             localStorage.setItem('email', email);
//             localStorage.setItem('password', password);

//         } else {
//             localStorage.setItem('save', "false");
//         }
//         if (res.Code == 200 && !signUpMode) {
//             console.log("設定登入資訊", res)
//             setLogin(res.Data)
//             // navigate("/manage")
//         }
//         // setLoading(false)
//     };

//     const resetHandle = (target: string, e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData(pre => ({ ...pre, [target]: e.target.value }))
//         if (inputError[target] == false) return;
//         setHelperText(pre => ({ ...pre, [target]: "" }))
//         setInputError(pre => ({ ...pre, [target]: false }))
//     }

//     const formatErrHandle = (target: string, msg: string) => {
//         setHelperText(pre => ({ ...pre, [target]: msg }))
//         setInputError(pre => ({ ...pre, [target]: true }))
//         setLoading(false)
//     }

//     const saveToggle = () => {
//         setRemember(!remember)
//     }

//     // password設定
//     const [showPassword, setShowPassword] = useState(false);
//     const handleClickShowPassword = () => setShowPassword((show) => !show);
//     const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
//         event.preventDefault();
//     };
//     const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
//         event.preventDefault();
//     };

//     return (
//         <Container component="main" maxWidth="xs">
//             <CssBaseline />
//             <Box
//                 sx={{
//                     marginTop: 8,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                 }}
//             >
//                 <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//                     <FaUserLock />
//                 </Avatar>
//                 <Typography component="h1" variant="h5" className='w-full'>
//                     <Button className='w-1/2'
//                         variant={signUpMode ? 'outlined' : 'contained'}
//                         onClick={() => setSignUpMode(false)}
//                     >Sign In</Button>
//                     <Button className='w-1/2'
//                         variant={!signUpMode ? 'outlined' : 'contained'}
//                         onClick={() => setSignUpMode(true)}
//                     >Sign Up</Button>
//                 </Typography>
//                 <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//                     <TextField
//                         margin="normal"
//                         required
//                         fullWidth
//                         id="email"
//                         label="Email Address"
//                         name="email"
//                         autoComplete="email"
//                         autoFocus
//                         error={inputError.email}
//                         helperText={helperText.email}
//                         onChange={(e: React.ChangeEvent<HTMLInputElement>) => resetHandle("email", e)}
//                         value={formData.email}
//                         sx={{
//                             '& input:-webkit-autofill': {
//                                 WebkitBoxShadow: '0 0 0 1000px white inset',
//                                 WebkitTextFillColor: '#000',
//                             },
//                         }}
//                     />
//                     <TextField
//                         margin="normal"
//                         required
//                         fullWidth
//                         name="password"
//                         label="Password"
//                         type={showPassword ? 'text' : 'password'}
//                         id="password"
//                         autoComplete="current-password"
//                         error={inputError.password}
//                         helperText={helperText.password}
//                         onChange={(e: React.ChangeEvent<HTMLInputElement>) => resetHandle("password", e)}
//                         value={formData.password}
//                         slotProps={
//                             {
//                                 input: {
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                             <IconButton
//                                                 aria-label={
//                                                     showPassword ? 'hide the password' : 'display the password'
//                                                 }
//                                                 onClick={handleClickShowPassword}
//                                                 onMouseDown={handleMouseDownPassword}
//                                                 onMouseUp={handleMouseUpPassword}
//                                                 edge="end"
//                                             >
//                                                 {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
//                                             </IconButton>
//                                         </InputAdornment>
//                                     )
//                                 }
//                             }
//                         }
//                     />
//                     <FormControlLabel
//                         control={<Checkbox value="remember" color="primary" />}
//                         label="Remember me"
//                         onChange={saveToggle}
//                         checked={remember}
//                     />
//                     <Button
//                         type="submit"
//                         fullWidth
//                         variant="contained"
//                         sx={{ mt: 3, mb: 2 }}
//                     >
//                         {signUpMode ? "Sign Up" : "Sign In"}
//                     </Button>
//                     {message && <Alert severity={resCode == 200 ? "success" : "warning"}>{message}</Alert>}
//                 </Box>
//             </Box>
//         </Container>
//     );
// }