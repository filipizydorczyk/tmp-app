/**
 * Function to check if provided string is valid ISO formated date
 * @param str string to be checked
 * @returns boolean if string is ISO string or not
 */
export const isIsoDate = (str: string): boolean => {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
    var d = new Date(str);
    return d.toISOString() === str;
};
