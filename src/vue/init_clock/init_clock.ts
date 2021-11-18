import { defineComponent } from 'vue';

import draggable from 'vuedraggable';

import { ClockConvention, FormatDelimiter } from '@/lib/store_settings';

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
}

export default defineComponent({

    components: { draggable },

    data() {
        const state: ComponentState = {
            active_clock_convention: ClockConvention.EUROPEAN,
            active_format_delimiter: FormatDelimiter.SPACE
        };

        return { state };
    }
});

// Size:       Large, Medium, Small
//             [Position matrix]