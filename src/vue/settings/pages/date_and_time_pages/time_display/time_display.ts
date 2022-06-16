import { DateTime }        from 'luxon';
import { Store, mapState } from 'vuex';
import { defineComponent } from 'vue';

import { ModuleState, FormatDelimiter } from '@/lib/store_settings';
import { TimerManager }                 from '@/lib/timers';

import draggable from 'vuedraggable';

import store from '@/lib/store';

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
 * Display states for all tokens & other items.
 */
interface ComponentStateDisplay {

    /**
     * Time clock display.
     * @type {string}
     */
    time: string;

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
}

/**
 * Time/ Date format item.
 */
export interface FormatToken {

    /**
     * Order index which determines the *starting* position in the format array(s).
     * @type {number}
     */
    index: number;

    /**
     * Discriminates between a delimiter item and a format option item.
     * @type {boolean}
     */
    delimiter: boolean;

    /**
     * Description of item which is shown when the hover event is active.
     * @type {string}
     */
    description: string;

    /**
     * If item is format token, specifies wether this token should have a special display.
     * @type {boolean}
     */
    dynamic?: boolean;

    /**
     * Luxon format token which is ignored in cases:
     * 
     * `<FormatToken>.dynamic: true`
     * 
     * `<FormatToken>.delimiter: true`
     * @type {string}
     */
    token?: string;
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

export default defineComponent({

    data() {
        const typed_store = store as Store<{ settingsStore: ModuleState }>;

        // Format object state

        const delimiter = typed_store.state.settingsStore.time_delimiter;

        const inactive = typed_store.state.settingsStore.time_format_inactive;

        const active = typed_store.state.settingsStore.time_format_active;

        // Display object state

        const time = DateTime.now().toFormat(typed_store.state.settingsStore.time_display_format);

        // Constants

        const dragging = false;

        // Final objects

        const display: ComponentStateDisplay = {
            time
        };

        const format: ComponentStateFormat = {
            delimiter,
            inactive,
            active
        };

        const state: ComponentState = {
            dragging,
            display,
            format
        };

        return { state };
    },

    mounted() { this.$nextTick(() => this.set_up_timer_refreshing()); },

    methods: {

        /**
         * Refreshes all internal timers based on the token input.
         */
        set_up_timer_refreshing() { this; },

        /**
         * Handles format updates.
         */
        handle_drag_event(event: any) { this; },

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
        }
    },

    components: { draggable },

    computed: mapState(['settingsStore'])
});