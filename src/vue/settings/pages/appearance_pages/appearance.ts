import { Component, defineComponent } from 'vue';

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

/**
 * Component data internal description interface.
 */
 interface ComponentData {

    /**
     * Dictionary of all category items in this page that should
     * be rendered if we are in critical only mode.
     * @type {Record<string, boolean>}
     */
    critical_categories: Record<string, boolean>;
}

export default defineComponent({

    data(): { data: ComponentData, critical_only?: boolean } {
        const critical_categories: Record<string, boolean> = {
            'background-fit': true,
            'theme': false
        };

        const data: ComponentData = { critical_categories };

        return { data };
    },

    components: {
        backgroundFitPageComponent,
        themePageComponent
    },

    inject: ['critical_only']
});