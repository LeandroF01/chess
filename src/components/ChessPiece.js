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
        `;
	}

	connectedCallback() {
		this.type = this.getAttribute("type");
		this.render();
	}

	render() {
		this.shadowRoot.innerHTML = /*html*/ `
        <style>${ChessPiece.styles}</style>
        <div class="piece">
            /* Contenido */
        </div>
        `;
	}
}

customElements.define("chess-piece", ChessPiece);
