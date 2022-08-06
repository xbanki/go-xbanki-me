<template>
    <main class="component-canvas">

        <!-- Canvas settings panel //-->
        <section

            v-bind:style="{

                'left': `${state.settings.x}px`,

                'top': `${state.settings.y}px`
            }"

            v-bind:class="{ 'settings-faint': state.dragging || state.resizing }"

            v-if="componentCanvasStore.edit"

            class="canvas-settings"

            ref="panel"
            
        >
            
            <!-- Settings panel titlebar //-->
            <div class="settings-bar">

                <!-- Drag handle //-->
                <span class="bar-handle"> ☰ </span>

                <!-- Panel title //-->
                <span class="bar-title"> UI Layout </span>
            </div>

            <!-- Settings reset & confirmation buttons //-->
            <div class="settings-buttons">
                
                <!-- Reset all edits button //-->
                <button class="buttons-reset" v-on:click="handle_click_reset"> {{ state.settings.label }} </button>

                <!-- Confirm edits button //-->
                <button class="buttons-confirm" v-on:click="handle_click_confirm"> Confirm </button>
            </div>
        </section>

        <component-draggable

            v-bind:style="{

                'left': `${item.position.x}px`,

                'top': `${item.position.y}px`,

                'height': `${item.size.h}px`,

                'width': `${item.size.w}px`

            }"

            v-bind:scaleable="item.editable"

            v-for="item of data.items"

            v-bind:class="item.id"
        
            v-bind:key="item.id"
        >

            <!-- Binds component to the draggable content slot //-->
            <component v-bind:is="item.component"/>

        </component-draggable>
    </main>
</template>

<script lang="ts" src="./canvas.ts"></script>
<style lang="scss" src="./canvas.scss"></style>