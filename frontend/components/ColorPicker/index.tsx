import React from "react";

type ColorPickerProps = {
    colors: string[];
};

function ColorPicker({ colors }: ColorPickerProps) {
    return (
        <div className="colors-container d-flex justify-content-start">
            {colors.map((color) => (
                <div
                    style={{
                        width: "1rem",
                        height: "1rem",
                        backgroundColor: color,
                        borderRadius: "100%",
                        marginRight: "0.25rem",
                        border: "0.5px solid #aaa",
                    }}
                ></div>
            ))}
        </div>
    );
}

export default ColorPicker;
