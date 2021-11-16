import { DateTime }        from 'luxon';
import { mapState }        from 'vuex';
import { defineComponent } from 'vue';

import anime from 'animejs';
import axios from 'axios';

import { BackgroundDisplayMethod } from '@/lib/store_settings';
import { GetDailyBackgroundData }  from '@/lib/http';

import config from '@/lib/config';
import store  from '@/lib/store';

/**
 * Component data internal description interface.
 */
interface ComponentData {

    /**
     * Daily image raw data.
     * @type {GetDailyBackgroundData}
     * @see {GetDailyBackgroundData}
     */
    image_data: HTMLImageElement[];

    /**
     * Epoch callback function which is executed once we have passed
     * the current image's set expiery date.
     * @type {void}
     */
    epoch_function: () => void;

    /**
     * NodeJS `setInterval` callback which checks how far away we are
     * from the current epoch date.
     * @type {NodeJS.Timer}
     */
    epoch_checker?: NodeJS.Timer;

    /**
     * NodeJS `setTimeout` callback which counts down and runs the epoch
     * function once the timer hits zero.
     * @type {NodeJS.Timer}
     */
    epoch_runner?: NodeJS.Timer;

    /**
     * Copyright holder data.
     * @type {object}
     */
    copyright?: {

        /**
         * Copyright holder information.
         * @type {string}
         */
        holder: string;

        /**
         * Image miscellaneous description.
         * @type {string}
         */
        description: string;
    };
}

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Currently displayed image element.
     * @type {HTMLImageElement}
     */
    current_image: HTMLImageElement | undefined;
}

