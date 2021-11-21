import { defineComponent } from 'vue';

import draggable from 'vuedraggable';

import { ClockConvention, FormatDelimiter, DateDisplayLocation } from '@/lib/store_settings';

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
}

export default defineComponent({

    components: { draggable },

    data() {
        const state: ComponentState = {
            active_date_display_location: DateDisplayLocation.BOTTOM,
            active_clock_convention: ClockConvention.EUROPEAN,
            active_format_delimiter: FormatDelimiter.SPACE
        };

        return { state };
    }
});

// Size:       Large, Medium, Small
//             [Position matrix]