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

    mounted() { this.$nextTick(() => this.handle_category_click()); },

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
        },

        handle_category_click() {

            // @ts-ignore
            const target = this.last_clicked_category as string;

            const runner = () => {
                const scrollable = document.getElementsByClassName('component-pages')[0];
                const el         = this.$refs[target] as HTMLDivElement;

                // Highlight animation stuff
                const highlight = anime({
                    autoplay: false,
                    duration: 960
                });

                // Scroll animation stuff
                const scroll = anime({
                    scrollTop: (el.offsetTop - scrollable.scrollTop),
                    easing: 'easeInOutQuad',
                    targets: scrollable,
                    autoplay: false,
                    duration: 480
                });

                highlight.complete = () => el.classList.remove('highlighted');
                highlight.begin    = () => el.classList.add('highlighted');
                scroll.complete    = () => highlight.play();

                // Play the animation
                scroll.play();
            };

            if (['Changelog', 'Privacy & Safety', 'Delete Data'].includes(target)) {

                if (this.state.active != CurrentTab.DEFAULT) {

                    this.state.active = CurrentTab.DEFAULT;
                    this.$nextTick(() => runner());
                }

                else
                    runner();
            }
        }
    },

    watch: {
        last_clicked_category() { this.handle_category_click(); }
    },

    inject: ['last_clicked_category'],

    components: {

        // Dynamic component things
        MISC_TAB_COOKIE_USAGE: cookieUsageComponent,
        MISC_TAB_FOSS_LICENSES: licensesComponent,

        privacyAndSafetyPageComponent,
        deleteDataPageComponent,
        changelogPageComponent
    }
});