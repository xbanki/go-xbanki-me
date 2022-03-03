import { defineComponent } from 'vue';

import privacyAndSafetyPageComponent from '@/vue/settings/pages/miscellaneous_pages/privacy_and_safety/privacy_and_safety.vue';
import deleteDataPageComponent from '@/vue/settings/pages/miscellaneous_pages/delete_data/delete_data.vue';
import changelogPageComponent from '@/vue/settings/pages/miscellaneous_pages/changelog/changelog.vue';

export default defineComponent({
    components: {
        privacyAndSafetyPageComponent,
        deleteDataPageComponent,
        changelogPageComponent
    }
});