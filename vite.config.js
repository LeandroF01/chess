import { defineConfig } from "vite";

export default defineConfig({
	root: "./src",
	base: "/",
	publicDir: "public",
	build: {
		rollupOptions: {
			input: {
				main: "src/index.html",
			},
		},
	},
	plugins: [],
});
