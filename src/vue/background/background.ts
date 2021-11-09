import { defineComponent } from 'vue';
import flatted from 'flatted';

import   axios from 'axios';

import { GetDailyBackgroundData } from '@/lib/http';

import config from '@/lib/config';

/**
 * Component data internal description interface.
 */
interface ComponentData {
    image_data: undefined | GetDailyBackgroundData;
}

export default defineComponent({

    data() {
        const data: ComponentData = { image_data: undefined };

        return { data };
    }
});