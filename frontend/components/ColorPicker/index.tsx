import React from "react";

type ColorPickerProps = {
    colors: string[];
    onColorSelected: (color: string) => void;
};

const styles = {
    width: "1rem",
    height: "1rem",
    borderRadius: "100%",
    marginRight: "0.25rem",
    border: "0.5px solid #aaa",
    cursor: "pointer",
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
                    style={{ ...styles, backgroundColor: color }}
                ></div>
            ))}
            <div
                key="#ffffff"
                onClick={() => {
                    onColorSelected("#ffffff");
                }}
                style={{ ...styles, backgroundColor: "#ffffff" }}
            ></div>
        </div>
    );
}

export default ColorPicker;
