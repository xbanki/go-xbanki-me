import { DateTime }        from 'luxon';
import { Store, mapState } from 'vuex';
import { defineComponent } from 'vue';

import draggable from 'vuedraggable';

import { ModuleState, FormatDelimiter, FormatToken, DELIMITER_DESCRIPTION } from '@/lib/store_settings';

import TimerManager from '@/lib/timers';
import store        from '@/lib/store';

/**
 * Component delimiter tracking.
 */
interface ComponentStateDelimiters {

    /**
     * Number of delimiter tokens in the `active` rail.
     * @type {number}
     */
    active_delimiters: number;

    /**
     * Number of delimiter tokens in the `inactive` rail.
     * @type {number}
     */
    inactive_delimiters: number;

    /**
     * Disables removing delimiters from the currently active pool.
     * @type {boolean}
     */
    disable_remove: boolean;

    /**
     * Disables adding new delimiters to the currently active pool.
     * @type {boolean}
     */
    disable_add: boolean;
}

/**
 * Active format state.
 */
interface ComponentStateFormat {

    /**
     * Active time display delimiter.
     * @enum {FormatDelimiter}
     */
    delimiter: FormatDelimiter;

    /**
     * Currently active format.
     * @type {Array<FormatToken>}
     */
    active: FormatToken[];

    /**
     * Inactive format tokens.
     * @type {Array<FormatToken>}
     */
    inactive: FormatToken[];
}

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Active format data.
     * @type {ComponentStateFormat}
     */
    format: ComponentStateFormat;

    /**
     * Delimiter tracking data.
     */
    delimiters: ComponentStateDelimiters;

    /**
     * Updated display tokens.
     * @type {Record<string, string>}
     */
    display: Record<string, string>;

    /**
     * Current format dragging state.
     * @type {boolean}
     */
    dragging: boolean;
}

/**
 * Token updater group name constant.
 */
const UPDATE_GROUP = 'UPDATE_GROUP_ANCIENT';

/**
 * Maximum number of delimiters allowed in the inactive pool.
 */
const MAXIMUM_DELIMITERS_INACTIVE = 3;

/**
 * Maximum number of delmiters allowed in the pool overall.
 */
const MAXIMUM_DELIMITERS_OVERALL = 10;

