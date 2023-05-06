import "./components/ChessBoard.js";
import * as dat from "dat.gui";

const board = document.querySelector("chess-board");

board.preparePieces();

const gui = new dat.GUI();

const options = {
	theme: "wood",
};

gui.add(options, "theme", ["wood", "black"]).onChange((data) => {
	board.classList.remove("wood", "black");
	board.classList.add(data);
});

gui.close();
