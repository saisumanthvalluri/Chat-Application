import { useState, useEffect } from "react";
import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleAuthProvider } from "../../Firebase-config";
import { doc, setDoc, onSnapshot, collection } from "firebase/firestore";
import Cookies from "js-cookie";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import ChatAppLogo from "../../Img/ChatAppLogo.jpg";
import ChatAppRemoveBgLogo from "../../Img/ChatAppRemoveBgLogo.png";
import GoogleLogo from "../../Img/GoogleLogo.jpg";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./index.css";

const SignUp = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [snackbarData, setSnackData] = useState({ open: false, msg: "", type: "" });
    const [allUsers, setAllUsers] = useState([]);
    const vertical = "bottom";
    const horizontal = "right";
    const navigate = useNavigate();

    const isEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

    useEffect(() => {
        const jwtToken = Cookies.get("jwt_token");
        if (jwtToken !== undefined) {
            return navigate("/", { replace: true });
        }

        const unSubUserData = onSnapshot(collection(db, "users"), (snapshot) => {
            let users = [];
            snapshot.docs.forEach((doc) => {
                users.push(doc.id);
            });
            setAllUsers(users);
        });

        return () => {
            unSubUserData();
        };
    }, [navigate]);

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackData({ open: false });
    };

    const continueWithGoogle = async () => {
        try {
            const user = await signInWithPopup(auth, googleAuthProvider);
            console.log(user);
            const email = user.user.email;
            const username = user.user.displayName;
            const userAvatar = user.user.photoURL;
            // const userData = {
            //     userId: user.user.uid,
            //     accessToken: user.user.accessToken,
            //     userName: user.user.displayName,
            //     email: user.user.email,
            //     operationType: user.operationType,
            //     providerId: user.providerId,
            // };
            if (!allUsers.includes(user.user.uid)) {
                await setDoc(doc(db, "users", user.user.uid), { email, username, userAvatar });
            }
            const userInfo = {
                userId: user.user.uid,
                operationType: user.operationType,
                name: user.user.displayName,
            };
            Cookies.set("jwt_token", user.user.accessToken, { expires: 1 });
            localStorage.setItem("user_info", JSON.stringify(userInfo));
            navigate("/", { replace: true });
        } catch (error) {
            if (error.message === "Firebase: Error (auth/popup-closed-by-user).") {
                setSnackData({ open: true, msg: "Popup closed by user!", type: "error" });
            } else {
                setSnackData({ open: true, msg: error.message, type: "error" });
            }
        }
    };

    const handleForm = async (e) => {
        e.preventDefault();
        try {
            if (userName !== "" && email !== "" && password !== "") {
                if (!isEmail(email)) {
                    setSnackData({ open: true, msg: "Invalid Email!", type: "warning" });
                } else {
                    // console.log(data);
                    const user = await createUserWithEmailAndPassword(auth, email, password);
                    await setDoc(doc(db, "users", user.user.uid), { email, userName });
                    const userInfo = {
                        userId: user.user.uid,
                        operationType: user.operationType,
                        name: userName,
                    };
                    Cookies.set("jwt_token", user.user.accessToken, { expires: 1 });
                    localStorage.setItem("user_info", JSON.stringify(userInfo));
                    setSnackData({ open: true, msg: "Success", type: "success" });
                    navigate("/", { replace: true });
                }
            } else {
                setSnackData({ open: true, msg: "All fields are mandatory!", type: "warning" });
            }
        } catch (error) {
            if (error.message === "Firebase: Error (auth/email-already-in-use).") {
                setSnackData({ open: true, msg: "This Email Adress alreay exists!", type: "warning" });
            } else if (error.message === "Firebase: Password should be at least 6 characters (auth/weak-password).") {
                setSnackData({ open: true, msg: "Password should be at least 6 characters!", type: "warning" });
            } else if (error.message === "Firebase: Error (auth/network-request-failed).") {
                setSnackData({ open: true, msg: "You are offline. please check your network!", type: "warning" });
            } else if (error.message === "Firebase: Error (auth/invalid-email).") {
                setSnackData({ open: true, msg: "Invalid email!", type: "warning" });
            } else {
                console.log(error.message);
                setSnackData({ open: true, msg: error.message, type: "warning" });
            }
        }
    };

    return (
        <div className="sign-up-container">
            <div className="resp-container">
                <div className="form-container">
                    <div className="form-content">
                        <form className="sign-up-form" onSubmit={handleForm}>
                            <img src={ChatAppRemoveBgLogo} alt="chat-app-logo" className="chat-app-logo" />
                            <h1 className="app-title">Chat Together</h1>
                            <p className="app-caption">Fastest way to chat and simple!</p>
                            <Box sx={{ width: "100%" }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "flex-end",
                                        mb: 3,
                                    }}>
                                    <AccountCircleOutlinedIcon
                                        sx={{
                                            color: "action.active",
                                            mr: 2,
                                            my: 0.5,
                                            fontSize: 33,
                                        }}
                                    />
                                    <TextField
                                        id="input-User-name"
                                        label="User name"
                                        variant="standard"
                                        fullWidth
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "flex-end",
                                        mb: 3,
                                    }}>
                                    <MailOutlinedIcon
                                        sx={{
                                            color: "action.active",
                                            mr: 2,
                                            my: 0.5,
                                            fontSize: 33,
                                        }}
                                    />
                                    <TextField
                                        id="input-Email"
                                        label="Email"
                                        variant="standard"
                                        fullWidth
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "flex-end",
                                        mb: 3,
                                    }}>
                                    <LockOutlinedIcon
                                        sx={{
                                            color: "action.active",
                                            mr: 2,
                                            my: 0.5,
                                            fontSize: 33,
                                        }}
                                    />
                                    <FormControl sx={{ width: "310px" }} variant="standard">
                                        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                                        <Input
                                            id="standard-adornment-password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password}
                                            type={showPassword ? "text" : "password"}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowPassword((prev) => !prev)}>
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </Box>
                            </Box>
                            <button className="signup-btn" type="submit">
                                Sign Up
                            </button>
                            <p className="have-acc-text">
                                Already have an account? <Link to="/sign-in">Sign In</Link>
                            </p>
                        </form>
                        <div className="seperation-box">
                            <hr className="hr-rule" />
                            <span>OR</span>
                            <hr className="hr-rule" />
                        </div>
                        <button className="signup-google-btn" onClick={continueWithGoogle}>
                            <span>
                                <img src={GoogleLogo} alt="" className="g-logo" />
                                Continue with Google
                            </span>
                        </button>
                    </div>
                </div>
                <div className="app-logo">
                    <img src={ChatAppRemoveBgLogo} alt="chat-app-img" className="chat-app-img" />
                </div>
            </div>
            <Snackbar
                open={snackbarData.open}
                autoHideDuration={6000}
                anchorOrigin={{ vertical, horizontal }}
                key={vertical + horizontal}
                sx={{ margin: "0px 15px 15px 0px" }}
                onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarData.type} sx={{ width: "100%" }}>
                    {snackbarData.msg}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default SignUp;
