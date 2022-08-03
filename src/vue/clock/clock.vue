<template>

    <!-- Clock component wrapper parent //-->
    <main class="component-clock">

        <!-- CLock current time display //-->
        <span class="clock-time"> {{ state.active_time_data }} </span>
    </main>
</template>

<script lang="ts" src="./clock.ts"></script>
<style lang="scss" src="./clock.scss"></style>