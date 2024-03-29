/* eslint-disable */

declare module 'virtual:licenses' {
    interface LicenseData {
        name: string;
        repository?: string;
        author?: string;
        email?: string;
        url?: string;
        license?: string;
        text?: string;
    }
    type LicenseItem = Record<string, LicenseData>;
    const data: LicenseItem;
    export default data;
}