export default defineComponent({

    data() {
        const typed_store = store as Store<{ settingsStore: ModuleState }>;

        // Format object state

        const delimiter = typed_store.state.settingsStore.date_delimiter;

        const inactive = typed_store.state.settingsStore.date_format_inactive;

        const active = typed_store.state.settingsStore.date_format_active;

        // Delimiter tracking state

        const inactive_delimiters = function() { let i = 0; inactive.forEach((el) => { if (el.delimiter) i+=1; });  return i; }();

        const active_delimiters = function() { let i = 0; active.forEach((el) => { if (el.delimiter) i+=1; });  return i; }();

        const disable_remove = inactive_delimiters + active_delimiters >= 1 ? false : true;

        const disable_add = (inactive_delimiters >= MAXIMUM_DELIMITERS_INACTIVE || active_delimiters + inactive_delimiters >= MAXIMUM_DELIMITERS_OVERALL) ? true : false;


        // Constants

        const dragging = false;

        const display: Record<string, string> = { };

        // Final objects

        const delimiters: ComponentStateDelimiters = {
            inactive_delimiters,
            active_delimiters,
            disable_remove,
            disable_add
        };

        const format: ComponentStateFormat = {
            delimiter,
            inactive,
            active
        };

        const state: ComponentState = {
            delimiters,
            dragging,
            display,
            format
        };

        return { state };
    },

    mounted() { this.$nextTick(() => this.set_up_timer_refreshing()); },

    methods: {

        /**
         * Refresh all token displays once every hour.
         */
        set_up_timer_refreshing() {

            // Every hour updater
            const UPDATE_GROUP_ANCIENT = TimerManager.AddTimerGroup(UPDATE_GROUP, 3600000);

            // Get all of the format tokens & update them
            for (const item of [...this.state.format.active, ...this.state.format.inactive]) {

                if (item.delimiter) continue;

                TimerManager.AddGroupFunction(UPDATE_GROUP, () => this.state.display[item.token as string] = DateTime.now().toFormat(item.token as string));

                this.state.display[item.token as string] = DateTime.now().toFormat(item.token as string);
            }

            const now = DateTime.now();

            setTimeout(() => UPDATE_GROUP_ANCIENT?.(), 3600000 - (now.millisecond + (now.second * 1000) + (now.minute * 60000)));
        },

        /**
         * Updates the currently used date display delimiter.
         */
        update_delimiter() {

            if (this.state.format.delimiter != this.settingsStore.time_delimiter) {

                store.commit('settingsStore/UPDATE_DATE_FORMAT_DELIMITER', this.state.format.delimiter);

                this.update_active_format();
            }
        },

        /**
         * Handles inactive rail format updates.
         */
        handle_drag_event(event: any) {

            if (event?.removed && event.removed.element.delimiter) {

                this.state.delimiters.inactive_delimiters -= 1;
                this.state.delimiters.active_delimiters += 1;

                if (!(this.state.delimiters.active_delimiters + this.state.delimiters.inactive_delimiters >= MAXIMUM_DELIMITERS_OVERALL))
                    this.state.delimiters.disable_add = false;
            }

            if (event?.added && event.added.element.delimiter) {
                this.state.delimiters.inactive_delimiters += 1;
                this.state.delimiters.active_delimiters -= 1;

                if (this.state.delimiters.inactive_delimiters >= MAXIMUM_DELIMITERS_INACTIVE)
                    this.state.delimiters.disable_add = true;
            }

            this.update_active_format();
        },

        /**
         * Adds a new delmiter to the pool.
         */
        add_new_delimiter() {
            const index = this.state.format.active.length + this.state.format.inactive.length;

            this.state.format.inactive.push({ index, disabled: false, delimiter: true, description: DELIMITER_DESCRIPTION });

            this.state.delimiters.inactive_delimiters += 1;

            if (this.state.delimiters.inactive_delimiters >= MAXIMUM_DELIMITERS_INACTIVE || this.state.delimiters.active_delimiters + this.state.delimiters.inactive_delimiters >= MAXIMUM_DELIMITERS_OVERALL)
                this.state.delimiters.disable_add = true;

            this.state.delimiters.disable_remove = false;

            this.update_active_format();
        },

        /**
         * Removes the newest delimiter in the inactive pool, OR the oldest from the
         * active pool.
         */
        remove_newest_delimiter() {

            /**
             * Updates button activation state after delimiter operation.
             */
            const update_boundaries = (): void => {

                if (this.state.delimiters.active_delimiters + this.state.delimiters.inactive_delimiters <= 0) {
                    this.state.delimiters.disable_remove = true;
                }

                this.state.delimiters.disable_add = false;

                this.update_active_format();
            };

            // Remove the newest delimiter in the inactive rail
            for (let i = this.state.format.inactive.length; i >= 0; i--) {

                const item = this.state.format.inactive[i];

                if (item?.delimiter) {

                    this.state.format.inactive.splice(i, 1);
                    this.state.delimiters.inactive_delimiters -= 1;

                    update_boundaries();

                    return;
                }
            }

            // Remove the oldest delimiter in the active rail
            for (let i = 0; i <= this.state.format.active.length; i++) {

                const item = this.state.format.active[i];

                if (item?.delimiter) {

                    this.state.format.active.splice(i, 1);
                    this.state.delimiters.active_delimiters -= 1;

                    update_boundaries();

                    return;
                }
            }
        },

        /**
         * Gets the display item for a delimiter.
         */
         get_delimiter(delimiter: FormatDelimiter) {
            switch (delimiter) {
                case FormatDelimiter.COLON : return ':';
                case FormatDelimiter.SLASH : return '/';
                case FormatDelimiter.COMMA : return ',';
                case FormatDelimiter.SPACE : return '␣';
                case FormatDelimiter.DASH  : return '-';
                case FormatDelimiter.DOT   : return '.';
            }
        },

        update_active_format() { store.dispatch('settingsStore/SetDateFormat', [this.state.format.active, this.state.format.inactive]); }
    },

    components: { draggable },

    computed: mapState(['settingsStore'])
});