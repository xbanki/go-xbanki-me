/* eslint-disable @typescript-eslint/ban-ts-comment */

import { defineComponent } from 'vue';

import anime from 'animejs';

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

    /**
     * Disables moving between tabs on critical only mode.
     * @type {boolean}
     */
    disable: boolean;
}

export default defineComponent({

    data() {

        const disable = false;

        const active: CurrentTab = CurrentTab.DEFAULT;

        const label = 'This is a default tab that will never be seen!';

        // Assembled state objects

        const state: ComponentState = {
            disable,
            active,
            label
        };

        return { state };
    },

    mounted() { this.$nextTick(() => { this.handle_category_click(); this.discriminate_component_state(); }); },

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

        discriminate_component_state() {

            // @ts-ignore
            const critical: boolean = this.critical_only;

            if (critical) {
                this.state.active = CurrentTab.COOKIES;
                this.state.disable = true;
            }
        },

        handle_return_click() {

            if (this.state.active == CurrentTab.DEFAULT || this.state.disable) return;

            this.state.active = CurrentTab.DEFAULT;
        },

        handle_category_click() { this; },

        handle_critical_category(name :string): boolean {

            // @ts-ignore
            const critical: boolean = this.critical_only;

            if (critical)

                // @ts-ignore
                return this.critical_categories.includes(name);

            else
                return true;
        },

        pass_close() { this.$emit('close'); }
    },

    watch: {
        last_clicked_category() { this.handle_category_click(); }
    },

    inject: ['critical_only', 'critical_categories', 'last_clicked_category'],

    emits: ['close'],

    components: {

        // Dynamic component things
        MISC_TAB_COOKIE_USAGE: cookieUsageComponent,
        MISC_TAB_FOSS_LICENSES: licensesComponent,

        privacyAndSafetyPageComponent,
        deleteDataPageComponent,
        changelogPageComponent
    }
});