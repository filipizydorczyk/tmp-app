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

/**
 * `page` - is current returned page
 * `size` - how many elements are in page
 * `pages` - amount of total pages
 * `total` - amount of total elements
 * `content` - array of current page content
 */
export type Page<Content> = {
    page: number;
    size: number;
    pages: number;
    total: number;
    content: Content[];
};
