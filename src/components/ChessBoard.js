import "./ChessCell.js";

class ChessBoard extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	static get styles() {
		return /*css*/ `
        :host{
            --pleace-size: 54px;
            --cell-size: 72px;
			--board-size: 576px;

			--color-odd: #eed2aa;
			--color-even: #90502f;
        }
		.board{
			display: flex;
			flex-wrap: wrap;
			width: var(--board-size);
			height: var(--board-size);
			background: var(--color-even);

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
	}

	renderCells() {
		const cells = [];
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				cells.push(this.renderCell(y, x));
			}
		}
		return cells.join("");
	}
	renderCell(y, x) {
		const col = String.fromCharCode(65 + x);
		const row = 9 - (y + 1);
		return /*html*/ `
		<chess-cell x="${col}"y="${row}"></chess-cell>
		`;
	}

	render() {
		this.shadowRoot.innerHTML = /*html*/ `
		<style>${ChessBoard.styles}</style>
		<div class="board">
		${this.renderCells()}
		</div>
		`;
	}
}

customElements.define("chess-board", ChessBoard);
