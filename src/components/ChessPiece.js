const PIECES = {
	K: "king",
	Q: "queen",
	R: "rook",
	B: "bishop",
	N: "knight",
	P: "pawn",
};

class ChessPiece extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	static get styles() {
		return /*css*/ `
        :host {
            /* Estilos para :host */
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

	get id() {
		return this.type;
	}

	isWhite() {
		return this.color === "white";
	}
	isBlack() {
		return this.color === "black";
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
