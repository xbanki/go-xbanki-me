import { mapState }        from 'vuex';
import { defineComponent } from 'vue';

import { ComponentState as CategoriesState } from '@/vue/settings/categories/categories';
import { verify_localstorage_availlability } from '@/lib/persistence';

import categoriesComponent from '@/vue/settings/categories/categories.vue';
import modalComponent      from '@/vue/modal/modal.vue';

/**
 * Comonent internal state.
 */
interface ComponentState {

    /**
     * Changes display state between initialization & full settings.
     * @enum {STATE_INIT | STATE_SETTINGS}
     */
    component_display_state: 'STATE_INIT' | 'STATE_SETTINGS';

    /**
     * Categories sub-component state.
     */
    categories_state: CategoriesState;
}

export default defineComponent({

    data() {

        const categories_state: CategoriesState = {
            critical_only: false
        };

        const state: ComponentState = {
            component_display_state: 'STATE_SETTINGS',
            categories_state
        };

        return { state };
    },

    components: {
        categoriesComponent,
        modalComponent
    },

    mounted() { this.$nextTick(() => this.discriminate_component_state()); },

    methods: {
        discriminate_component_state() {
            const localstorage_availlable = verify_localstorage_availlability();

            if (localstorage_availlable && !localStorage.getItem(`metadata-${this.__metaData.application_name}`)) {
                this.state.component_display_state = 'STATE_INIT';

                return;
            }
        }
    },

    computed: mapState(['eventBusStore', '__metaData'])
});