export const CTR_PLUS = "ctrl-plus";

type Shortcut = typeof CTR_PLUS;

const CONDITIONS: Record<Shortcut, (ev: KeyboardEvent) => boolean> = {
    [CTR_PLUS]: (ev: KeyboardEvent) => ev.ctrlKey && ev.key === "+",
};

/**
 * Custom hook to create keybord shortcuts for aplications.
 * This hook is desgned specifically for this app so api allows
 * you to dfine actions only for selected key combinations. U can
 * export constants that are keys that u need to define actions for.
 *
 * @param actions json object that has shortcut constants as a key
 * (eg. `CTR_PLUS` exported from this module) and functions to be
 * performed on selected key combination as value. Eq.
 * `{ [CTR_PLUS]: () => setShowCreateModal(true) }`
 */
const useShortcuts = (actions: Record<Shortcut, () => void>) => {
    document.addEventListener("keydown", (ev) => {
        Object.keys(actions).forEach((key) => {
            const actionKey = key as Shortcut;
            if (CONDITIONS[actionKey](ev)) {
                ev.preventDefault();
                actions[actionKey]();
            }
        });
    });
};

export default useShortcuts;
