import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatApp from "./Components/ChatApp";
import SignUp from "./Components/SignUp";
import SignIn from "./Components/SignIn";
import "./App.css";

const App = () => (
    <Router>
        <Routes>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            {/* <Route path='/forgot-password' element={<ForgotPassword />} /> */}
            <Route path="/" element={<ChatApp />} />
            {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
    </Router>
);

export default App;
