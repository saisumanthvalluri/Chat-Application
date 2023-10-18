import { ThreeDots } from "react-loader-spinner";

export const ThreeDotsLoader = (h, w, r, c) => {
    return (
        <ThreeDots
            wrapperStyle={{ alignSelf: "center" }}
            height={h}
            width={w}
            radius={r}
            color={c}
            ariaLabel="three-dots-loading"
            visible={true}
        />
    );
};
