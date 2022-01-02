import { DateTime }        from 'luxon';
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

    /**
     * Delimiter(s) display format states.
     * @type {{ [key: string]: any }}
     */
    display_format_state: { [key: string]: any; };
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

    /**
     * Timer display updater which clocks every milisecond.
     * @type {Timer}
     */
    timer_updater_milisecond?: NodeJS.Timer;

    /**
     * Timer display updater which clocks every minute.
     * @type {Timer}
     */
    timer_updater_minute?: NodeJS.Timer;

    /**
     * Token items that should be updated every milisecond.
     * @type {Array<string>}
     */
    millisecond_updated_dictionary: Array<string>;
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
            active_time_delimiters: 2,
            display_format_state: {}
        };

        const delimiter_description = 'Display format items separator/ delimiter';

        const time_format_inactive: Array<FormatToken> = [
            { delimiter: false, index: 0, dynamic: false, token: 'SSS', description: 'Millisecond padded to three digits' },
            { delimiter: false, index: 1, dynamic: false, token: 's', description: 'Second with no padding' },
            { delimiter: false, index: 2, dynamic: false, token: 'm', description: 'Minute with no padding' },
            { delimiter: false, index: 3, dynamic: true, token: 'HOUR_UNPADDED', description: 'Hour with no padding' },
            { delimiter: false, index: 4, dynamic: false, token: 'Z', description: 'Narrow offset' },
            { delimiter: false, index: 5, dynamic: false, token: 'ZZ', description: 'Short offset' },
            { delimiter: false, index: 6, dynamic: false, token: 'ZZZZ', description: 'Abbreviated offset' },
            { delimiter: false, index: 7, dynamic: false, token: 'ZZZZZ', description: 'Full named offset' }
        ];

        const time_format_active: Array<FormatToken> = [
            { delimiter: false, index: 8, dynamic: true, token: 'HOUR_PADDED', description: 'Hour padded to two digits' },
            { delimiter: true, index: 9, description: delimiter_description },
            { delimiter: false, index: 10, dynamic: false, token: 'mm', description: 'Minute padded to two digits' },
            { delimiter: true, index: 11, description: delimiter_description },
            { delimiter: false, index: 12, dynamic: false, token: 'ss', description: 'Second padded to two digits' }
        ];

        const date_format_inactive: Array<FormatToken> = [
            { delimiter: false, index: 0, dynamic: false, token: 'dd', description: 'Day of the month padded to two digits' },
            { delimiter: false, index: 1, dynamic: false, token: 'E', description: 'Day of the week in number form' },
            { delimiter: false, index: 2, dynamic: false, token: 'EEE', description: 'Day of the week abbreviated' },
            { delimiter: false, index: 3, dynamic: false, token: 'M', description: 'Month in number form with no padding' },
            { delimiter: false, index: 4, dynamic: false, token: 'MM', description: 'Month in number form padded to two digits' },
            { delimiter: false, index: 5, dynamic: false, token: 'MMM', description: 'Month abbreviated' },
            { delimiter: false, index: 6, dynamic: false, token: 'yy', description: 'Year padded to two digits' },
            { delimiter: false, index: 7, dynamic: false, token: 'yyyy', description: 'Year padded to four digits' },
            { delimiter: false, index: 8, dynamic: false, token: 'G', description: 'Abbreviated era' },
            { delimiter: false, index: 9, dynamic: false, token: 'GG', description: 'Full era' },
            { delimiter: false, index: 10, dynamic: false, token: 'W', description: 'Week number with no padding' },
            { delimiter: false, index: 11, dynamic: false, token: 'WW', description: 'Week number padded to two digits' },
            { delimiter: false, index: 12, dynamic: false, token: 'o', description: 'Day of year with no padding' },
            { delimiter: false, index: 13, dynamic: false, token: 'ooo', description: 'Day of year padded to three digits' },
            { delimiter: false, index: 14, dynamic: false, token: 'q', description: 'Quarter of date' }
        ];

        const date_format_active: Array<FormatToken> = [
            { delimiter: false, index: 0, dynamic: false, token: 'EEEE', description: 'Day of the week in full form' },
            { delimiter: true, index: 1, description: delimiter_description },
            { delimiter: false, index: 2, dynamic: false, token: 'MMMM', description: 'Month in full form' },
            { delimiter: false, index: 3, dynamic: false, token: 'd', description: 'Day of the month with no padding' },
            { delimiter: true, index: 4, description: delimiter_description },
            { delimiter: false, index: 5, dynamic: false, token: 'y', description: 'Year with no padding' }
        ];

        const millisecond_updated_dictionary = ['SSS', 'ss', 's'];

        const data: ComponentData = {
            date_format_inactive: settingsState.settingsStore.date_format_inactive ?? date_format_inactive,
            time_format_inactive: settingsState.settingsStore.time_format_inactive ?? time_format_inactive,
            date_format_active: settingsState.settingsStore.date_format_active ?? date_format_active,
            time_format_active: settingsState.settingsStore.time_format_active ?? time_format_active,
            millisecond_updated_dictionary,
            maximum_inactive_delimiters: 3,
            maximum_overall_delimiters: 10,
            minimum_overall_delimiters: 0
        };

        return { state, data };
    },

    mounted( ) {
        this.$nextTick(
            ( ) => {
                this.update_delimiter_display( );
                this.set_up_updater( );
            }
        );
    },

    methods: {
        set_up_updater( ) {
            const update_millisecond: FormatToken[] = [];
            const update_minute:      FormatToken[] = [];

            const format_tokens = [...this.data.date_format_inactive, ...this.data.time_format_inactive, ...this.data.date_format_active, ...this.data.time_format_active];

            const minute_updater = () => {
                for (const item of update_minute) {
                    if (!item.token) continue;

                    if (item.dynamic) {
                        if (item.token == 'HOUR_UNPADDED') {
                            if (this.state.active_clock_convention == ClockConvention.AMERICAN) this.state.display_format_state[item.token] = DateTime.now().toFormat('h');
                            if (this.state.active_clock_convention == ClockConvention.EUROPEAN) this.state.display_format_state[item.token] = DateTime.now().toFormat('H');
                        }

                        if (item.token == 'HOUR_PADDED') {
                            if (this.state.active_clock_convention == ClockConvention.AMERICAN) this.state.display_format_state[item.token] = DateTime.now().toFormat('hh');
                            if (this.state.active_clock_convention == ClockConvention.EUROPEAN) this.state.display_format_state[item.token] = DateTime.now().toFormat('HH');
                        }

                        continue;
                    }

                    this.state.display_format_state[item.token] = DateTime.now().toFormat(item.token);
                }
            };

            let time_aligner: NodeJS.Timer | undefined;

            for (const item of format_tokens) {
                if (!item.token || item.delimiter) continue;

                if (this.data.millisecond_updated_dictionary.find(el => el == item.token)) {
                    update_millisecond.push(item);

                    continue;
                }

                update_minute.push(item);
            }

            minute_updater();

            time_aligner = setTimeout(
                () => {
                    this.data.timer_updater_minute = setInterval(minute_updater, 60000);

                    time_aligner = undefined;
                }, DateTime.fromObject({ minute: DateTime.now().minute + 1 }).toMillis() - DateTime.now().toMillis()
            );

            // We don't do any dynamic token checks because there can't be any in the millisecond array
            this.data.timer_updater_milisecond = setInterval(
                () => {
                    for (const item of update_millisecond) {
                        if (!item.token) continue;

                        this.state.display_format_state[item.token] = DateTime.now().toFormat(item.token);
                    }
                }, 1
            );
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

            if (this.data.date_format_active != this.settingsStore.date_format_active && this.data.date_format_inactive != this.settingsStore.date_format_inactive) {
                store.dispatch('settingsStore/SetDateFormat', [this.data.date_format_active, this.data.date_format_inactive]);
            }

            if (this.data.time_format_active != this.settingsStore.time_format_active && this.data.time_format_inactive != this.settingsStore.time_format_inactive) {
                store.dispatch('settingsStore/SetTimeFormat', [this.data.time_format_active, this.data.time_format_inactive]);
            }
        },

        update_delimiter_display(target?: 'DATE' | 'TIME') {
            if (!target || target == 'DATE') this.state.date_delimiter_display = this.get_delimiter(this.state.active_date_delimiter);

            if (!target || target == 'TIME') this.state.time_delimiter_display = this.get_delimiter(this.state.active_time_delimiter);
        },

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

    watch: {
        'state.active_date_delimiter': {
            handler( ) { this.update_delimiter_display('DATE'); },
            deep: true
        },

        'state.active_time_delimiter': {
            handler( ) { this.update_delimiter_display('TIME'); },
            deep: true
        },
        'data.time_format_active': {
            handler( ) { this.update_realtime_options(); },
            deep: true
        },
        'data.date_format_active': {
            handler( ) { this.update_realtime_options(); },
            deep: true
        }
    },

    computed: mapState(['settingsStore'])
});