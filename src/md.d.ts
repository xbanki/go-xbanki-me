/* eslint-disable */

declare module '*.md' {
    type MardownMetadataProperty = Record<string, any>;
    interface Markdown {
        metadata: MardownMetadataProperty;
        filename: string;
        html: string;
    }
    const data: Markdown;
    export default data;
}