<template>

    <!-- Dynamically rendered settings page component //-->
    <component :is="state.active_category"/>
</template>

<script lang="ts" src="./pages.ts"></script>
<style lang="scss" src="./pages.scss" scoped></style>