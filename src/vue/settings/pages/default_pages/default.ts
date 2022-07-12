import { marked }          from 'marked';
import { defineComponent } from 'vue';

import anime from 'animejs';

import { TimerManager } from '@/lib/timers';

/**
 * Internal component state.
 */
interface ComponentState {

    /**
     * Currently rendered hint.
     * @type {string}
     */
    hint: string;
}

/**
 * Internal component data.
 */
interface ComponentData {

    /**
     * Array of un-rendered Markdown hints.
     */
    hints: string[];

    /**
     * Timer group function id.
     * @type {Symbol}
     */
    id?: symbol;
}

const TIMER_GROUP = 'TIMER_GROUP_HINTS';

export default defineComponent({

    data() {
        const hints: string[] = [
            'The `Fill` background fit method fills the entire background space while maintaining the image\'s original aspect ratio.',
            'The `Automatic` theme mode will automatically match your device\'s display theme.',
            'The date & time components\' formats can be composed with individual tokens to suit your needs.',
            'The background changes daily with a new high-quality image each day.',
            'You can search for any setting by typing in the search bar atop the categories section.',
            'The `Stretch` Background fit method stretches the image to fit the space without maintaining aspect ratio.',
            'This app is fully open source!'
        ];

        const hint = hints[Math.floor(Math.random() * hints.length)];

        // Assembled objects

        const state: ComponentState = { hint };

        const data: ComponentData = { hints };

        return { state, data };
    },

    mounted() {
        const timer = TimerManager.AddTimerGroup(TIMER_GROUP, 15000);

        this.data.id = TimerManager.AddGroupFunction(TIMER_GROUP, () => this.switch_hint());

        // Start the timer
        timer?.();
    },

    unmounted() { TimerManager.RemoveGroupFunction(TIMER_GROUP, this.data.id as symbol); },

    methods: {
        switch_hint() {

            const index = this.data.hints.indexOf(this.state.hint);
            const el    = this.$refs.hint as HTMLElement;

            const fade_in = anime({
                easing: 'linear',
                autoplay: false,
                opacity: [0, 1],
                duration: 240,
                targets: el
            });

            const fade_out = anime({
                easing: 'linear',
                autoplay: false,
                opacity: [1, 0],
                duration: 240,
                targets: el
            });

            fade_out.complete = () => {
                this.state.hint = this.data.hints[index + 1] ?? this.data.hints[0];
                fade_in.play();
            };

            fade_out.play();
        },

        parse_hint: (hint: string) => marked.parseInline(hint)
    }
});