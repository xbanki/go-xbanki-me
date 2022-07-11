const api_url = 'https://go.xbanki.me/api';

const dev_mode = import.meta?.env?.DEV;

export default Object.freeze({

    /**
     * Serverless functions API endpoint URL.
     * @type {string}
     */
    api_url,

    /**
     * Application in development mode.
     */
    dev_mode
});