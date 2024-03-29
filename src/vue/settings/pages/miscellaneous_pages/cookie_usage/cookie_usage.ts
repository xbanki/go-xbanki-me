import { mapState }        from 'vuex';
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
}

export default defineComponent({

    data() {

        const revision: DateTime = DateTime.fromRFC2822(article.metadata.latest_revision);

        const version: string = article.metadata.version;

        const content: string = article.html;

        // Assembled state object

        const state: ComponentState = {
            revision,
            version,
            content
        };

        return { state };
    },

    methods: {

        /**
         * Critical only method. Enables data persistence & closes the settings panel,
         * which is effectively consent from the user.
         */
        accept_cookie_usage() {
            store.commit('componentSettingsStore/UPDATE_RENDER_STATE', false);
            store.commit('eventBusStore/ENABLE_DATA_PERSISTENCE');
        },

        /**
         * Returns a formatted date sting of the last revision.
         */
        get_revision_timestamp: (date: DateTime) => `Last revision: ${ date.toLocaleString(DateTime.DATETIME_FULL) }`,

        /**
         * Returns a formatted version string.
         */
        get_current_version: (version: string) => `Version: ${version}`
    },

    computed: mapState(['componentSettingsStore']),

    props: {
        standalone: {
            type: Boolean,
            required: false,
            default: false
        }
    }
});