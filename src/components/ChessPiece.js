const PIECES = {
	K: "king",
	Q: "queen",
	R: "rook",
	B: "bishop",
	N: "knight",
	P: "pawn",
};

import RULES from "../data/rules.json";

const choirSound = new Audio("../sound/attack.mp3");
const movementSound = new Audio("../sound/movement.mp3");
const play = (sound) => {
	sound.currentTime = 0;
	sound.play();
};

const getSkin = (theme, filename) => {
	const ext = theme === "normal" ? "svg" : "png";
	return `../assets/pieces/${theme}/${filename}.png`;
};

class ChessPiece extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.theme = "normal";
	}

	static get styles() {
		return /*css*/ `
        :host {
			clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
		.piece img {
		filter: drop-shadow(1px 1px 1px #0006);
        cursor: pointer;
		}

		 .piece-eaten {
			display: none;
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
	changeTheme(theme = "normal") {
		this.theme = theme;
		const piece = PIECES[this.type.toUpperCase()];
		const img = this.shadowRoot.querySelector(".piece img");
		img.src = getSkin(theme, `${this.color}-${piece}`);
	}

	toHeaven(cell) {
		return new Promise((resolve, reject) => {
			const animation = this.animate(
				[
					{ transform: "scale(1);", opacity: 1 },
					{ transform: "scale(0.2)", opacity: 0, offset: 0.5 },
					{ transform: "scale(0.2)", opacity: 0 },
				],
				{
					iterations: 1,
					duration: 1250,
					delay: 200,
				}
			);

			const chessPieces = cell.shadowRoot.querySelectorAll("chess-piece");

			if (chessPieces.length >= 2) {
				const secondChessPiece = chessPieces[1];
				const pieceElement =
					secondChessPiece.shadowRoot.querySelector(".piece");

				animation.onfinish = () => {
					resolve();
					pieceElement.classList.add("piece-eaten");
					setTimeout(() => {
						play(this.choirSound);
					}, 300);
				};
			} else {
				console.log(
					"No se encontró el segundo elemento 'chess-piece' dentro de 'chess-cell'"
				);
			}
		});
	}

	render() {
		const piece = PIECES[this.type.toUpperCase()];
		const url = getSkin(this.theme, `${this.color}-${piece}`);
		this.shadowRoot.innerHTML = /*html*/ `
        <style>${ChessPiece.styles}</style>
        <div class="piece">
		<img src="${url}" alt="${this.color} ${piece}" />
        </div>
        `;
	}
}

customElements.define("chess-piece", ChessPiece);
