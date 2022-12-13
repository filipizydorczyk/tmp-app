export const CTRL_PLUS = "ctrl-plus";
export const CTRL_S = "ctrl-s";

type Shortcut = typeof CTRL_PLUS | typeof CTRL_S;
type ShortcutActions = [Shortcut, () => void][];

const CONDITIONS: Record<Shortcut, (ev: KeyboardEvent) => boolean> = {
    [CTRL_PLUS]: (ev: KeyboardEvent) => ev.ctrlKey && ev.key === "+",
    [CTRL_S]: (ev: KeyboardEvent) => ev.ctrlKey && ev.key === "s",
};

/**
 * Custom hook to create keybord shortcuts for aplications.
 * This hook is desgned specifically for this app so api allows
 * you to dfine actions only for selected key combinations. U can
 * export constants that are keys that u need to define actions for.
 *
 * @param actions json object that has shortcut constants as a key
 * (eg. `CTRL_PLUS` exported from this module) and functions to be
 * performed on selected key combination as value. Eq.
 * `{ [CTRL_PLUS]: () => setShowCreateModal(true) }`
 */
const useShortcuts = (actions: ShortcutActions) => {
    document.addEventListener("keydown", (ev) => {
        actions.forEach((tuple) => {
            const actionKey = tuple[0];
            if (CONDITIONS[actionKey](ev)) {
                ev.preventDefault();
                tuple[1]();
            }
        });
    });
};

export default useShortcuts;
