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
     * Last used timer group.
     * @type {string}
     */
    group?: string;

    /**
     * Current moment in time.
     * @type {string}
     */
    time?: string;
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

/**
 * Denotes which update group this token belongs in.
 */
enum TokenUpdateType {
    IMMEDIATE = 'CLOCK_UPDATE_GROUP_IMMEDIATE', // Updates every milisecond
    LAZY      = 'CLOCK_UPDATE_GROUP_LAZY',      // Updates every second
    LATE      = 'CLOCK_UPDATE_GROUP_LATE'       // Updates every minute
}

/**
 * Table of "tokens", which appear in the format string. Each value of this table
 * represents which timer group this token belongs to. Only tokens which are not
 * updated every hour appear here.
 */
const TOKEN_UPDATE_TABLE: Record<string, TokenUpdateType> = {
    m:   TokenUpdateType.LATE,
    mm:  TokenUpdateType.LATE,
    s:   TokenUpdateType.LAZY,
    ss:  TokenUpdateType.LAZY,
    SSS: TokenUpdateType.IMMEDIATE
};

export default defineComponent({

    data() {

        // State constants

        const render = false;

        const group: string | undefined = undefined;

        const time: string | undefined = undefined;

        // Data constants

        const observer: ResizeObserver | undefined = undefined;

        // Final state & data objects
        const data: ComponentData = {
            observer
        };

        const state: ComponentState = {
            render,
            group,
            time
        };

        return { state, data };
    },

    mounted() {
        this.$nextTick(
            () => {

                this.data.observer = new ResizeObserver(this.handle_parent_resize);

                this.handle_parent_resize();
            });
        },

    methods: {

        update_time_renderer(state: FormatToken[]) {

            let target_group = TokenUpdateType.LATE;

            this.state.time = DateTime.now().toFormat(this.settingsStore.time_display_format);

            // Remove the current active timer
            if (this.state.group)
                TimerManager.RemoveTimerGroup(this.state.group);

            // Figure out what updater group we fit in
            for (const token of state) {

                if (token.dynamic || token.delimiter || token.disabled || !token.token) continue;

                const group = TOKEN_UPDATE_TABLE[token.token] ?? TokenUpdateType.LATE;


                if (group != target_group) switch(group) {

                    case TokenUpdateType.IMMEDIATE:

                        target_group = group;

                    break;

                    case TokenUpdateType.LAZY:

                        if (target_group != TokenUpdateType.IMMEDIATE)
                            target_group = group;

                    break;
                }
            }

            const now = DateTime.now();

            let interval = 0;
            let align    = 0;

            switch(target_group) {
                case TokenUpdateType.IMMEDIATE:

                    interval = 1;

                break;

                case TokenUpdateType.LAZY:

                    interval = 1000;

                    align = interval - now.millisecond;

                break;

                case TokenUpdateType.LATE:

                    interval = 60000;

                    align = interval - now.millisecond - (now.second * interval);

                break;
            }

            const format: string = this.settingsStore.time_display_format;

            // Bind group & interval
            const groupfn = TimerManager.AddTimerGroup(target_group, interval);

            TimerManager.AddGroupFunction(target_group, () => this.state.time = DateTime.now().toFormat(format));

            this.$nextTick(() => {
                    setTimeout(

                        () => {

                            // Reveal
                            if (!this.state.render)
                                this.state.render = true;

                            // Prevent time from skipping a second
                            this.state.time = DateTime.now().toFormat(this.settingsStore.time_display_format);

                            groupfn?.();
                        },

                    align
                );
            });
        },

        handle_parent_resize() {

            const renderer = this.$refs.renderer as HTMLSpanElement;
            const parent   = this.$el            as HTMLElement;

            if (!renderer || !parent) return;

            const scale = Math.min(
                parent.clientWidth  / renderer.clientWidth,
                parent.clientHeight / renderer.clientHeight
            );

            renderer.style.transform = `translate( -50%, -50%) scale(${scale})`;
        }
    },

    watch: {

        'settingsStore.time_format_active': {

            handler(state: FormatToken[]) { this.update_time_renderer(state); },

            immediate: true
        },

        'componentCanvasStore.edit': {

            handler(state: boolean) {

                if (!this.data.observer) return;

                if (state)
                    this.data.observer.observe(this.$el);

                else
                    this.data.observer.unobserve(this.$el);
            },

            immediate: true
        },

        'settingsStore.time_convention'() { this.update_time_renderer(this.settingsStore.time_format_active); }
    },

    computed: mapState(['settingsStore', 'componentCanvasStore'])
});