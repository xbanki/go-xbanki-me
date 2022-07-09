/* eslint-disable @typescript-eslint/ban-ts-comment */

import { defineComponent } from 'vue';

import anime from 'animejs';

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

    mounted() { this.$nextTick(() => this.handle_category_click()); },

    methods: {
        handle_category_click() {

            // @ts-ignore
            const target = this.last_clicked_category as string;

            if (['Theme', 'Background Fit'].includes(target)) {

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
            }
        }
    },

    watch: {
        last_clicked_category() { this.handle_category_click(); }
    },

    inject: ['critical_only', 'last_clicked_category']
});