export default defineComponent({

    mounted() {

        this.data.epoch_function = () => {
            this.data.epoch_runner = undefined;
            this.get_daily_background_image();
        };

        this.$nextTick(() => this.get_daily_background_image());
    },

    data() {
        const data: ComponentData = {
            epoch_function: () => undefined,
            epoch_checker: undefined,
            epoch_runner: undefined,
            image_data: []
        };

        const state: ComponentState = { current_image: undefined };

        return { state, data };
    },

    methods: {
        get_daily_background_image() {
            this.$nextTick(() => {

                axios.get(`${config.api_url}/get-daily-background`)

                    // Parse image data
                    .then(data => data.data as GetDailyBackgroundData)

                    // Fix DateTime
                    .then(
                        (data) => {
                            const expires_on = DateTime.fromISO(data.data.expires_on as unknown as string);

                            return { ...data, data: { ...Object.assign(data.data, { expires_on }) }};
                        }
                    )

                    // Update background data
                    .then(
                        (data) => {
                            if (!data) return;

                            const image = new Image;

                            image.crossOrigin = 'Anonymous';
                            image.src = data.data.url;

                            // Handle loaded event
                            image.onload = () => {
                                if (image.complete || image.complete === undefined) this.update_current_background(image, data.data.copyright);
                                this.set_up_epoch(data.data.expires_on);
                            };

                            image.onerror = () => store.commit('eventBusStore/UPDATE_IMAGE_LOAD_FAIL_STATE');
                        }
                    );
            });
        },

        set_up_copyright(str: string) {

            const holder_data = str.match(/(?<=\().*(?=\))/);

            if (str?.length >= 1 && holder_data) {

                const description = str.replace(/\((.*)/, '');
                const holder = holder_data[0];

                this.data.copyright = { holder, description };
            }
        },

        set_up_epoch(expires_on: DateTime) {

            const hour = 3600000;

            // Handle epoch case within one hour
            if ((expires_on.toMillis() - DateTime.now().toMillis()) <= hour) {
                this.data.epoch_runner = setTimeout(this.data.epoch_function, expires_on.toMillis() - DateTime.now().toMillis());
                return;
            }

            this.data.epoch_checker = setInterval(

                () => {
                    if (expires_on.toMillis() - DateTime.now().toMillis() <= hour) {

                        this.data.epoch_runner = setTimeout(this.data.epoch_function, expires_on.toMillis() - DateTime.now().toMillis());

                        // Unset the epoch checker because we re-set it later
                        this.data.epoch_checker = undefined;
                    }
                },

                hour
            );
        },

        create_image_animation: (el: HTMLImageElement, reverse = false) => anime.timeline({ autoplay:false })
            .add({
                opacity: reverse ? [1, 0] : [0, 1],
                easing: 'linear',
                duration: 120,
                targets: el
            }),

        delay_for_copyright_exit(): Promise<void> {

            // This is an ugly way to guarantee we can animate the
            // copyright information fade out in time.
            return new Promise<void>(

                (resolve) => {
                    this.data.copyright = undefined;

                    setTimeout(resolve, 390);
                }

            );
        },

        async update_current_background(el: HTMLImageElement, copyright: string) {

            const root = this.$refs.root as HTMLElement;
            this.data.image_data.push(el);

            // Handle first-time setup
            if (!this.state.current_image) {

                this.state.current_image = el;
                this.state.current_image.classList.add('background-image');

                switch(this.settingsStore.background_display_method as BackgroundDisplayMethod) {

                    case BackgroundDisplayMethod.STRETCH: this.state.current_image.classList.add('stretch'); break;

                    case BackgroundDisplayMethod.FILL: this.state.current_image.classList.add('fill'); break;

                    // Skip fit because we already have CSS for that by default
                    case BackgroundDisplayMethod.FIT: break;
                }

                root.appendChild(this.state.current_image);

                const anim = this.create_image_animation(this.state.current_image);

                anim.complete = () => {
                    store.commit('eventBusStore/UPDATE_IMAGE_LOADED_STATE', true);
                    this.set_up_copyright(copyright);
                };

                anim.play();
                return;
            }

            // Unset copyright for animation purpouses
            await this.delay_for_copyright_exit();

            const anim = this.create_image_animation(this.state.current_image, true)
                .add({
                    targets: this.state.current_image,
                    easing: 'linear',
                    endDelay: 240
                });

            // Set up animation hook for element swap
            anim.complete = () => this.$nextTick(() => {
                root.removeChild(this.state.current_image as HTMLElement);

                this.state.current_image = el;
                this.state.current_image.classList.add('background-image');

                switch(this.settingsStore.background_display_method as BackgroundDisplayMethod) {

                    case BackgroundDisplayMethod.STRETCH: this.state.current_image.classList.add('stretch'); break;

                    case BackgroundDisplayMethod.FILL: this.state.current_image.classList.add('fill'); break;

                    // Skip fit because we already have CSS for that by default
                    case BackgroundDisplayMethod.FIT: break;
                }

                root.appendChild(this.state.current_image);

                const anim = this.create_image_animation(this.state.current_image);

                anim.complete = () => this.set_up_copyright(copyright);

                anim.play();
                return;
            });

            anim.play();
        },

        animate_copyright_enter(el: Element, done: () => void) {

            const anim = anime({
                delay: anime.stagger(150, { start: 240 }),
                targets: el.children,
                easing: 'linear',
                opacity: [0, 1],
                duration: 120
            });

            anim.complete = () => done();
        },

        animate_copyright_exit(el: Element, done: () => void) {

            const anim = anime({
                delay: anime.stagger(150),
                targets: el.children,
                easing: 'linear',
                opacity: [1, 0],
                duration: 120
            });

            anim.complete = () => done();
        }
    },

    watch: {

        'settingsStore.background_display_method': {

            handler(state: BackgroundDisplayMethod) {

                if (!state || !this.state.current_image) return;

                switch(this.settingsStore.background_display_method as BackgroundDisplayMethod) {

                    case BackgroundDisplayMethod.STRETCH:

                        if (this.state.current_image.classList.contains('fill')) this.state.current_image.classList.remove('fill');
                        this.state.current_image.classList.add('stretch');

                    break;

                    case BackgroundDisplayMethod.FILL:

                        if (this.state.current_image.classList.contains('stretch')) this.state.current_image.classList.remove('stretch');
                        this.state.current_image.classList.add('fill');
                    break;

                    case BackgroundDisplayMethod.FIT:

                        if (this.state.current_image.classList.contains('stretch')) this.state.current_image.classList.remove('stretch');
                        if (this.state.current_image.classList.contains('fill')) this.state.current_image.classList.remove('fill');

                    break;
                }
            },

            deep: true
        }
    },

    computed: mapState(['settingsStore'])
});