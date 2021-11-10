<template>

    <!-- Background element display wrapper //-->
    <main class="component-background">

        <!-- Dynamically rendered background image //-->
        <img ref="image" v-show="!state.loading" alt="Background Image">
    </main>
</template> 

<script lang="ts" src="./background.ts"></script>
<style lang="scss" src="./background.scss"></style>