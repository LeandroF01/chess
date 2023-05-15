const choirSound = new Audio("../sound/attack.mp3");

class ChessCell extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	static get styles() {
		return /*css*/ `
        
        :host{
            display: flex;
            justify-content: center;
            align-items: center;
            border: var(--border-style);
            width: var(--cell-size);
            height: var(--cell-size);
            box-sizing: border-box;
        }

		:host(.selected) {
			background: rgba(255, 0, 0, 0.31) ;
		  }
		:host(.valid) {
			background: rgba(0, 128, 0, 0.485);
		  }
		:host(.selected) chess-piece {
		  }
        `;
	}

	get position() {
		const [row, col] = this.coords;
		const x = String.fromCharCode(97 + row);
		const y = 9 - (col + 1);
		return x + y;
	}

	get coords() {
		const row = Number(this.getAttribute("row"));
		const col = Number(this.getAttribute("col"));
		return [row, col];
	}
	get piece() {
		return this.shadowRoot.querySelector("chess-piece");
	}

	hasOpponentPiece(sourcePiece) {
		return this.piece && this.piece.isOpponentOf(sourcePiece);
	}
	isEmpty() {
		return !this.piece;
	}

	select() {
		this.classList.add("selected");
	}

	unselect() {
		this.classList.remove("selected");
	}

	connectedCallback() {
		// this.x = this.getAttribute("x");
		// this.y = this.getAttribute("y");
		this.render();
	}

	toHeaven(cell) {
		return new Promise((resolve, reject) => {
			const animation = this.animate(
				[
					{ transform: "scale(1);", opacity: 1 },
					{ transform: "scale(0.2)", opacity: 0 },
				],
				{
					iterations: 1,
					duration: 1750,
					delay: 400,
				}
			);
			animation.onfinish = () => {
				resolve();
				setTimeout(() => {
					cell.piece.classList.add("piece-eaten");
					play(choirSound), 500;
				});
				piece.remove();
			};
		});
	}

	render() {
		this.shadowRoot.innerHTML = /*html*/ `
		<style>${ChessCell.styles}</style>
		`;
	}
}

customElements.define("chess-cell", ChessCell);
