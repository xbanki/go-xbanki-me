import { defineComponent } from 'vue';

import anime from 'animejs';

export default defineComponent({

    props: {
        animate_enter: {
            default: undefined,
            required: false,
            type: Function
        },

        animate_exit: {
            default: undefined,
            required: false,
            type: Function
        },

        display: {
            default: false,
            required: true,
            type: Boolean
        }
    },

    methods: {
        animate_modal_enter(el: Element, done: () => void) {
            const default_animator = (element: Element, completed: () => void) => {

                const animation = anime({
                    targets: element,
                    easing: 'linear',
                    autoplay: false,
                    opacity: [0, 1],
                    duration: 120
                });

                animation.complete = () => completed();

                animation.play();
            };

            // Call either prop animator or default animator
            (this.animate_enter || default_animator)(el, done);
        },

        animate_modal_exit(el: Element, done: () => void) {
            const default_animator = (element: Element, completed: () => void) => {

                const animation = anime({
                    targets: element,
                    easing: 'linear',
                    autoplay: false,
                    opacity: [1, 0],
                    duration: 120
                });

                animation.complete = () => completed();

                animation.play();
            };

            // Call either prop animator or default animator
            (this.animate_exit || default_animator)(el, done);
        }
    }
});