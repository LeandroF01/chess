import { defineConfig } from "vite";

export default defineConfig({
	root: "./src",
	base: "/",
	publicDir: "public",
	build: {
		outDir: "dist",
		rollupOptions: {
			input: {
				main: "./src/main.js", // Ruta al archivo principal de tu aplicación
			},
		},
	},
	plugins: [],
});
