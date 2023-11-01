import { defineConfig } from "vite";

export default defineConfig({
	root: "./src",
	base: "/",
	publicDir: "public",
	build: {
		rollupOptions: {
			input: {
				main: "src/main.js",
			},
		},
	},
	plugins: [],
});
