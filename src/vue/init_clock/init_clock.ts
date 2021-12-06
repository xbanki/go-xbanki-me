import { mapState }        from 'vuex';
import { defineComponent } from 'vue';

import draggable from 'vuedraggable';

import { ClockConvention, FormatDelimiter, DateDisplayLocation, DateTimeSize } from '@/lib/store_settings';
import { ModuleState } from '@/lib/store_settings';

import store from '@/lib/store';

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
     * Currently selected format delimeter (separator).
     * @enum {FormatDelimiter}
     */
    active_format_delimiter: FormatDelimiter;

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
}

export default defineComponent({

    components: { draggable },

    data() {
        const settingsState = store.state as { settingsStore: ModuleState };

        const state: ComponentState = {
            active_date_display_location: settingsState.settingsStore.date_display_position ?? DateDisplayLocation.BOTTOM,
            active_clock_convention: settingsState.settingsStore.time_convention ?? ClockConvention.EUROPEAN,
            active_format_delimiter: settingsState.settingsStore.date_delimiter ?? FormatDelimiter.SPACE,
            active_date_size: settingsState.settingsStore.date_size ?? DateTimeSize.SMALL,
            active_time_size: settingsState.settingsStore.time_size ?? DateTimeSize.MEDIUM
        };

        return { state };
    },

    methods: {
        update_realtime_options() {
            if (this.state.active_date_display_location != this.settingsStore.date_display_position) {
               store.commit('settingsStore/SET_DATE_DISPLAY_POSITION', this.state.active_date_display_location);
            }

            if (this.state.active_clock_convention != this.settingsStore.time_convention) {
                store.commit('settingsStore/SET_CLOCK_CONVENTION', this.state.active_clock_convention);
            }

            if (this.state.active_format_delimiter != this.settingsStore.date_delimiter) {
                store.commit('settingsStore/UPDATE_DATE_FORMAT_DELIMITER', this.state.active_format_delimiter);
            }

            if (this.state.active_date_size != this.settingsStore.date_size) {
                store.commit('settingsStore/UPDATE_DATE_SIZE', this.state.active_date_size);
            }

            if (this.state.active_time_size != this.settingsStore.time_size) {
                store.commit('settingsStore/UPDATE_TIME_SIZE', this.state.active_time_size);
            }
        }
    },

    computed: mapState(['settingsStore'])
});