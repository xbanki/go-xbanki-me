import { DateTime }        from 'luxon';
import { Store, mapState } from 'vuex';
import { defineComponent } from 'vue';

import { ModuleState, FormatToken, FormatDelimiter, ClockConvention, DELIMITER_DESCRIPTION } from '@/lib/store_settings';
import { TimerManager }                                                                      from '@/lib/timers';

import draggable from 'vuedraggable';

import store from '@/lib/store';

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
     * Manages what format we should display the clock in.
     * @enum {ClockConvention}
     */
    convention: ClockConvention;

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
 * Display states for all tokens & other items.
 */
interface ComponentStateDisplay {

    /**
     * Dynamic token updater function IDs.
     */
    ids: symbol[];

    // All other keys!
    [key: string]: any;
}

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Denotes wether or not one of the draggable areas is in dragging mode.
     * @type {boolean}
     */
    dragging: boolean;

    /**
     * Active format data.
     * @type {ComponentStateFormat}
     */
    format: ComponentStateFormat;

    /**
     * Display states which get updated with timers.
     * @type {ComponentStateDisplay}
     */
    display: ComponentStateDisplay;

    /**
     * Internal delimiter tracking object.
     * @type {ComponentStateDelimiters}
     */
    delimiters: ComponentStateDelimiters;
}

/**
 * Denotes which update group this token belongs in.
 */
enum TokenUpdateType {
    IMMEDIATE = 'UPDATE_GROUP_IMMEDIATE', // Updates every milisecond
    LAZY      = 'UPDATE_GROUP_LAZY',      // Updates every second
    LATE      = 'UPDATE_GROUP_LATE'       // Updates every minute
}

/**
 * Table of "tokens", which appear in the format string. Each value of this table
 * represents which timer group this token belongs to. Only tokens which are not
 * updated every hour appear here.
 */
const TOKEN_UPDATE_TABLE: Record<string, TokenUpdateType> = {
    m:   TokenUpdateType.LATE,
    mm:  TokenUpdateType.LATE,
    s:   TokenUpdateType.LAZY,
    ss:  TokenUpdateType.LAZY,
    SSS: TokenUpdateType.IMMEDIATE
};

/**
 * Maximum number of delimiters allowed in the inactive pool.
 */
const MAXIMUM_DELIMITERS_INACTIVE = 3;

/**
 * Maximum number of delmiters allowed in the pool overall.
 */
const MAXIMUM_DELIMITERS_OVERALL = 10;

