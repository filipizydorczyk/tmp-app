export type RefreshDTO = {
    refreshToken: string;
};

/**
 * Function to check if dto is valid. It is suppose
 * to be used while fetching body from REST request
 * @param object dto to be validated
 * @returns boolean if obejct is valid
 */
export const isRefreshDTOValid = (object: RefreshDTO) => {
    if (!object) {
        return false;
    }
    return typeof object.refreshToken === "string";
};
