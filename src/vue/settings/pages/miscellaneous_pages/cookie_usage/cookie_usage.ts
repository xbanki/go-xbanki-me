import { DateTime }        from 'luxon';
import { defineComponent } from 'vue';

import article from './cookie_usage.md';

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

        // @TO-DO (xbanki): Get this data in a RFC
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
        get_revision_timestamp: (date: DateTime) => `Last revision: ${ date.toLocaleString(DateTime.DATETIME_FULL) }`,

        get_current_version: (version: string) => `Version: ${version}`
    }
});