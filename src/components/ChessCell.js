class ChessCell extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	static get styles() {
		return /*css*/ `
        :host{
            
        }
        .cell{
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #000;
            width: var(--cell-size);
            height: var(--cell-size);
            box-sizing: border-box;
        }
        `;
	}

	connectedCallback() {
		this.x = this.getAttribute("x");
		this.y = this.getAttribute("y");
		this.render();
	}

	render() {
		this.shadowRoot.innerHTML = /*html*/ `
		<style>${ChessCell.styles}</style>
		<div class="cell">${this.x}${this.y}</div>
		`;
	}
}

customElements.define("chess-cell", ChessCell);
