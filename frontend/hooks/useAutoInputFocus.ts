/**
 * Thanks to this hook whe you start typing pointed input
 * will be focused so that you dont have to select it yourself
 * with mouse
 * @param passwdRef refrence to input you want to focus on click
 */
const useAutoInputFocus = (
    passwdRef: React.RefObject<HTMLInputElement> | null
) => {
    document.addEventListener("keydown", () => {
        if (passwdRef) {
            passwdRef.current?.focus();
        }
    });
};

export default useAutoInputFocus;
