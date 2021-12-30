import { mapState }        from 'vuex';
import { defineComponent } from 'vue';

import draggable from 'vuedraggable';

import { ClockConvention, FormatDelimiter, DateDisplayLocation, DateTimeSize, ModuleState } from '@/lib/store_settings';

import store from '@/lib/store';

// TO-DO(xbanki): Implement a better solution for delimiter tracking. This is awful.

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Currently selected clock convention.
     * @enum {ClockConvention}
     */
    active_clock_convention: ClockConvention;

    /**
     * Currently selected date delimeter (separator).
     * @enum {FormatDelimiter}
     */
    active_date_delimiter: FormatDelimiter;

    /**
     * Currently selected time delimeter (separator).
     * @enum {FormatDelimiter}
     */
    active_time_delimiter: FormatDelimiter;

    /**
     * Location where the date should be displayed on the clock component.
     * @enum {DateDisplayLocation}
     */
    active_date_display_location: DateDisplayLocation;

    /**
     * Date display sizing option.
     * @enum {DateTimeSize}
     */
    active_date_size: DateTimeSize;

    /**
     * Time display sizing option.
     * @enum {DateTimeSize}
     */
    active_time_size: DateTimeSize;

    /**
     * Indicates wether or not user is editing the date display format.
     * @type {boolean}
     */
    date_format_dragging: boolean;

    /**
     * Indicates wether or not user is editing the time display format.
     * @type {boolean}
     */
    time_format_dragging: boolean;

    /**
     * Number of date delimiters active currently.
     * @type {number}
     */
    active_date_delimiters: number;

    /**
     * Number of time delimiters active currently.
     * @type {number}
     */
    active_time_delimiters: number;

    /**
     * Disables removing newest delimiter from the date list.
     * @type {boolean}
     */
    disable_remove_date_delimiter: boolean;

    /**
     * Disables adding new delimiter to the date list.
     * @type {boolean}
     */
    disable_add_date_delimiter: boolean;

    /**
     * Currently "active" number of inactive date delimiters.
     * @type {number}
     */
    inactive_date_delimiters: number;

    /**
     * Currently "active" number of inactive time delimiters.
     * @type {number}
     */
    inactive_time_delimiters: number;

    /**
     * Disables removing newest delimiter from the time list.
     * @type {boolean}
     */
     disable_remove_time_delimiter: boolean;

     /**
      * Disables adding new delimiter to the time list.
      * @type {boolean}
      */
     disable_add_time_delimiter: boolean;

    /**
     * Time delimiter display.
     * @type {string}
     */
    time_delimiter_display?: string;

    /**
     * Date delimiter display.
     * @type {string}
     */
    date_delimiter_display?: string;
}

/**
 * Component data internal description interface.
 */
interface ComponentData {

    /**
     * Time format availlable items.
     * @type {FormatToken}
     */
    time_format_active: Array<FormatToken>;

    /**
     * Time format items that have been disabled.
     * @type {Array<FormatToken>}
     */
    time_format_inactive: Array<FormatToken>;

    /**
     * Date format availlable items.
     * @type {FormatToken}
     */
     date_format_active: Array<FormatToken>;

     /**
      * Date format items that have been disabled.
      * @type {Array<FormatToken>}
      */
     date_format_inactive: Array<FormatToken>;

    /**
     * Minimum amount of delimiters allowed.
     * @type {number}
     */
    minimum_overall_delimiters: number;

    /**
     * Maximum overall delimiters allowed.
     * @type {number}
     */
    maximum_overall_delimiters: number;

    /**
     * Maximum allowed INACTIVE delimiters.
     * @type {number}
     */
    maximum_inactive_delimiters: number;
}

/**
 * Time/ Date format item.
 */
