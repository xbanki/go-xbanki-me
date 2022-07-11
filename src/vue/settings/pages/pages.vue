<template>

    <!-- Dynamically rendered settings page component //-->
    <main class="component-pages">
        <component v-bind:is="state.active_category" v-on:close="pass_close" v-bind:data="{ categories: state.categories }"/>
    </main>
</template>

<script lang="ts" src="./pages.ts"></script>
<style lang="scss" src="./pages.scss" scoped></style>