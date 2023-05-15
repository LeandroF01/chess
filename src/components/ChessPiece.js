const PIECES = {
	K: "king",
	Q: "queen",
	R: "rook",
	B: "bishop",
	N: "knight",
	P: "pawn",
};

import RULES from "../data/rules.json";

const movementSound = new Audio("../sound/movement.mp3");
const play = (sound) => {
	sound.currentTime = 0;
	sound.play();
};

class ChessPiece extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	static get styles() {
		return /*css*/ `
        :host {
			clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
		.piece img {
		// image-rendering: pixelated;
		filter: drop-shadow(1px 1px 1px #0006);
        cursor: pointer;
		}
        `;
	}

	connectedCallback() {
		this.type = this.getAttribute("type");
		this.color = ["K", "Q", "R", "B", "N", "P"].includes(this.type)
			? "black"
			: "white";
		this.render();
	}

	get directions() {
		const type = this.type.toLowerCase();
		return RULES[type];
	}

	isWhite() {
		return this.color === "white";
	}
	isBlack() {
		return this.color === "black";
	}
	isPawn() {
		return this.type.toLowerCase() === "p";
	}

	isRook() {
		return this.type.toLowerCase() === "r";
	}

	isKing() {
		return this.type.toLowerCase() === "k";
	}

	isBishop() {
		return this.type.toLowerCase() === "b";
	}

	isKnight() {
		return this.type.toLowerCase() === "n";
	}

	isQueen() {
		return this.type.toLowerCase() === "q";
	}

	isOpponentOf(piece) {
		return this.color !== piece.color;
	}

	slide(source, target) {
		const cellSize = source.clientWidth;
		const x = (target.coords[0] - source.coords[0]) * cellSize;
		const y = (target.coords[1] - source.coords[1]) * cellSize;

		return new Promise((resolve, reject) => {
			const animation = this.animate(
				[
					{ transform: "translate(0, 0) scale(1.2)", zIndex: 15 },
					{ transform: `translate(${x}px, ${y}px) scale(1.2)`, zIndex: 15 },
				],
				{
					duration: 400,
					iterations: 1,
				}
			);
			animation.onfinish = () => {
				resolve();
				setTimeout(() => play(movementSound), 400);
			};
		});
	}

	render() {
		const piece = PIECES[this.type.toUpperCase()];
		this.shadowRoot.innerHTML = /*html*/ `
        <style>${ChessPiece.styles}</style>
        <div class="piece">
            <img src="../assets/pieces/${this.color}-${piece}.png" 
			alt="${this.color}-${piece}" />
        </div>
        `;
	}
}

customElements.define("chess-piece", ChessPiece);