interface FormatToken {

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

export default defineComponent({

    components: { draggable },

    data( ) {
        const settingsState = store.state as { settingsStore: ModuleState };

        // NOTE(xbanki): this block looks fucking hideous?
        const state: ComponentState = {
            active_date_display_location: settingsState.settingsStore.date_display_position ?? DateDisplayLocation.BOTTOM,
            active_clock_convention: settingsState.settingsStore.time_convention ?? ClockConvention.EUROPEAN,
            active_date_delimiter: settingsState.settingsStore.date_delimiter ?? FormatDelimiter.COLON,
            active_time_delimiter: settingsState.settingsStore.time_delimiter ?? FormatDelimiter.COMMA,
            active_time_size: settingsState.settingsStore.time_size ?? DateTimeSize.MEDIUM,
            active_date_size: settingsState.settingsStore.date_size ?? DateTimeSize.SMALL,
            disable_remove_date_delimiter: false,
            disable_remove_time_delimiter: false,
            disable_add_date_delimiter: false,
            disable_add_time_delimiter: false,
            inactive_date_delimiters: 0,
            inactive_time_delimiters: 0,
            date_format_dragging: false,
            time_format_dragging: false,
            active_date_delimiters: 2,
            active_time_delimiters: 2
        };

        const delimiter_description = 'Display format items separator/ delimiter';

        const time_format_inactive: Array<FormatToken> = [ ];

        const time_format_active: Array<FormatToken> = [
            { delimiter: true, index: 0, description: delimiter_description },
            { delimiter: true, index: 1, description: delimiter_description }
        ];

        const date_format_inactive: Array<FormatToken> = [ ];

        const date_format_active: Array<FormatToken> = [
            { delimiter: true, index: 0, description: delimiter_description },
            { delimiter: true, index: 1, description: delimiter_description }
        ];

        const data: ComponentData = {
            maximum_inactive_delimiters: 3,
            maximum_overall_delimiters: 10,
            minimum_overall_delimiters: 0,
            date_format_inactive,
            time_format_inactive,
            date_format_active,
            time_format_active
        };

        return { state, data };
    },

    mounted( ) { this.$nextTick(( ) => this.update_delimiter_display( )); },

    methods: {
        update_realtime_options( ) {
            if (this.state.active_date_display_location != this.settingsStore.date_display_position) {
               store.commit('settingsStore/SET_DATE_DISPLAY_POSITION', this.state.active_date_display_location);
            }

            if (this.state.active_clock_convention != this.settingsStore.time_convention) {
                store.commit('settingsStore/SET_CLOCK_CONVENTION', this.state.active_clock_convention);
            }

            if (this.state.active_date_delimiter != this.settingsStore.date_delimiter) {
                store.commit('settingsStore/UPDATE_DATE_FORMAT_DELIMITER', this.state.active_date_delimiter);
            }

            if (this.state.active_time_delimiter != this.settingsStore.time_delimiter) {
                store.commit('settingsStore/UPDATE_TIME_FORMAT_DELIMITER', this.state.active_time_delimiter);
            }

            if (this.state.active_date_size != this.settingsStore.date_size) {
                store.commit('settingsStore/UPDATE_DATE_SIZE', this.state.active_date_size);
            }

            if (this.state.active_time_size != this.settingsStore.time_size) {
                store.commit('settingsStore/UPDATE_TIME_SIZE', this.state.active_time_size);
            }
        },

        add_new_date_delimiter( ) {
            const delimiters_index = this.state.active_date_delimiters + this.state.inactive_date_delimiters;

            this.data.date_format_inactive.push({ index: delimiters_index, delimiter: true, description: 'Display format items separator/ delimiter' });

            this.state.inactive_date_delimiters++;

            if (delimiters_index >= this.data.maximum_overall_delimiters || this.state.inactive_date_delimiters >= this.data.maximum_inactive_delimiters) {
                this.state.disable_add_date_delimiter = true;
            }

            this.state.disable_remove_date_delimiter = false;
        },

        remove_newest_date_delimiter( ) {
            let found_newest_delimiter = false;

            for (let i = this.data.date_format_inactive.length; i >= 0; i--) {
                const element = this.data.date_format_inactive[i];

                if (element?.delimiter) {
                    found_newest_delimiter = true;

                    this.data.date_format_inactive.splice(i, 1);
                    this.state.inactive_date_delimiters--;

                    break;
                }
            }

            if (!found_newest_delimiter) for (const element of this.data.date_format_active) {
                if (element?.delimiter) {

                    this.data.date_format_active.splice(this.data.date_format_active.indexOf(element), 1);
                    this.state.active_date_delimiters--;

                    break;
                }
            }

            if (this.state.active_date_delimiters + this.state.inactive_date_delimiters <= this.data.minimum_overall_delimiters) {
                this.state.disable_remove_date_delimiter = true;
            }

            this.state.disable_add_date_delimiter = false;
        },

        update_date_format_limitations(event: any) {
            if (event?.removed) {
                this.state.inactive_date_delimiters--;
                this.state.active_date_delimiters++;

                if (!(this.state.active_date_delimiters + this.state.inactive_date_delimiters >= this.data.maximum_overall_delimiters)) {
                    this.state.disable_add_date_delimiter = false;
                }
            }
            if (event?.added) {
                this.state.inactive_date_delimiters++;
                this.state.active_date_delimiters--;

                if (this.state.inactive_date_delimiters >= this.data.maximum_inactive_delimiters) {
                    this.state.disable_add_date_delimiter = true;
                }
            }
        },

        add_new_time_delimiter( ) {
            const delimiters_index = this.state.active_time_delimiters + this.state.inactive_time_delimiters;

            this.data.time_format_inactive.push({ index: delimiters_index, delimiter: true, description: 'Display format items separator/ delimiter' });

            this.state.inactive_time_delimiters++;

            if (delimiters_index >= this.data.maximum_overall_delimiters || this.state.inactive_time_delimiters >= this.data.maximum_inactive_delimiters) {
                this.state.disable_add_time_delimiter = true;
            }

            this.state.disable_remove_time_delimiter = false;
        },

        remove_newest_time_delimiter( ) {
            let found_newest_delimiter = false;

            for (let i = this.data.time_format_inactive.length; i >= 0; i--) {
                const element = this.data.time_format_inactive[i];

                if (element?.delimiter) {
                    found_newest_delimiter = true;

                    this.data.time_format_inactive.splice(i, 1);
                    this.state.inactive_time_delimiters--;

                    break;
                }
            }

            if (!found_newest_delimiter) for (const element of this.data.time_format_active) {
                if (element?.delimiter) {

                    this.data.time_format_active.splice(this.data.time_format_active.indexOf(element), 1);
                    this.state.active_time_delimiters--;

                    break;
                }
            }

            if (this.state.active_time_delimiters + this.state.inactive_time_delimiters <= this.data.minimum_overall_delimiters) {
                this.state.disable_remove_time_delimiter = true;
            }

            this.state.disable_add_time_delimiter = false;
        },

        update_time_format_limitations(event: any) {
            if (event?.removed) {
                this.state.inactive_time_delimiters--;
                this.state.active_time_delimiters++;

                if (!(this.state.active_time_delimiters + this.state.inactive_time_delimiters >= this.data.maximum_overall_delimiters)) {
                    this.state.disable_add_time_delimiter = false;
                }
            }
            if (event?.added) {
                this.state.inactive_time_delimiters++;
                this.state.active_time_delimiters--;

                if (this.state.inactive_time_delimiters >= this.data.maximum_inactive_delimiters) {
                    this.state.disable_add_time_delimiter = true;
                }
            }
        },

        update_delimiter_display(target?: 'DATE' | 'TIME') {

            if (!target || target == 'DATE') {
                switch (this.state.active_date_delimiter) {
                    case FormatDelimiter.COLON : this.state.date_delimiter_display = ':'; break;
                    case FormatDelimiter.SLASH : this.state.date_delimiter_display = '/'; break;
                    case FormatDelimiter.COMMA : this.state.date_delimiter_display = ','; break;
                    case FormatDelimiter.SPACE : this.state.date_delimiter_display = '␣'; break;
                    case FormatDelimiter.DASH  : this.state.date_delimiter_display = '-'; break;
                    case FormatDelimiter.DOT   : this.state.date_delimiter_display = '.'; break;
                }
            }

            if (!target || target == 'TIME') {
                switch (this.state.active_time_delimiter) {
                    case FormatDelimiter.COLON : this.state.time_delimiter_display = ':'; break;
                    case FormatDelimiter.SLASH : this.state.time_delimiter_display = '/'; break;
                    case FormatDelimiter.COMMA : this.state.time_delimiter_display = ','; break;
                    case FormatDelimiter.SPACE : this.state.time_delimiter_display = '␣'; break;
                    case FormatDelimiter.DASH  : this.state.time_delimiter_display = '-'; break;
                    case FormatDelimiter.DOT   : this.state.time_delimiter_display = '.'; break;
                }
            }
        }
    },

    watch: {
        'state.active_date_delimiter': {
            handler( ) { this.update_delimiter_display('DATE'); },
            deep: true
        },

        'state.active_time_delimiter': {
            handler( ) { this.update_delimiter_display('TIME'); },
            deep: true
        }
    },

    computed: mapState(['settingsStore'])
});