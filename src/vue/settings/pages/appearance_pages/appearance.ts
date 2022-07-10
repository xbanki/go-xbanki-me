/* eslint-disable @typescript-eslint/ban-ts-comment */

import { defineComponent } from 'vue';

import anime from 'animejs';

import backgroundFitPageComponent from '@/vue/settings/pages/appearance_pages/background_fit/background_fit.vue';
import themePageComponent         from '@/vue/settings/pages/appearance_pages/theme/theme.vue';

export default defineComponent({

    components: {
        backgroundFitPageComponent,
        themePageComponent
    },

    mounted() { this.$nextTick(() => this.handle_category_click()); },

    methods: {
        handle_category_click() {

            // @ts-ignore
            const target: string = this.last_clicked_category;

            // @ts-ignore
            const critical: boolean = this.critical_only;

            if (!critical) if (['theme-category', 'background-fit-category'].includes(target)) {

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
        },

        handle_critical_category(name :string): boolean {

            // @ts-ignore
            const critical: boolean = this.critical_only;

            if (critical)

                // @ts-ignore
                return this.critical_categories.includes(name);

            else
                return true;
        }
    },

    watch: {
        last_clicked_category() { this.handle_category_click(); }
    },

    inject: ['critical_only', 'critical_categories', 'last_clicked_category']
});