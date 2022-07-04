import { defineComponent } from 'vue';

import privacyAndSafetyPageComponent from '@/vue/settings/pages/miscellaneous_pages/privacy_and_safety/privacy_and_safety.vue';
import deleteDataPageComponent from '@/vue/settings/pages/miscellaneous_pages/delete_data/delete_data.vue';
import changelogPageComponent from '@/vue/settings/pages/miscellaneous_pages/changelog/changelog.vue';
import cookieUsageComponent from '@/vue/settings/pages/miscellaneous_pages/cookie_usage/cookie_usage.vue';
import licensesComponent from '@/vue/settings/pages/miscellaneous_pages/licenses/licenses.vue';

import { CurrentTab } from '@/vue/settings/pages/miscellaneous_pages/privacy_and_safety/privacy_and_safety';

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Currently active misc page tab.
     * @enum {CurrentTab}
     */
    active: CurrentTab;

    /**
     * Active tab label.
     * @type {string}
     */
    label: string;
}

export default defineComponent({

    data() {

        const active: CurrentTab = CurrentTab.DEFAULT;

        const label = 'This is a default tab that will never be seen!';

        // Assembled state objects

        const state: ComponentState = {
            active,
            label
        };

        return { state };
    },

    methods: {
        handle_click_event(event: CurrentTab) {

            if (this.state.active == CurrentTab.DEFAULT) {

                switch(event) {
                    case CurrentTab.LICENSES: this.state.label = 'Licenses';     break;
                    case CurrentTab.COOKIES:  this.state.label = 'Cookie Usage'; break;
                }

                this.state.active = event;

                return;
            }
        },

        handle_return_click() {

            if (this.state.active == CurrentTab.DEFAULT) return;

            this.state.active = CurrentTab.DEFAULT;
        }
    },

    components: {

        // Dynamic component things
        MISC_TAB_COOKIE_USAGE: cookieUsageComponent,
        MISC_TAB_FOSS_LICENSES: licensesComponent,

        privacyAndSafetyPageComponent,
        deleteDataPageComponent,
        changelogPageComponent
    }
});