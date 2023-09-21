import React from "react";
import { apiConstants } from "../Components/AppConstants";

const newTaskContext = React.createContext({
    activeRoomDetails: {},
    setActiveRoomDetails: () => {},
    userData: {},
    setUserData: () => {},
    userDataStatus: apiConstants.initial,
    setUserDataStatus: () => {},
});

export default newTaskContext;
