/* eslint-disable @typescript-eslint/ban-ts-comment */

import { DateTime }        from 'luxon';
import { mapState, Store } from 'vuex';
import { defineComponent } from 'vue';

import anime from 'animejs';

import { ModuleState } from '@/lib/store_settings';

import timeConventionPageComponent from '@/vue/settings/pages/date_and_time_pages/time_convention/time_convention.vue';
import dateDisplayPageComponent    from '@/vue/settings/pages/date_and_time_pages/date_display/date_display.vue';
import timeDisplayPageComponent    from '@/vue/settings/pages/date_and_time_pages/time_display/time_display.vue';
import store                       from '@/lib/store';

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Current day in time rendered based on the format.
     * @type {string}
     */
    date: string;

    /**
     * Current moment in time rendered based on the format.
     * @type {string}
     */
    time: string;

    /**
     * Last build time in RFC2822 format.
     */
    build: string;
}

export default defineComponent({

    data() {
        const typed_store = store as Store<{ settingsStore: ModuleState }>;

        // State constants

        // @ts-ignore
        const build = LAST_BUILD_TIME;

        const time = DateTime.fromRFC2822(build).toFormat(typed_store.state.settingsStore.time_display_format);

        const date = DateTime.fromRFC2822(build).toFormat(typed_store.state.settingsStore.date_display_format);

        // Final object construction

        const state: ComponentState = {
            build,
            time,
            date
        };

        return { state };
    },

    mounted() { this.$nextTick(() => this.handle_category_click(this.componentSettingsStore.last_clicked_category)); },

    methods: {

        handle_category_click(name?: string) {

            const categories = ['date-display-category', 'time-convention-category', 'time-display-category'];

            if (name && this.componentSettingsStore.is_searching &&categories.includes(name)) {

                const scroll = document.querySelector('main.component-pages') as HTMLElement;
                const target = this.$refs[name]                               as HTMLElement;
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

    components: {
        timeConventionPageComponent,
        dateDisplayPageComponent,
        timeDisplayPageComponent
    },

    watch: {
        'settingsStore.time_display_format': {
            handler(state) { this.state.time = DateTime.fromRFC2822(this.state.build).toFormat(state); },
            deep: true
        },

        'settingsStore.date_display_format': {
            handler(state) { this.state.date = DateTime.fromRFC2822(this.state.build).toFormat(state); },
            deep: true
        },

        'componentSettingsStore.last_clicked_category'(state?: string) { this.handle_category_click(state); }
    },

    computed: mapState(['settingsStore', 'componentSettingsStore'])
});