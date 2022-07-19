<template>

    <!-- Theme category page root element //-->
    <main class="component-theme">

        <!-- Theme component title display //-->
        <span class="theme-title"> Application Theme </span>

        <!-- Theme selections container //-->
        <section class="theme-selections">

            <!-- Light theme item container //-->
            <div class="selections-item">

                <!-- Theme selection icon //-->
                <input

                    id="settings-theme-light"

                    v-model="state.theme"

                    v-on:change="update"

                    value="THEME_LIGHT"

                    name="theme-light"

                    type="radio"

                >
                
                <!-- Theme name descriptor //-->
                <label for="theme-light"> Light </label>
            </div>

            <!-- Dark theme item container //-->
            <div class="selections-item">

                <!-- Theme selection icon //-->
                <input

                    id="settings-theme-dark"

                    v-model="state.theme"

                    v-on:change="update"

                    value="THEME_DARK"

                    name="theme-dark"

                    type="radio"

                >

                <!-- Theme name descriptor //-->
                <label for="theme-dark"> Dark </label>
            </div>

            <!-- OS matched theme item container //-->
            <div class="selections-item">
                
                <!-- Theme selection icon //-->
                <input

                    id="settings-theme-system"

                    v-model="state.theme"

                    v-on:change="update"

                    value="THEME_SYSTEM"

                    name="theme-system"

                    type="radio"

                >
                
                <!-- Theme name descriptor //-->
                <label for="theme-system"> Automatic </label>
            </div>
        </section>
    </main>
</template>

<script lang="ts" src="./theme.ts"></script>
<style lang="scss" src="./theme.scss" scoped></style>