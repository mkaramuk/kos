/**
 * This type declaration only available on renderer process.
 * It provides intellisense for exposed APIs from main process.
 */
declare const electron: typeof import("./main/api").default;
