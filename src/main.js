import "./components/ChessBoard";
import * as dat from "dat.gui";

const board = document.createElement("chess-board");
board.setFromFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w");

const gui = new dat.GUI();

const options = {
	pieces: "normal",
	theme: "wood",
};

gui
	.add(options, "pieces", ["normal", "chess"])
	.onChange((data) => board.changePieces(data));

gui.add(options, "theme", ["wood", "black"]).onChange((data) => {
	const chessboard = document.querySelector("chess-board");
	chessboard.classList.remove("wood", "black");
	chessboard.classList.add(data);
});

gui.close();
