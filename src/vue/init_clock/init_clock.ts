import { defineComponent } from 'vue';

import draggable from 'vuedraggable';

import { ClockConvention } from '@/lib/store_settings';

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Currently selected clock convention.
     * @enum {ClockConvention}
     */
    active_clock_convention: ClockConvention;
}

export default defineComponent({

    components: { draggable },

    data() {
        const state: ComponentState = { active_clock_convention: ClockConvention.EUROPEAN };

        return { state };
    }
});