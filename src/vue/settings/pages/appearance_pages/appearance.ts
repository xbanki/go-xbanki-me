import { mapState }        from 'vuex';
import { defineComponent } from 'vue';

import anime from 'animejs';

import backgroundFitPageComponent from '@/vue/settings/pages/appearance_pages/background_fit/background_fit.vue';
import uiLayoutPageComponent      from '@/vue/settings/pages/appearance_pages/ui_layout/ui_layout.vue';
import themePageComponent         from '@/vue/settings/pages/appearance_pages/theme/theme.vue';

export default defineComponent({

    components: {
        backgroundFitPageComponent,
        uiLayoutPageComponent,
        themePageComponent
    },

    mounted() { this.$nextTick(() => this.handle_category_click(this.componentSettingsStore.last_clicked_category)); },

    methods: {

        /**
         * In search mode, scrolls to the matching component on the page.
         */
        handle_category_click(name?: string) {

            // All categories that can be found on this page
            const categories = ['theme-category', 'ui-layout-category', 'background-fit-category'];

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