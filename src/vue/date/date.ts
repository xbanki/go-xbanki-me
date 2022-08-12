import { DateTime }        from 'luxon';
import { mapState }        from 'vuex';
import { defineComponent } from 'vue';

import { FormatToken }  from '@/lib/store_settings';
import { TimerManager } from '@/lib/timers';

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Displays or disables the showing of the component.
     * @type {boolean}
     */
    render: boolean;

    /**
     * Current date.
     * @type {string}
     */
    date?: string;
}

/**
 * Component data internal description interface.
 */
interface ComponentData {

    /**
     * Parent resize observer.
     * @type {ResizeObserver}
     */
    observer?: ResizeObserver;
}

export default defineComponent({

    data() {

        // Data constants

        const observer = undefined;

        // State constants

        const render = false;

        const date = undefined;

        // State & data objects

        const state: ComponentState = { render, date };

        const data: ComponentData = { observer };

        return { state, data };
    },

    mounted() {
        this.$nextTick(
            () => {

                this.data.observer = new ResizeObserver(this.handle_parent_resize);

                this.handle_parent_resize();
            }
        );
    },

    methods: {

        handle_parent_resize() {

            const renderer = this.$refs.renderer as HTMLSpanElement;
            const parent   = this.$el            as HTMLElement;

            if (!renderer || !parent) return;

            const scale = Math.min(
                parent.clientWidth  / renderer.clientWidth,
                parent.clientHeight / renderer.clientHeight
            );

            renderer.style.transform = `translate( -50%, -50%) scale(${scale})`;
        },

        update_time_renderer() {

            // Update group constants
            const UPDATE_GROUP    = 'CLOCK_UPDATE_GROUP_LATE';
            const UPDATE_INTERVAL = 60000;

            const now: DateTime   = DateTime.now();
            const format: string  = this.settingsStore.date_display_format;
            const aligner: number = UPDATE_INTERVAL - now.millisecond - (now.second * UPDATE_INTERVAL);

            // Bind group & interval
            const groupfn = TimerManager.AddTimerGroup(UPDATE_GROUP, UPDATE_INTERVAL);

            this.state.date = DateTime.now().toFormat(this.settingsStore.date_display_format);

            TimerManager.AddGroupFunction(UPDATE_GROUP, () => this.state.date = DateTime.now().toFormat(format));

            if (!this.state.render)
                this.state.render = true;

            this.$nextTick(() => {
                setTimeout(
                    () => {
                        this.state.date = DateTime.now().toFormat(this.settingsStore.date_display_format);

                        groupfn?.();
                    },

                    aligner
                );
            });
        }
    },

    watch: {

        'settingsStore.date_format_active': {

            handler() { this.update_time_renderer(); },

            immediate: true
        },

        'componentCanvasStore.edit': {

            handler(state: boolean) {

                if (!this.data.observer) return;

                if (state)
                    this.data.observer.observe(this.$el);

                else
                    this.data.observer.unobserve(this.$el);

                this.$nextTick(() => this.handle_parent_resize());
            },

            immediate: true
        }
    },

    computed: mapState(['settingsStore', 'componentCanvasStore'])
});