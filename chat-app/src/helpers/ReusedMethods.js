// random color generator based on the room name
export const stringToColor = (string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
};

export const stringAvatar = (name, size) => {
    const roomNamePair = name.split(" ");
    const roomTextLogo =
        roomNamePair.length > 1
            ? `${roomNamePair[0][0].toUpperCase()}${roomNamePair[roomNamePair.length - 1][0].toUpperCase()}`
            : roomNamePair[0][0].toUpperCase();
    return {
        sx: {
            bgcolor: stringToColor(name),
            width: size?.width,
            height: size?.height,
            fontSize: size?.fontSize,
            letterSpacing: "2px",
            fontWeight: size?.fontWeight,
            marginTop: size?.marginTop,
        },
        children: roomTextLogo,
    };
};
