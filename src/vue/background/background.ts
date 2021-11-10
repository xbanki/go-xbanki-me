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
    image_data: undefined | GetDailyBackgroundData;
}

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Is the img element loading.
     * @type {boolean}
     */
    loading: boolean;
}

export default defineComponent({

    data() {
        const data: ComponentData = { image_data: undefined };

        const state: ComponentState = { loading: true };

        return { state, data };
    },

    mounted() {
        this.$nextTick(() => {

            axios.get(`${config.api_url}/get-daily-background`)

                // Parse image data
                .then(data => data.data as GetDailyBackgroundData)
                .then(
                    (data) => {
                        const expires_on = DateTime.fromISO(data.data.expires_on as unknown as string);

                        return { ...data, data: { ...Object.assign(data.data, { expires_on }) }};
                    }
                )
                .then(
                    (data) => {
                        if (!data) return;

                        const image = this.$refs.image as HTMLImageElement;

                        image.crossOrigin = 'Anonymous';
                        image.src = data.data.url;

                        // Handle loaded event
                        image.onload = () => {
                            if (image.complete || image.complete === undefined) {
                                this.state.loading = false;
                                return;
                            }
                        };
                    }
                );
        });
    } 
});