import { DateTime }        from 'luxon';
import { defineComponent } from 'vue';

import axios from 'axios';

import { GetDailyBackgroundData } from '@/lib/http';

import config from '@/lib/config';

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
    mounted() { this.$nextTick(() => this.get_daily_background_image()); },

    data() {
        const data: ComponentData = { image_data: [] };

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
                                if (image.complete || image.complete === undefined) this.update_current_background(image);
                            };
                        }
                    );
            });
        },

        update_current_background(el: HTMLImageElement) {

            const root = this.$refs.root as HTMLElement;
            this.data.image_data.push(el);

            // Handle first-time setup
            if (!this.state.current_image) {

                this.state.current_image = el;
                root.appendChild(this.state.current_image);

                return;
            }

            // Handle multi-image setup
            root.removeChild(this.data.image_data.shift() as HTMLImageElement);

            this.$nextTick(() => {

                this.state.current_image = el;
                root.appendChild(this.state.current_image);
            });
        }
    }
});