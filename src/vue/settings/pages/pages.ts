import { defineComponent } from 'vue';

import privacyAndSafetyPageComponent from '@/vue/settings/pages/miscellaneous_pages/privacy_and_safety/privacy_and_safety.vue';
import timeConventionPageComponent from '@/vue/settings/pages/date_and_time_pages/time_convention/time_convention.vue';
import backgroundFitPageComponent from '@/vue/settings/pages/appearance_pages/background_fit/background_fit.vue';
import dateDisplayPageComponent from '@/vue/settings/pages/date_and_time_pages/date_display/date_display.vue';
import timeDisplayPageComponent from '@/vue/settings/pages/date_and_time_pages/time_display/time_display.vue';
import deleteDataPageComponent from '@/vue/settings/pages/miscellaneous_pages/delete_data/delete_data.vue';
import changelogPageComponent from '@/vue/settings/pages/miscellaneous_pages/changelog/changelog.vue';
import themePageComponent from '@/vue/settings/pages/appearance_pages/theme/theme.vue';

/**
 * Component internal state.
 * @public
 */
export interface ComponentState {

    /**
     * Currently active category.
     * @type {string}
     */
    active_category: string | undefined;
}

export default defineComponent({

    components: {

        // Appearance pages
        'background-fit-category': backgroundFitPageComponent,
        'theme-category'         : themePageComponent,

        // Date & time display pages
        'time-convention-category': timeConventionPageComponent,
        'date-display-category'   : dateDisplayPageComponent,
        'time-display-category'   : timeDisplayPageComponent,

        // Miscellaneous pages
        'privacy-and-safety-category': privacyAndSafetyPageComponent,
        'delete-data-category'       : deleteDataPageComponent,
        'changelog-category'         : changelogPageComponent
    },

    props: {
        state: {
            required: true,
            type: Object,
            default: {},
            validator: (value: any) => (value != undefined && typeof value == 'object')
        }
    }
});