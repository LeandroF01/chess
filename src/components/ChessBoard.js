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
        }
		.board{
			width: var(--board-size);
			height: var(--board-size);
			background: #90502f;
		}
        `;
	}

	connectedCallback() {
		this.render();
	}

	render() {
		this.shadowRoot.innerHTML = /*html*/ `
		<style>${ChessBoard.styles}</style>
		<div class="board"></div>
		`;
	}
}

console.log("chess");

customElements.define("chess-board", ChessBoard);
