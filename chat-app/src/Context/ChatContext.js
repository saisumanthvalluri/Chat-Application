import React from "react";

const newTaskContext = React.createContext({
    activeRoomDetails: {},
    setActiveRoomDetails: () => {},
});

export default newTaskContext;
