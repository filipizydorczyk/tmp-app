import React from "react";
import catOpenEyes from "./cat-closed-eyes-wide-open.png";
import catClosedEyes from "./cat-closed-eyes.png";

type CatPuppyProps = {
    eyes: "open" | "closed";
    style?: React.CSSProperties;
};

function CatPuppy({ eyes, style }: CatPuppyProps) {
    return (
        <img
            src={eyes === "open" ? catOpenEyes : catClosedEyes}
            style={style}
        />
    );
}

export default CatPuppy;
