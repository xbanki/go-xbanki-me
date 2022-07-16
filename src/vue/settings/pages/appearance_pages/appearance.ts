import { mapState }        from 'vuex';
import { defineComponent } from 'vue';

import anime from 'animejs';

import backgroundFitPageComponent from '@/vue/settings/pages/appearance_pages/background_fit/background_fit.vue';
import themePageComponent         from '@/vue/settings/pages/appearance_pages/theme/theme.vue';

export default defineComponent({

    components: {
        backgroundFitPageComponent,
        themePageComponent
    },

    mounted() { this.$nextTick(() => this.handle_category_click(this.eventBusStore.last_clicked_category)); },

    methods: {

        handle_category_click(name?: string) {

            const categories = ['theme-category', 'background-fit-category'];

            if (name && categories.includes(name)) {

                const scroll = document.querySelector('main.component-pages') as HTMLElement;
                const target = this.$refs[name]                         as HTMLElement;
                const parent = this.$refs.parent                              as HTMLElement;

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
        'eventBusStore.last_clicked_category'(state?: string) { this.handle_category_click(state); }
    },

    computed: mapState(['eventBusStore'])
});