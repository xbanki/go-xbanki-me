import { defineComponent } from 'vue';

/**
 * Component data internal description interface.
 */
interface ComponentState {

    /**
     * Controls the displaying of the modal element.
     * @type {boolean}
     */
    render: boolean;
}

export default defineComponent({

    // We emit a callback on the 'ready' event to signal to the parent component we can be opened
    mounted() { this.$emit('ready', () => this.state.render = true); },

    data() {

        const state: ComponentState = { render: false };

        return { state };
    },

    methods: {

        animate_enter(el: Element, done: () => void) {
            return done();
        },

        animate_exit(el: Element, done: () => void) {
            return done();
        },

        emit_confirm() {
            this.state.render = false;
            this.$emit('confirm');
        }
    },

    emits: ['ready', 'confirm']
});