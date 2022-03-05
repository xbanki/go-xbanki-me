import { defineComponent } from 'vue';

import backgroundFitPageComponent from '@/vue/settings/pages/appearance_pages/background_fit/background_fit.vue';
import themePageComponent         from '@/vue/settings/pages/appearance_pages/theme/theme.vue';

/**
 * Comonent internal state.
 * @public
 */
export interface ComponentState {

    /**
     * Controls wether critical only sections get shown.
     * @type {boolean}
     */
    critical_only: boolean;
}

export default defineComponent({
    components: {
        backgroundFitPageComponent,
        themePageComponent
    }
});