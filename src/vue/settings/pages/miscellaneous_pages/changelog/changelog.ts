import { DateTime }        from 'luxon';
import { defineComponent } from 'vue';

import JanTenth from './articles/jan-10_0-2-0.md';
import JanFifth from './articles/jan-5_0-1-0.md';

/**
 * Single changelog Markdown article.
 */
interface ChangelogArticle {

    /**
     * Version this article represents.
     * @type {string}
     */
    version: string;

    /**
     * Date of which this update was released.
     * @type {string}
     */
    date: DateTime;

    /**
     * Rendered Markdown HTML.
     * @type {string}
     */
    html: string;

    /**
     * Only defined if this log is considered legacy (not latest).
     * @type {boolean | undefined}
     */
    active?: boolean;
}

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Current update changelog.
     * @type {ChangelogArticle}
     */
    latest: ChangelogArticle;

    /**
     * History of all older updates.
     * @type {Array<ChangelogArticle>}
     */
    legacy: ChangelogArticle[];
}

const GIT_COMMIT_FORMAT = 'EEE MMM d HH:mm:ss yyyy ZZZ';

export default defineComponent({
    data() {

        const latest: ChangelogArticle = { version: JanTenth.metadata.version, date: DateTime.fromFormat(JanTenth.metadata.date, GIT_COMMIT_FORMAT), html: JanTenth.html };

        const legacy: ChangelogArticle[] = [
            { version: JanFifth.metadata.version, date: DateTime.fromFormat(JanFifth.metadata.date, GIT_COMMIT_FORMAT), html: JanFifth.html, active: false }
        ];

        // Assembled state component

        const state: ComponentState = {
            legacy,
            latest
        };

        return { state };
    },

    methods: {
        toggle_dropdown_state: (target: ChangelogArticle) => target.active ? target.active = false : target.active = true,

        get_styled_datetime: (input: DateTime) => `On ${ input.toFormat('f') }`
    }
});