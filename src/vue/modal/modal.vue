<template>
    
    <!-- Always set modals on the UI layer above all else //-->
    <teleport to="main#go-xbanki-ui">
        
        <!-- Animejs based enter/exit animation hooks //-->
        <transition v-on:enter="animate_modal_enter" v-on:leave="animate_modal_exit">

            <!-- Modal base wrapper/ positioner //-->
            <main class="component-modal" v-if="display">

                <!-- Modal centered wrapper content //-->
                <slot name="default"/>
            </main>
        </transition>
    </teleport>
</template>

<script lang="ts" src="./modal.ts"></script>
<style lang="scss" src="./modal.scss"></style>