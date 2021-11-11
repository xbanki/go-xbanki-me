import { DateTime } from 'luxon';

/**
 * /api/get-daily-background endpoint parsed data.
 * @see {axios.get}
 */
export interface GetDailyBackgroundData {

    /**
     * Image data body.
     * @type {object}
     */
    data: {

        /**
         * Image short expiery date.
         * @type {DateTime}
         */
        expires_on: DateTime;

        /**
         * Copyright holder/ author information.
         * @type {string}
         */
        copyright: string;

        /**
         * Endpoint URL for the PNG image source.
         * @type {string}
         */
        url: string;
    }

    /**
     * Message of operation success.
     * @type {string}
     */
    message: string;

    /**
     * HTTP status code.
     * @type {number}
     */
    status: number;
}