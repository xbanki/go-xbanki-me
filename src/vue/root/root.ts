import { mapState }        from 'vuex';
import { defineComponent } from 'vue';

import { AvaillableThemes } from '@/lib/store_settings';

import backgroundComponent from '@/vue/background/background.vue';
import settingsComponent   from '@/vue/settings/settings.vue';
import canvasComponent     from '@/vue/canvas/canvas.vue';
import clockComponent      from '@/vue/clock/clock.vue';
import store               from '@/lib/store';

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Indicates wether or not we should match system OS theme.
     * @type {boolean}
     */
    match_os_theme: boolean;
}

export default defineComponent({

    components: {
        backgroundComponent,
        settingsComponent,
        canvasComponent,
        clockComponent
    },

    // Set the application title to "New tab"
    mounted() { this.$nextTick(() => { document.title = 'New tab'; this.detect_auto_theme(); }); },

    data() {

        const state: ComponentState = { match_os_theme: false };

        return { state };
    },

    methods: {

        detect_auto_theme() {
            if (!window.matchMedia) {
                store.dispatch('eventBusStore/DISABLE_SYSTEM_THEME_SWITCH_SUPPORT');
            }

            switch(this.settingsStore.selected_theme) {
                case AvaillableThemes.SYSTEM: this.set_system_theme_mode(); break;

                case AvaillableThemes.LIGHT: this.set_light_theme_mode(); break;

                case AvaillableThemes.DARK: this.set_dark_theme_mode(); break;
            }
        },

        set_system_theme_mode() {
            if (!this.eventBusStore.supports_system_theme_switch) return;

            const body_classes = document.body.classList;
            this.state.match_os_theme = true;

            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                if (body_classes.contains('theme-light')) body_classes.remove('theme-light');

                body_classes.add('theme-dark');
            }

            else {
                if (body_classes.contains('theme-dark')) body_classes.remove('theme-dark');

                body_classes.add('theme-light');
            }

            window.matchMedia('(prefers-color-scheme: dark)').addEventListener(
                'change', event => {

                    if (!this.state.match_os_theme) return;

                    if (event.matches) {
                        if (body_classes.contains('theme-light')) body_classes.remove('theme-light');

                        body_classes.add('theme-dark');
                    }

                    else {
                        if (body_classes.contains('theme-dark')) body_classes.remove('theme-dark');

                        body_classes.add('theme-light');
                    }
                }
            );
        },
        set_light_theme_mode() {
            const body_classes = document.body.classList;

            if(this.state.match_os_theme) this.state.match_os_theme = false;

            if (body_classes.contains('theme-dark')) body_classes.remove('theme-dark');
            if (body_classes.contains('theme-light')) return;

            body_classes.add('theme-light');
        },
        set_dark_theme_mode() {
            const body_classes = document.body.classList;

            if(this.state.match_os_theme) this.state.match_os_theme = false;

            if (body_classes.contains('theme-light')) body_classes.remove('theme-light');
            if (body_classes.contains('theme-dark')) return;

            body_classes.add('theme-dark');
        }
    },

    watch: {
        'settingsStore.selected_theme': {

            handler(event: AvaillableThemes) {

                switch(event) {
                    case AvaillableThemes.SYSTEM: this.set_system_theme_mode(); break;

                    case AvaillableThemes.LIGHT: this.set_light_theme_mode(); break;

                    case AvaillableThemes.DARK: this.set_dark_theme_mode(); break;
                }
            },

            deep: true
        }
    },

    computed: mapState(['settingsStore', 'eventBusStore'])
});