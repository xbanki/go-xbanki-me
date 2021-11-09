const api_url = import.meta.env.DEV ? 'http://localhost:3000/api' : 'https://go.xbanki.me/api';

export default Object.freeze({

    /**
     * Serverless functions API endpoint URL.
     * @type {string}
     */
    api_url
});