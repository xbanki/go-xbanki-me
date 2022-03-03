import { defineComponent } from 'vue';

import timeConventionPageComponent from '@/vue/settings/pages/date_and_time_pages/time_convention/time_convention.vue';
import dateDisplayPageComponent from '@/vue/settings/pages/date_and_time_pages/date_display/date_display.vue';
import timeDisplayPageComponent from '@/vue/settings/pages/date_and_time_pages/time_display/time_display.vue';

export default defineComponent({
    components: {
        timeConventionPageComponent,
        dateDisplayPageComponent,
        timeDisplayPageComponent
    }
});