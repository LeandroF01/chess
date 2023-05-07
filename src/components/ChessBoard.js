import "./ChessCell.js";
import "./ChessPiece.js";
import initialLocation from "../data/initialLocation.json";

class ChessBoard extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.movements = [];
		this.PIECES = [];
		this.stage = 0;
	}

	isWhiteTurn() {
		return this.movements % 2 === 0;
	}
	isBlackTurn() {
		return this.movements % 2 !== 0;
	}

	isSelectStage() {
		return this.stage === 0;
	}

	isTargetStage() {
		return this.stage === 1;
	}

	static get styles() {
		return /*css*/ `
        :host{
            --pleace-size: 54px;
            --cell-size: 72px;
			--board-size: calc(var(--cell-size) * 8);
			--border-style: 0;

			user-select: none;
        }

		:host(.wood){
			--color-odd: #eed2aa;
			--color-even: #90502f;
			--color-frame: #62351f; 
		}
		:host(.black){
			--color-odd: #fff;
			--color-even: #1c1c1c;
			--color-frame: #0a0a0a; 
		}

		.frame{
			display: grid;
        	grid-template-areas: "top top top"
                              	 "left board right"
                              	 "bottom bottom bottom";
        	justify-content: center;
        	align-items: center;
        	width: calc(var(--cell-size) * 10);
        	height: calc(var(--cell-size) * 10);
        	background: var(--color-frame);
        	font-family: Montserrat, sans-serif;
        	color: #eee; 
		}

		.row{ display: flex;}
		.top { grid-area: top; }
		.bottom { grid-area: bottom; }
		.left { grid-area: left; }
		.right { grid-area: right; }
		.board { grid-area: board; }

		.fake {
			display: flex;
			justify-content: center;
			align-items: center;
			width: var(--cell-size);
			height: var(--cell-size);
			box-sizing: border-box;
		}

		.board{
			display: flex;
			flex-wrap: wrap;
			width: var(--board-size);
			height: var(--board-size);
			background: var(--color-even);
			border: var(--border-style);
			background: conic-gradient(
				var(--color-even) 90deg,
				var(--color-odd) 90deg 180deg,
				var(--color-even) 180deg 270deg,
				var(--color-odd) 270deg
			);
			background-size: calc(var(--cell-size) *2) calc(var(--cell-size) *2);
		}
        `;
	}

	connectedCallback() {
		this.render();
		this.classList.add("wood");
	}

	renderCells() {
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				this.renderCell(y, x);
			}
		}
	}

	renderCell(y, x) {
		const board = this.shadowRoot.querySelector(".board");
		const col = String.fromCharCode(97 + x);
		const row = 9 - (y + 1);
		const cell = document.createElement("chess-cell");

		cell.setAttribute("x", col);
		cell.setAttribute("y", row);

		cell.addEventListener("click", () => this.onClick(cell));
		cell.addEventListener("contextmenu", (event) =>
			this.onRightClick(event, cell)
		);
		board.appendChild(cell);
	}

	onRightClick(vent, cell) {
		event.preventDefault();
		cell.classList.addd("valid");
	}
	genFakeCells(n) {
		const texts = (n === 8 ? "87654321" : " abcdefgh ").split("");
		return texts
			.map((text) => /* html */ `<div class="fake">${text}</div>`)
			.join("");
	}

	onClick(cell) {
		const piece = cell.shadowRoot.querySelector("chess-piece");
		const isCancel = cell.classList.contains("selected");
		const isTargetvalid = cell.classList.contains("valid");

		if (piece && this.isSelectStage()) this.selectPiece(cell);
		else if (isCancel && this.isTargetStage()) this.reset();
		else if (this.isTargetStage() && isTargetvalid) this.selectTarget(cell);
	}

	selectPiece(cell) {
		const sourcePiece = cell.shadowRoot.querySelector("chess-piece");
		const isCorrectWhitePiece = this.isWhiteTurn() && sourcePiece.isWhite();
		const isCorrectBlackPiece = this.isBlackTurn() && sourcePiece.isBlack();

		const isValidPiece = isCorrectWhitePiece || isCorrectBlackPiece;
		if (isValidPiece) {
			cell.select();
			this.stage = 1;
		}
	}

	reset() {
		const cells = [...this.shadowRoot.querySelectorAll("chess-cell")];
		cells.forEach((cell) => cell.classList.remove("selected", "valid"));
		this.stage = 0;
	}

	selectTarget(cell) {
		this.moveTo(cell);
	}

	addPiece(letter, position) {
		const x = position[0];
		const y = position[1];
		const cell = this.getCell(x, y);

		const piece = document.createElement("chess-piece");
		piece.setAttribute("type", letter);
		cell.appendChild(piece);

		this.PIECES.push(piece);
	}

	at(position) {
		const x = position[0];
		const y = position[1];
		return this.getCell(x, y);
	}

	isEmpty(position) {
		const cell = this.at(position);
		const piece = cell.querySelector("chess-piece");
		return !piece;
	}

	moveTo(targetCell) {
		const sourceCell = this.shadowRoot.querySelector("chess-cell.selected");
		const sourcePiece = sourceCell.shadowRoot.querySelector("chess-piece");

		targetCell.shadowRoot.querySelector(".cell").appendChild(sourcePiece);
		// sourcePiece.incMovements();
		this.addMovements(sourcePiece, sourceCell, targetCell);
		this.reset();
	}

	addMovements(sourcePiece, sourceCell, targetCell) {
		this.movements.push(sourcePiece.id + sourceCell.id + targetCell.id);
	}

	getMovements(piece) {
		const movements = this.movements.filter((movement) =>
			movement.startsWith(piece.id)
		);
	}

	getCell(x, y) {
		return this.shadowRoot
			.querySelector(`[x="${x}"][y="${y}"]`)
			.shadowRoot.querySelector(".cell");
	}

	movePiece(cell) {}

	getPiece(position) {
		const isEmpty = this.isEmpty(position);
		if (!isEmpty) {
			const cell = this.at(position);
			return cell.querySelector("chess-piece");
		}
	}

	preparePieces() {
		initialLocation.forEach(([piece, position]) =>
			this.addPiece(piece, position)
		);
	}

	render() {
		this.shadowRoot.innerHTML = /*html*/ `
		<style>${ChessBoard.styles}</style>
		<div class="frame">
			<div class="row top">
			${this.genFakeCells(10)}
			</div>
				<div class="col left">
				${this.genFakeCells(8)}
				</div>
					<div class="board">
						
					</div>
				<div class="col right">
				${this.genFakeCells(8)}
				</div>
			<div class="row bottom">
			${this.genFakeCells(10)}
			</div>
		</div>`;
		this.renderCells();
	}
}

customElements.define("chess-board", ChessBoard);
