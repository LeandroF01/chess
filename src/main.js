import "./components/ChessBoard.js";
import * as dat from "dat.gui";

const board = document.querySelector("chess-board");

board.preparePieces();

const gui = new dat.GUI();

const options = {
	pieces: "normal",
	theme: "wood",
};

gui
	.add(options, "pieces", ["normal", "chess"])
	.onChange((data) => board.changePieces(data));

gui.add(options, "theme", ["wood", "black"]).onChange((data) => {
	board.classList.remove("wood", "black");
	board.classList.add(data);
});

gui.close();
