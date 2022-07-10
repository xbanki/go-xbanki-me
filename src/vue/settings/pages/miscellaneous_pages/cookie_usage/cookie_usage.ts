/* eslint-disable @typescript-eslint/ban-ts-comment */

import { DateTime }        from 'luxon';
import { defineComponent } from 'vue';

import article from './cookie_usage.md';
import store   from '@/lib/store';

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Rendered Markdown containing the content (explanation) of our cookie usage.
     * @type {string}
     */
    content: string;

    /**
     * Last time this statement has been revised.
     * @type {DateTime}
     */
    revision: DateTime;

    /**
     * Current version of this statement.
     * @type {string}
     */
    version: string;

    /**
     * Disables accepting cookie usage button.
     * @type {boolean}
     */
    disable: boolean;
}

export default defineComponent({

    data() {

        const revision: DateTime = DateTime.fromRFC2822(article.metadata.latest_revision);

        const version: string = article.metadata.version;

        const content: string = article.html;

        // @ts-ignore
        const disable: boolean = this.critical_only;

        // Assembled state object

        const state: ComponentState = {
            revision,
            version,
            content,
            disable
        };

        return { state };
    },

    methods: {
        accept_cookie_usage() {

            store.commit('eventBusStore/ENABLE_DATA_PERSISTENCE');

            this.$emit('close');
        },

        get_revision_timestamp: (date: DateTime) => `Last revision: ${ date.toLocaleString(DateTime.DATETIME_FULL) }`,

        get_current_version: (version: string) => `Version: ${version}`
    },

    emits: ['close'],

    inject: ['critical_only']
});