export default defineComponent({

    components: { draggable },

    data() {
        const typed_store = store as Store<{ settingsStore: ModuleState }>;

        // Format object state

        const convention = typed_store.state.settingsStore.time_convention;

        const delimiter = typed_store.state.settingsStore.time_delimiter;

        const inactive = typed_store.state.settingsStore.time_format_inactive;

        const active = typed_store.state.settingsStore.time_format_active;

        // Delimiter tracking state

        const inactive_delimiters = function() { let i = 0; inactive.forEach((el) => { if (el.delimiter) i+=1; });  return i; }();

        const active_delimiters = function() { let i = 0; active.forEach((el) => { if (el.delimiter) i+=1; });  return i; }();

        const disable_remove = inactive_delimiters + active_delimiters >= 1 ? false : true;

        const disable_add = (inactive_delimiters >= MAXIMUM_DELIMITERS_INACTIVE || active_delimiters + inactive_delimiters >= MAXIMUM_DELIMITERS_OVERALL) ? true : false;

        // Display object state

        const time = DateTime.now().toFormat(typed_store.state.settingsStore.time_display_format);

        const ids: symbol[] = [];

        // Constants

        const dragging = false;

        // Final objects

        const delimiters: ComponentStateDelimiters = {
            inactive_delimiters,
            active_delimiters,
            disable_remove,
            disable_add
        };

        const display: ComponentStateDisplay = {
            time,
            ids
        };

        const format: ComponentStateFormat = {
            convention,
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

    mounted() { this.$nextTick(() => { this.set_up_timer_refreshing(); this.update_convention(this.settingsStore.time_convention); }); },

    methods: {

        /**
         * Refreshes all internal timers based on the token input.
         */
        set_up_timer_refreshing() {

            // Millisecond updater
            const UPDATE_GROUP_IMMEDIATE = TimerManager.AddTimerGroup(TokenUpdateType.IMMEDIATE, 1);

            // Second updater
            const UPDATE_GROUP_LAZY = TimerManager.AddTimerGroup(TokenUpdateType.LAZY, 1000);

            // Minute updater
            const UPDATE_GROUP_LATE = TimerManager.AddTimerGroup(TokenUpdateType.LAZY, 60000);

            // Get all of the format tokens & update them 
            for (const item of [...this.state.format.active, ...this.state.format.inactive]) {

                if (item.delimiter) continue;

                // Dynamic token case
                if (item?.dynamic && item?.token) {

                    if (item?.token == 'HOUR_UNPADDED') {

                        if (this.state.format.convention == ClockConvention.AMERICAN) {

                            this.state.display.ids.push(TimerManager.AddGroupFunction(TokenUpdateType.LAZY, () => this.state.display[item.token as string] = DateTime.now().toFormat('h')));

                            this.state.display[item.token as string] = DateTime.now().toFormat('h');
                        }

                        if (this.state.format.convention == ClockConvention.EUROPEAN) {

                            this.state.display.ids.push(TimerManager.AddGroupFunction(TokenUpdateType.LAZY, () => this.state.display[item.token as string] = DateTime.now().toFormat('H')));

                            this.state.display[item.token as string] = DateTime.now().toFormat('H');
                        }
                    }

                    if (item?.token == 'HOUR_PADDED') {

                        if (this.state.format.convention == ClockConvention.AMERICAN) {

                            this.state.display.ids.push(TimerManager.AddGroupFunction(TokenUpdateType.LAZY, () => this.state.display[item.token as string] = DateTime.now().toFormat('hh')));

                            this.state.display[item.token as string] = DateTime.now().toFormat('hh');
                        }

                        if (this.state.format.convention == ClockConvention.EUROPEAN) {

                            this.state.display.ids.push(TimerManager.AddGroupFunction(TokenUpdateType.LAZY, () => this.state.display[item.token as string] = DateTime.now().toFormat('HH')));

                            this.state.display[item.token as string] = DateTime.now().toFormat('HH');
                        }
                    }
                }

                // Non-dynamic token case
                if (item?.token && !item.dynamic) {
                    const TARGET_GROUP = TOKEN_UPDATE_TABLE[item.token] ?? TokenUpdateType.LAZY;

                    TimerManager.AddGroupFunction(TARGET_GROUP, () => this.state.display[item.token as string] = DateTime.now().toFormat(item.token as string));

                    this.state.display[item.token as string] = DateTime.now().toFormat(item.token as string);
                }
            }

            // We start the milisecond timer because it literally fires every tick
            UPDATE_GROUP_IMMEDIATE?.();

            const now = DateTime.now();

            this.$nextTick(
                () => {
                    setTimeout(() => UPDATE_GROUP_LAZY?.(), 1000 - now.millisecond);
                    setTimeout(() => UPDATE_GROUP_LATE?.(), 60000 - ((now.second * 1000) - now.millisecond));
                }
            );
        },

        /**
         * Handles format changes in the settings panel, displaying them
         * automatically on screen.
         */
        update_active_format() { store.dispatch('settingsStore/SetTimeFormat', [this.state.format.active, this.state.format.inactive]); },

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
         * Updates the currently used date display delimiter.
         */
        update_delimiter() {

            if (this.state.format.delimiter != this.settingsStore.time_delimiter) {

                store.commit('settingsStore/UPDATE_TIME_FORMAT_DELIMITER', this.state.format.delimiter);

                this.update_active_format();
            }
        },

        /**
         * Updates dynamic tokens with given clock convention automatically.
         */
        update_convention(state: ClockConvention) {

            this.state.format.convention = state;

            /**
             * Enables or disables the meridem token.
             * @param {boolean} disabled Should the token be disabled?
             */
            const enable_disable_meridem = (disabled: boolean) => {
                for (const item of this.state.format.active) if (item.token && item.token == 'a') {
                    item.disabled = disabled;
                    return;
                }

                for (const item of this.state.format.inactive) if (item.token && item.token == 'a') {
                    item.disabled = disabled;
                    return;
                }
            };

            // Handle AM/PM clock updates
            if (state == ClockConvention.AMERICAN) {

                // Remove active updaters
                this.state.display.ids = this.state.display.ids.filter(
                    (id) => {
                        TimerManager.RemoveGroupFunction(TokenUpdateType.LAZY, id);

                        return false;
                    }
                );

                this.state.display.ids.push(TimerManager.AddGroupFunction(TokenUpdateType.LAZY, () => this.state.display['HOUR_UNPADDED'] = DateTime.now().toFormat('h')));
                this.state.display.ids.push(TimerManager.AddGroupFunction(TokenUpdateType.LAZY, () => this.state.display['HOUR_PADDED'] = DateTime.now().toFormat('hh')));

                this.state.display['HOUR_UNPADDED'] = DateTime.now().toFormat('h');
                this.state.display['HOUR_PADDED'] = DateTime.now().toFormat('hh');

                enable_disable_meridem(false);
            }

            // Handle 24H clock updates
            else if (state == ClockConvention.EUROPEAN) {
                // Remove active updaters
                this.state.display.ids = this.state.display.ids.filter(
                    (id) => {
                        TimerManager.RemoveGroupFunction(TokenUpdateType.LAZY, id);

                        return false;
                    }
                );

                this.state.display.ids.push(TimerManager.AddGroupFunction(TokenUpdateType.LAZY, () => this.state.display['HOUR_UNPADDED'] = DateTime.now().toFormat('H')));
                this.state.display.ids.push(TimerManager.AddGroupFunction(TokenUpdateType.LAZY, () => this.state.display['HOUR_PADDED'] = DateTime.now().toFormat('HH')));

                this.state.display['HOUR_UNPADDED'] = DateTime.now().toFormat('H');
                this.state.display['HOUR_PADDED'] = DateTime.now().toFormat('HH');

                enable_disable_meridem(true);
            }

            this.update_active_format();
        }
    },

    watch: {
        'settingsStore.time_convention'(state) { this.update_convention(state); }
    },

    computed: mapState(['settingsStore']),

    props: {
        standalone: {
            type: Boolean,
            required: false,
            default: false
        }
    }
});