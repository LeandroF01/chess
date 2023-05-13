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

	get id() {
		return this.x + this.y;
	}

	get piece() {
		return this.shadowRoot.querySelector("chess-piece");
	}

	select() {
		this.classList.add("selected");
	}

	unselect() {
		this.classList.remove("selected");
	}

	connectedCallback() {
		this.x = this.getAttribute("x");
		this.y = this.getAttribute("y");
		this.render();
	}

	render() {
		this.shadowRoot.innerHTML = /*html*/ `
		<style>${ChessCell.styles}</style>
		<div class="cell"></div>
		`;
	}
}

customElements.define("chess-cell", ChessCell);
