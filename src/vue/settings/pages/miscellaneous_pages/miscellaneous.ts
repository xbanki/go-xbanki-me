import { mapState }        from 'vuex';
import { defineComponent } from 'vue';

import anime from 'animejs';

import privacyAndSafetyPageComponent from '@/vue/settings/pages/miscellaneous_pages/privacy_and_safety/privacy_and_safety.vue';
import deleteDataPageComponent       from '@/vue/settings/pages/miscellaneous_pages/delete_data/delete_data.vue';
import changelogPageComponent        from '@/vue/settings/pages/miscellaneous_pages/changelog/changelog.vue';
import cookieUsageComponent          from '@/vue/settings/pages/miscellaneous_pages/cookie_usage/cookie_usage.vue';
import licensesComponent             from '@/vue/settings/pages/miscellaneous_pages/licenses/licenses.vue';

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
     * Disables moving between tabs on critical only mode.
     * @type {boolean}
     */
    disable: boolean;

    /**
     * Active tab label.
     * @type {string}
     */
    label: string;
}

export default defineComponent({

    components: {

        // Tab page components
        MISC_TAB_COOKIE_USAGE:  cookieUsageComponent,
        MISC_TAB_FOSS_LICENSES: licensesComponent,

        privacyAndSafetyPageComponent,
        deleteDataPageComponent,
        changelogPageComponent
    },

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

    mounted() { this.$nextTick(() => this.handle_category_click(this.componentSettingsStore.last_clicked_category)); },

    methods: {

        /**
         * Switches the current displayed miscellaneous tab if current active tab is
         * default.
         */
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

        /**
         * Returns to the default miscellaneus page on click.
         */
        handle_return_click() {

            if (this.state.active == CurrentTab.DEFAULT || this.state.disable) return;

            this.state.active = CurrentTab.DEFAULT;
        },

        /**
         * In search mode, scrolls to the matching component on the page.
         */
        handle_category_click(name?: string) {

            // All categories that can be found on this page
            const categories = ['changelog-category', 'privacy-and-safety-category', 'delete-data-category'];

            if (name && this.componentSettingsStore.is_searching && categories.includes(name)) {

                // Parent wrapper that is actually scrolled
                const scroll = document.querySelector('main.component-pages') as HTMLElement;

                // Target element parent which we use to calculate above scroll amount
                const parent = this.$refs.parent as HTMLElement;

                // Target category element, which is used to figure out scroll target
                const target = this.$refs[name] as HTMLElement;

                let overhead = 0;

                if (
                    scroll != (null || undefined) &&
                    parent != (null || undefined) &&
                    target != (null || undefined)
                )

                for (let i = 0; i < parent.children.length; i++) {

                    const item = parent.children.item(i) as HTMLElement;

                    if (item == target)
                        break;

                    overhead += item.clientHeight;
                }

                else return;

                // Reset scroll position
                if (scroll.scrollTop != 0)
                    scroll.scrollTop = 0;

                const scroll_animation = anime({
                    easing: 'easeInOutQuart',
                    scrollTop: overhead,
                    autoplay: false,
                    targets: scroll,
                    duration: 360
                });

                const highlight_animation = anime({
                    autoplay: false,
                    duration: 960
                });

                highlight_animation.complete = () => target.classList.remove('scroll-highlighted');
                highlight_animation.begin    = () => target.classList.add('scroll-highlighted');
                scroll_animation.complete    = () => highlight_animation.play();

                this.$nextTick(() => scroll_animation.play());
            }
        }
    },

    watch: {
        'componentSettingsStore.last_clicked_category'(state?: string) { this.handle_category_click(state); }
    },

    computed: mapState(['componentSettingsStore'])
});