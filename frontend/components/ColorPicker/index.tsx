import React from "react";

type ColorPickerProps = {
    colors: string[];
    onColorSelected: (color: string) => void;
};

function ColorPicker({ colors, onColorSelected }: ColorPickerProps) {
    return (
        <div className="colors-container d-flex justify-content-start">
            {colors.map((color) => (
                <div
                    key={color}
                    onClick={() => {
                        onColorSelected(color);
                    }}
                    style={{
                        width: "1rem",
                        height: "1rem",
                        backgroundColor: color,
                        borderRadius: "100%",
                        marginRight: "0.25rem",
                        border: "0.5px solid #aaa",
                        cursor: "pointer",
                    }}
                ></div>
            ))}
        </div>
    );
}

export default ColorPicker;
