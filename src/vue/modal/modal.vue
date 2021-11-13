<template>

    <!-- Modal UI layer anchor //-->
    <teleport to="main#go-xbanki-ui">

        <!-- Animejs based enter/exit animation hooks //-->
        <transition v-on:enter="animate_enter" v-on:leave="animate_exit">

            <!-- Modal component positioning wrapper //-->
            <main class="component-modal" v-if="state.render">

                <!-- Modal display bounding box //-->
                <div class="modal-parent">

                    <!-- Modal content slot //-->
                    <slot name="default"/>
                </div>
            </main>
        </transition>
    </teleport>
</template>

<script lang="ts" src="./modal.ts"></script>
<style lang="scss" src="./modal.scss"></style>