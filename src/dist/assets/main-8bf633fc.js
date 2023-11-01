class Re {
	constructor(e) {
		(this.movements = e), (this.offset = 0);
	}
	set(e) {
		this.offset = e.toLowerCase()[0] === "w" ? 0 : 1;
	}
	isWhite() {
		return (this.movements.length % 2) + this.offset === 0;
	}
	isBlack() {
		return (this.movements.length % 2) + this.offset !== 0;
	}
	toString() {
		return this.isWhite() ? "white" : "black";
	}
}
class Le {
	constructor() {
		this.movements = [];
	}
	get length() {
		return this.movements.length;
	}
	add(e, t, i) {
		this.movements.push(e.id + t.position + i.position);
	}
	getAll() {
		return this.movements;
	}
	of(e) {
		return this.movements.filter((t) => t.startsWith(e));
	}
}
class Pe {
	constructor() {
		(this.numPieces = 0), (this.pieces = {}), (this.captured = {});
	}
	push(e) {
		this.numPieces++;
		let t = 0;
		for (; this.has(e.type + t); ) t++;
		(e.id = e.type + t), (this.pieces[e.id] = e);
	}
	kill(e) {
		this.numPieces--, delete this.pieces[e.id], (this.captured[e.id] = e);
	}
	get(e) {
		return this.pieces[e];
	}
	has(e) {
		return Object.keys(this.pieces).includes(e);
	}
}
class Ne {
	constructor() {
		this.stage = 0;
	}
	isSelect() {
		return this.stage === 0;
	}
	isTarget() {
		return this.stage === 1;
	}
	isWaitingBefore() {
		return this.stage === 2;
	}
	isWaitingAfter() {
		return this.stage === 3;
	}
	reset() {
		this.stage = 0;
	}
	next() {
		this.stage === 0
			? (this.stage = 1)
			: this.stage === 1
			? (this.stage = 2)
			: this.stage === 2
			? (this.stage = 3)
			: this.stage === 3 && (this.stage = 0);
	}
}
class Z extends HTMLElement {
	constructor() {
		super(),
			(this.captured = !1),
			(this.capturedBy = null),
			this.attachShadow({ mode: "open" });
	}
	static get styles() {
		return `
        
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
		const [e, t] = this.coords,
			i = String.fromCharCode(97 + e),
			s = 9 - (t + 1);
		return i + s;
	}
	get coords() {
		const e = Number(this.getAttribute("row")),
			t = Number(this.getAttribute("col"));
		return [e, t];
	}
	get piece() {
		return this.shadowRoot.querySelector("chess-piece");
	}
	hasOpponentPiece(e) {
		return this.piece && this.piece.isOpponentOf(e);
	}
	isEmpty() {
		return !this.piece;
	}
	select() {
		this.classList.add("selected");
	}
	isEmpty() {
		return !this.piece;
	}
	unselect() {
		this.classList.remove("selected");
	}
	connectedCallback() {
		this.render();
	}
	render() {
		this.shadowRoot.innerHTML = `
		<style>${Z.styles}</style>
		`;
	}
}
customElements.define("chess-cell", Z);
const Be = [],
	Fe = [
		[-1, -1],
		[1, -1],
		[-1, 1],
		[1, 1],
	],
	He = [
		[-2, -1],
		[-1, -2],
		[1, -2],
		[2, -1],
		[2, 1],
		[1, 2],
		[-1, 2],
		[-2, 1],
	],
	De = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	],
	Ve = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
		[-1, -1],
		[-1, 1],
		[1, -1],
		[1, 1],
	],
	ze = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
		[-1, -1],
		[-1, 1],
		[1, -1],
		[1, 1],
	],
	Me = { p: Be, b: Fe, n: He, r: De, q: Ve, k: ze },
	re = {
		K: "king",
		Q: "queen",
		R: "rook",
		B: "bishop",
		N: "knight",
		P: "pawn",
	},
	Ie = new Audio("../sound/attack.mp3"),
	$e = new Audio("../sound/movement.mp3"),
	ae = (n) => {
		n && n.readyState >= 2 && ((n.currentTime = 0), n.play());
	},
	le = (n, e) => `../assets/pieces/${n}/${e}.png`;
class ee extends HTMLElement {
	constructor() {
		super(), this.attachShadow({ mode: "open" }), (this.theme = "chess");
	}
	static get styles() {
		return `
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
		(this.type = this.getAttribute("type")),
			(this.color = ["K", "Q", "R", "B", "N", "P"].includes(this.type)
				? "black"
				: "white"),
			this.render();
	}
	get directions() {
		const e = this.type.toLowerCase();
		return Me[e];
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
	isOpponentOf(e) {
		return this.color !== e.color;
	}
	slide(e, t) {
		const i = e.clientWidth,
			s = (t.coords[0] - e.coords[0]) * i,
			o = (t.coords[1] - e.coords[1]) * i;
		return new Promise((a, d) => {
			const c = this.animate(
				[
					{ transform: "translate(0, 0) scale(1.2)", zIndex: 15 },
					{ transform: `translate(${s}px, ${o}px) scale(1.2)`, zIndex: 15 },
				],
				{ duration: 400, iterations: 1 }
			);
			c.onfinish = () => {
				a(), setTimeout(() => ae($e), 400);
			};
		});
	}
	changeTheme(e = "chess") {
		this.theme = e;
		const t = re[this.type.toUpperCase()],
			i = this.shadowRoot.querySelector(".piece img");
		i.src = le(e, `${this.color}-${t}`);
	}
	toHeaven(e) {
		return new Promise((t, i) => {
			const s = this.animate(
					[
						{ transform: "scale(1)", opacity: 1 },
						{ transform: "scale(0.2)", opacity: 0, offset: 0.5 },
						{ transform: "scale(0.2)", opacity: 0 },
					],
					{ iterations: 1, duration: 1200, delay: 300 }
				),
				o = e.shadowRoot.querySelectorAll("chess-piece");
			if (o.length >= 2) {
				const d = o[1].shadowRoot.querySelector(".piece");
				s.onfinish = () => {
					t(),
						d.classList.add("piece-eaten"),
						setTimeout(() => {
							ae(Ie);
						}, 300);
				};
			} else
				console.log(
					"No se encontró el segundo elemento 'chess-piece' dentro de 'chess-cell'"
				);
		});
	}
	render() {
		const e = re[this.type.toUpperCase()],
			t = le(this.theme, `${this.color}-${e}`);
		this.shadowRoot.innerHTML = `
        <style>${ee.styles}</style>
        <div class="piece">
		<img src="${t}" alt="${this.color} ${e}" />
        </div>
        `;
	}
}
customElements.define("chess-piece", ee);
const Ue = (n) => {
		const [e, t] = n.toLowerCase().split(""),
			i = e.charCodeAt(0) - 97,
			s = 8 - Number(t);
		return i >= 0 && i < 8 && s >= 0 && s < 8 ? [i, s] : null;
	},
	de = (n) =>
		n
			.split("")
			.map((e) =>
				e.match(/[a-z]/)
					? e.toUpperCase()
					: e.match(/[A-Z]/)
					? e.toLowerCase()
					: e
			)
			.join(""),
	Ge = "black";
class te extends HTMLElement {
	constructor() {
		super(),
			this.attachShadow({ mode: "open" }),
			(this.pieces = new Pe()),
			(this.movements = new Le()),
			(this.turn = new Re(this.movements)),
			(this.stage = new Ne()),
			(this.capturedPieces = []);
	}
	static get styles() {
		return `
        :host{
			--selected-cell-color: #0f06;
			--valid-cell-color: #f006;
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
		this.render(), this.classList.add(Ge);
	}
	changePieces(e) {
		[
			...document
				.querySelector("chess-board")
				.shadowRoot.querySelectorAll("chess-cell"),
		].forEach((s) => {
			const o = s.piece;
			o && o.changeTheme(e);
		});
	}
	renderCells() {
		for (let e = 0; e < 8; e++)
			for (let t = 0; t < 8; t++) this.renderCell(t, e);
	}
	renderCell(e, t) {
		const i = this.shadowRoot.querySelector(".board"),
			s = document.createElement("chess-cell");
		s.setAttribute("col", t),
			s.setAttribute("row", e),
			s.addEventListener("click", () => this.onClick(s)),
			s.addEventListener("contextmenu", (o) => this.onRightClick(o, s)),
			i.appendChild(s);
	}
	hightlightMoves(e) {
		e.forEach((t) => {
			const i = this.getCell(Ue(t.position));
			i && i.classList.add("valid");
		});
	}
	onRightClick(e, t) {
		e.preventDefault(), t.piece && console.log(this.getAllMoves(t, t.piece));
	}
	onClick(e) {
		const t = e.piece,
			i = e.classList.contains("selected"),
			s = e.classList.contains("valid");
		t && this.stage.isSelect()
			? this.selectPiece(e)
			: i && this.stage.isTarget()
			? (this.reset(), this.stage.reset())
			: this.stage.isTarget() && s && this.selectTarget(e);
	}
	getAllMoves(e, t) {
		const i = Number(e.getAttribute("row")),
			s = Number(e.getAttribute("col")),
			o = [];
		if (t.isPawn()) {
			const a = t.color === "white" ? -1 : 1,
				d = (t.isBlack() && s === 1) || (t.isWhite() && s === 6),
				c = this.getCell([i, s + 1 * a]);
			c.isEmpty() && o.push({ position: c.position, type: "normal" });
			const h = this.getCell([i, s + 2 * a]);
			c.isEmpty() &&
				h.isEmpty() &&
				d &&
				o.push({ position: h.position, type: "initial" });
			const f = this.getCell([i - 1, s + 1 * a]),
				u = this.getCell([i + 1, s + 1 * a]),
				p = f && this.hasOpponentPiece(f, t),
				y = u && this.hasOpponentPiece(u, t);
			p && o.push({ position: f.position, type: "attack" }),
				y && o.push({ position: u.position, type: "attack" });
		}
		return (
			(t.isBishop() || t.isRook() || t.isQueen()) &&
				t.directions.forEach((a) => {
					const [d, c] = a;
					let h = i + d,
						f = s + c,
						u = this.getCell([h, f]);
					for (; u && u.isEmpty(); )
						o.push({ position: u.position, type: "normal" }),
							(h += d),
							(f += c),
							(u = this.getCell([h, f]));
					u &&
						this.hasOpponentPiece(u, t) &&
						o.push({ position: u.position, type: "attack" });
				}),
			t.isKnight() &&
				t.directions.forEach((a) => {
					const [d, c] = a,
						h = i + d,
						f = s + c,
						u = this.getCell([h, f]);
					u && this.hasOpponentPiece(u, t)
						? o.push({ position: u.position, type: "attack" })
						: u &&
						  u.isEmpty() &&
						  o.push({ position: u.position, type: "normal" });
				}),
			t.isKing() &&
				t.directions.forEach((a) => {
					const [d, c] = a,
						h = i + d,
						f = s + c,
						u = this.getCell([h, f]);
					u && this.hasOpponentPiece(u, t)
						? o.push({ position: u.position, type: "attack" })
						: u &&
						  u.isEmpty() &&
						  o.push({ position: u.position, type: "normal" });
				}),
			o
		);
	}
	getCell(e) {
		const [t, i] = e;
		return this.shadowRoot.querySelector(`[row="${t}"][col="${i}"]`);
	}
	selectPiece(e) {
		const t = e.piece;
		if (String(this.turn) === t.color) {
			e.select(), this.stage.next();
			const s = this.getAllMoves(e, t);
			this.hightlightMoves(s);
		}
	}
	selectTarget(e) {
		const i = this.shadowRoot.querySelector("chess-cell.selected").piece;
		this.moveTo(i, e);
	}
	reset() {
		[...this.shadowRoot.querySelectorAll("chess-cell")].forEach((t) =>
			t.classList.remove("selected", "valid")
		);
	}
	genFakeCells(e) {
		return (e === 8 ? "87654321" : " abcdefgh ")
			.split("")
			.map((i) => `<div class="fake">${i}</div>`)
			.join("");
	}
	hasOpponentPiece(e, t) {
		return e.piece && e.piece.isOpponentOf(t);
	}
	moveTo(e, t) {
		const i = !!t.piece,
			s = this.shadowRoot.querySelector("chess-cell.selected");
		this.reset(),
			this.stage.next(),
			e.slide(s, t).then(() => {
				this.stage.next(),
					t.shadowRoot
						.querySelector("style")
						.insertAdjacentElement("afterend", e),
					this.movements.add(e, s, t),
					i && this.attackPiece(t),
					!i && this.stage.next();
			});
	}
	toFEN() {
		return (
			de(
				[...this.shadowRoot.querySelectorAll("chess-cell")]
					.map((e) => {
						var t;
						return (t = e.piece) == null ? void 0 : t.type;
					})
					.reduce((e, t) => e + (t || 1), "")
					.replace(/(\S{8})/g, "$1/")
					.replace(/(11+)/g, (e) => e.length)
			).replace(/\/$/, " ") + this.turn.toString()[0]
		);
	}
	setFromFEN(e) {
		const t = document.createElement("chess-board");
		document.querySelector(".app").appendChild(t);
		const [i, s] = de(e).split(" "),
			o = i.replaceAll("/", "").split("");
		let a = 0;
		o.forEach((d) => {
			const c = parseInt(d),
				h = !Number.isNaN(c);
			if (!h) {
				const f = [a % 8, ~~(a / 8)];
				t.addPiece(d, f);
			}
			a += h ? c : 1;
		}),
			this.turn.set(s);
	}
	attackPiece(e) {
		const [t, i] = e.shadowRoot.querySelectorAll("chess-piece"),
			s = i.toHeaven(e);
		this.pieces.kill(i),
			s.then(() => {
				this.stage.next();
			});
	}
	at(e) {
		return this.getCell(e).shadowRoot;
	}
	addPiece(e, t) {
		const i = this.at(t),
			s = document.createElement("chess-piece");
		s.setAttribute("type", e), i.appendChild(s), this.pieces.push(s);
	}
	render() {
		(this.shadowRoot.innerHTML = `
		<style>${te.styles}</style>
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
		</div>`),
			this.renderCells();
	}
}
customElements.define("chess-board", te);
function Xe(n) {
	if (n && !(typeof window > "u")) {
		var e = document.createElement("style");
		return (
			e.setAttribute("type", "text/css"),
			(e.innerHTML = n),
			document.head.appendChild(e),
			n
		);
	}
}
function P(n, e) {
	var t = n.__state.conversionName.toString(),
		i = Math.round(n.r),
		s = Math.round(n.g),
		o = Math.round(n.b),
		a = n.a,
		d = Math.round(n.h),
		c = n.s.toFixed(1),
		h = n.v.toFixed(1);
	if (e || t === "THREE_CHAR_HEX" || t === "SIX_CHAR_HEX") {
		for (var f = n.hex.toString(16); f.length < 6; ) f = "0" + f;
		return "#" + f;
	} else {
		if (t === "CSS_RGB") return "rgb(" + i + "," + s + "," + o + ")";
		if (t === "CSS_RGBA")
			return "rgba(" + i + "," + s + "," + o + "," + a + ")";
		if (t === "HEX") return "0x" + n.hex.toString(16);
		if (t === "RGB_ARRAY") return "[" + i + "," + s + "," + o + "]";
		if (t === "RGBA_ARRAY") return "[" + i + "," + s + "," + o + "," + a + "]";
		if (t === "RGB_OBJ") return "{r:" + i + ",g:" + s + ",b:" + o + "}";
		if (t === "RGBA_OBJ")
			return "{r:" + i + ",g:" + s + ",b:" + o + ",a:" + a + "}";
		if (t === "HSV_OBJ") return "{h:" + d + ",s:" + c + ",v:" + h + "}";
		if (t === "HSVA_OBJ")
			return "{h:" + d + ",s:" + c + ",v:" + h + ",a:" + a + "}";
	}
	return "unknown format";
}
var ce = Array.prototype.forEach,
	F = Array.prototype.slice,
	l = {
		BREAK: {},
		extend: function (e) {
			return (
				this.each(
					F.call(arguments, 1),
					function (t) {
						var i = this.isObject(t) ? Object.keys(t) : [];
						i.forEach(
							function (s) {
								this.isUndefined(t[s]) || (e[s] = t[s]);
							}.bind(this)
						);
					},
					this
				),
				e
			);
		},
		defaults: function (e) {
			return (
				this.each(
					F.call(arguments, 1),
					function (t) {
						var i = this.isObject(t) ? Object.keys(t) : [];
						i.forEach(
							function (s) {
								this.isUndefined(e[s]) && (e[s] = t[s]);
							}.bind(this)
						);
					},
					this
				),
				e
			);
		},
		compose: function () {
			var e = F.call(arguments);
			return function () {
				for (var t = F.call(arguments), i = e.length - 1; i >= 0; i--)
					t = [e[i].apply(this, t)];
				return t[0];
			};
		},
		each: function (e, t, i) {
			if (e) {
				if (ce && e.forEach && e.forEach === ce) e.forEach(t, i);
				else if (e.length === e.length + 0) {
					var s = void 0,
						o = void 0;
					for (s = 0, o = e.length; s < o; s++)
						if (s in e && t.call(i, e[s], s) === this.BREAK) return;
				} else for (var a in e) if (t.call(i, e[a], a) === this.BREAK) return;
			}
		},
		defer: function (e) {
			setTimeout(e, 0);
		},
		debounce: function (e, t, i) {
			var s = void 0;
			return function () {
				var o = this,
					a = arguments;
				function d() {
					(s = null), i || e.apply(o, a);
				}
				var c = i || !s;
				clearTimeout(s), (s = setTimeout(d, t)), c && e.apply(o, a);
			};
		},
		toArray: function (e) {
			return e.toArray ? e.toArray() : F.call(e);
		},
		isUndefined: function (e) {
			return e === void 0;
		},
		isNull: function (e) {
			return e === null;
		},
		isNaN: (function (n) {
			function e(t) {
				return n.apply(this, arguments);
			}
			return (
				(e.toString = function () {
					return n.toString();
				}),
				e
			);
		})(function (n) {
			return isNaN(n);
		}),
		isArray:
			Array.isArray ||
			function (n) {
				return n.constructor === Array;
			},
		isObject: function (e) {
			return e === Object(e);
		},
		isNumber: function (e) {
			return e === e + 0;
		},
		isString: function (e) {
			return e === e + "";
		},
		isBoolean: function (e) {
			return e === !1 || e === !0;
		},
		isFunction: function (e) {
			return e instanceof Function;
		},
	},
	je = [
		{
			litmus: l.isString,
			conversions: {
				THREE_CHAR_HEX: {
					read: function (e) {
						var t = e.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
						return t === null
							? !1
							: {
									space: "HEX",
									hex: parseInt(
										"0x" +
											t[1].toString() +
											t[1].toString() +
											t[2].toString() +
											t[2].toString() +
											t[3].toString() +
											t[3].toString(),
										0
									),
							  };
					},
					write: P,
				},
				SIX_CHAR_HEX: {
					read: function (e) {
						var t = e.match(/^#([A-F0-9]{6})$/i);
						return t === null
							? !1
							: { space: "HEX", hex: parseInt("0x" + t[1].toString(), 0) };
					},
					write: P,
				},
				CSS_RGB: {
					read: function (e) {
						var t = e.match(/^rgb\(\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*\)/);
						return t === null
							? !1
							: {
									space: "RGB",
									r: parseFloat(t[1]),
									g: parseFloat(t[2]),
									b: parseFloat(t[3]),
							  };
					},
					write: P,
				},
				CSS_RGBA: {
					read: function (e) {
						var t = e.match(
							/^rgba\(\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*\)/
						);
						return t === null
							? !1
							: {
									space: "RGB",
									r: parseFloat(t[1]),
									g: parseFloat(t[2]),
									b: parseFloat(t[3]),
									a: parseFloat(t[4]),
							  };
					},
					write: P,
				},
			},
		},
		{
			litmus: l.isNumber,
			conversions: {
				HEX: {
					read: function (e) {
						return { space: "HEX", hex: e, conversionName: "HEX" };
					},
					write: function (e) {
						return e.hex;
					},
				},
			},
		},
		{
			litmus: l.isArray,
			conversions: {
				RGB_ARRAY: {
					read: function (e) {
						return e.length !== 3
							? !1
							: { space: "RGB", r: e[0], g: e[1], b: e[2] };
					},
					write: function (e) {
						return [e.r, e.g, e.b];
					},
				},
				RGBA_ARRAY: {
					read: function (e) {
						return e.length !== 4
							? !1
							: { space: "RGB", r: e[0], g: e[1], b: e[2], a: e[3] };
					},
					write: function (e) {
						return [e.r, e.g, e.b, e.a];
					},
				},
			},
		},
		{
			litmus: l.isObject,
			conversions: {
				RGBA_OBJ: {
					read: function (e) {
						return l.isNumber(e.r) &&
							l.isNumber(e.g) &&
							l.isNumber(e.b) &&
							l.isNumber(e.a)
							? { space: "RGB", r: e.r, g: e.g, b: e.b, a: e.a }
							: !1;
					},
					write: function (e) {
						return { r: e.r, g: e.g, b: e.b, a: e.a };
					},
				},
				RGB_OBJ: {
					read: function (e) {
						return l.isNumber(e.r) && l.isNumber(e.g) && l.isNumber(e.b)
							? { space: "RGB", r: e.r, g: e.g, b: e.b }
							: !1;
					},
					write: function (e) {
						return { r: e.r, g: e.g, b: e.b };
					},
				},
				HSVA_OBJ: {
					read: function (e) {
						return l.isNumber(e.h) &&
							l.isNumber(e.s) &&
							l.isNumber(e.v) &&
							l.isNumber(e.a)
							? { space: "HSV", h: e.h, s: e.s, v: e.v, a: e.a }
							: !1;
					},
					write: function (e) {
						return { h: e.h, s: e.s, v: e.v, a: e.a };
					},
				},
				HSV_OBJ: {
					read: function (e) {
						return l.isNumber(e.h) && l.isNumber(e.s) && l.isNumber(e.v)
							? { space: "HSV", h: e.h, s: e.s, v: e.v }
							: !1;
					},
					write: function (e) {
						return { h: e.h, s: e.s, v: e.v };
					},
				},
			},
		},
	],
	H = void 0,
	I = void 0,
	Y = function () {
		I = !1;
		var e = arguments.length > 1 ? l.toArray(arguments) : arguments[0];
		return (
			l.each(je, function (t) {
				if (t.litmus(e))
					return (
						l.each(t.conversions, function (i, s) {
							if (((H = i.read(e)), I === !1 && H !== !1))
								return (
									(I = H), (H.conversionName = s), (H.conversion = i), l.BREAK
								);
						}),
						l.BREAK
					);
			}),
			I
		);
	},
	ue = void 0,
	U = {
		hsv_to_rgb: function (e, t, i) {
			var s = Math.floor(e / 60) % 6,
				o = e / 60 - Math.floor(e / 60),
				a = i * (1 - t),
				d = i * (1 - o * t),
				c = i * (1 - (1 - o) * t),
				h = [
					[i, c, a],
					[d, i, a],
					[a, i, c],
					[a, d, i],
					[c, a, i],
					[i, a, d],
				][s];
			return { r: h[0] * 255, g: h[1] * 255, b: h[2] * 255 };
		},
		rgb_to_hsv: function (e, t, i) {
			var s = Math.min(e, t, i),
				o = Math.max(e, t, i),
				a = o - s,
				d = void 0,
				c = void 0;
			if (o !== 0) c = a / o;
			else return { h: NaN, s: 0, v: 0 };
			return (
				e === o
					? (d = (t - i) / a)
					: t === o
					? (d = 2 + (i - e) / a)
					: (d = 4 + (e - t) / a),
				(d /= 6),
				d < 0 && (d += 1),
				{ h: d * 360, s: c, v: o / 255 }
			);
		},
		rgb_to_hex: function (e, t, i) {
			var s = this.hex_with_component(0, 2, e);
			return (
				(s = this.hex_with_component(s, 1, t)),
				(s = this.hex_with_component(s, 0, i)),
				s
			);
		},
		component_from_hex: function (e, t) {
			return (e >> (t * 8)) & 255;
		},
		hex_with_component: function (e, t, i) {
			return (i << (ue = t * 8)) | (e & ~(255 << ue));
		},
	},
	Ye =
		typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
			? function (n) {
					return typeof n;
			  }
			: function (n) {
					return n &&
						typeof Symbol == "function" &&
						n.constructor === Symbol &&
						n !== Symbol.prototype
						? "symbol"
						: typeof n;
			  },
	w = function (n, e) {
		if (!(n instanceof e))
			throw new TypeError("Cannot call a class as a function");
	},
	x = (function () {
		function n(e, t) {
			for (var i = 0; i < t.length; i++) {
				var s = t[i];
				(s.enumerable = s.enumerable || !1),
					(s.configurable = !0),
					"value" in s && (s.writable = !0),
					Object.defineProperty(e, s.key, s);
			}
		}
		return function (e, t, i) {
			return t && n(e.prototype, t), i && n(e, i), e;
		};
	})(),
	E = function n(e, t, i) {
		e === null && (e = Function.prototype);
		var s = Object.getOwnPropertyDescriptor(e, t);
		if (s === void 0) {
			var o = Object.getPrototypeOf(e);
			return o === null ? void 0 : n(o, t, i);
		} else {
			if ("value" in s) return s.value;
			var a = s.get;
			return a === void 0 ? void 0 : a.call(i);
		}
	},
	A = function (n, e) {
		if (typeof e != "function" && e !== null)
			throw new TypeError(
				"Super expression must either be null or a function, not " + typeof e
			);
		(n.prototype = Object.create(e && e.prototype, {
			constructor: { value: n, enumerable: !1, writable: !0, configurable: !0 },
		})),
			e &&
				(Object.setPrototypeOf
					? Object.setPrototypeOf(n, e)
					: (n.__proto__ = e));
	},
	S = function (n, e) {
		if (!n)
			throw new ReferenceError(
				"this hasn't been initialised - super() hasn't been called"
			);
		return e && (typeof e == "object" || typeof e == "function") ? e : n;
	},
	b = (function () {
		function n() {
			if (
				(w(this, n),
				(this.__state = Y.apply(this, arguments)),
				this.__state === !1)
			)
				throw new Error("Failed to interpret color arguments");
			this.__state.a = this.__state.a || 1;
		}
		return (
			x(n, [
				{
					key: "toString",
					value: function () {
						return P(this);
					},
				},
				{
					key: "toHexString",
					value: function () {
						return P(this, !0);
					},
				},
				{
					key: "toOriginal",
					value: function () {
						return this.__state.conversion.write(this);
					},
				},
			]),
			n
		);
	})();
function ne(n, e, t) {
	Object.defineProperty(n, e, {
		get: function () {
			return this.__state.space === "RGB"
				? this.__state[e]
				: (b.recalculateRGB(this, e, t), this.__state[e]);
		},
		set: function (s) {
			this.__state.space !== "RGB" &&
				(b.recalculateRGB(this, e, t), (this.__state.space = "RGB")),
				(this.__state[e] = s);
		},
	});
}
function ie(n, e) {
	Object.defineProperty(n, e, {
		get: function () {
			return this.__state.space === "HSV"
				? this.__state[e]
				: (b.recalculateHSV(this), this.__state[e]);
		},
		set: function (i) {
			this.__state.space !== "HSV" &&
				(b.recalculateHSV(this), (this.__state.space = "HSV")),
				(this.__state[e] = i);
		},
	});
}
b.recalculateRGB = function (n, e, t) {
	if (n.__state.space === "HEX")
		n.__state[e] = U.component_from_hex(n.__state.hex, t);
	else if (n.__state.space === "HSV")
		l.extend(n.__state, U.hsv_to_rgb(n.__state.h, n.__state.s, n.__state.v));
	else throw new Error("Corrupted color state");
};
b.recalculateHSV = function (n) {
	var e = U.rgb_to_hsv(n.r, n.g, n.b);
	l.extend(n.__state, { s: e.s, v: e.v }),
		l.isNaN(e.h)
			? l.isUndefined(n.__state.h) && (n.__state.h = 0)
			: (n.__state.h = e.h);
};
b.COMPONENTS = ["r", "g", "b", "h", "s", "v", "hex", "a"];
ne(b.prototype, "r", 2);
ne(b.prototype, "g", 1);
ne(b.prototype, "b", 0);
ie(b.prototype, "h");
ie(b.prototype, "s");
ie(b.prototype, "v");
Object.defineProperty(b.prototype, "a", {
	get: function () {
		return this.__state.a;
	},
	set: function (e) {
		this.__state.a = e;
	},
});
Object.defineProperty(b.prototype, "hex", {
	get: function () {
		return (
			this.__state.space !== "HEX" &&
				((this.__state.hex = U.rgb_to_hex(this.r, this.g, this.b)),
				(this.__state.space = "HEX")),
			this.__state.hex
		);
	},
	set: function (e) {
		(this.__state.space = "HEX"), (this.__state.hex = e);
	},
});
var T = (function () {
		function n(e, t) {
			w(this, n),
				(this.initialValue = e[t]),
				(this.domElement = document.createElement("div")),
				(this.object = e),
				(this.property = t),
				(this.__onChange = void 0),
				(this.__onFinishChange = void 0);
		}
		return (
			x(n, [
				{
					key: "onChange",
					value: function (t) {
						return (this.__onChange = t), this;
					},
				},
				{
					key: "onFinishChange",
					value: function (t) {
						return (this.__onFinishChange = t), this;
					},
				},
				{
					key: "setValue",
					value: function (t) {
						return (
							(this.object[this.property] = t),
							this.__onChange && this.__onChange.call(this, t),
							this.updateDisplay(),
							this
						);
					},
				},
				{
					key: "getValue",
					value: function () {
						return this.object[this.property];
					},
				},
				{
					key: "updateDisplay",
					value: function () {
						return this;
					},
				},
				{
					key: "isModified",
					value: function () {
						return this.initialValue !== this.getValue();
					},
				},
			]),
			n
		);
	})(),
	We = {
		HTMLEvents: ["change"],
		MouseEvents: ["click", "mousemove", "mousedown", "mouseup", "mouseover"],
		KeyboardEvents: ["keydown"],
	},
	we = {};
l.each(We, function (n, e) {
	l.each(n, function (t) {
		we[t] = e;
	});
});
var qe = /(\d+(\.\d+)?)px/;
function C(n) {
	if (n === "0" || l.isUndefined(n)) return 0;
	var e = n.match(qe);
	return l.isNull(e) ? 0 : parseFloat(e[1]);
}
var r = {
		makeSelectable: function (e, t) {
			e === void 0 ||
				e.style === void 0 ||
				((e.onselectstart = t
					? function () {
							return !1;
					  }
					: function () {}),
				(e.style.MozUserSelect = t ? "auto" : "none"),
				(e.style.KhtmlUserSelect = t ? "auto" : "none"),
				(e.unselectable = t ? "on" : "off"));
		},
		makeFullscreen: function (e, t, i) {
			var s = i,
				o = t;
			l.isUndefined(o) && (o = !0),
				l.isUndefined(s) && (s = !0),
				(e.style.position = "absolute"),
				o && ((e.style.left = 0), (e.style.right = 0)),
				s && ((e.style.top = 0), (e.style.bottom = 0));
		},
		fakeEvent: function (e, t, i, s) {
			var o = i || {},
				a = we[t];
			if (!a) throw new Error("Event type " + t + " not supported.");
			var d = document.createEvent(a);
			switch (a) {
				case "MouseEvents": {
					var c = o.x || o.clientX || 0,
						h = o.y || o.clientY || 0;
					d.initMouseEvent(
						t,
						o.bubbles || !1,
						o.cancelable || !0,
						window,
						o.clickCount || 1,
						0,
						0,
						c,
						h,
						!1,
						!1,
						!1,
						!1,
						0,
						null
					);
					break;
				}
				case "KeyboardEvents": {
					var f = d.initKeyboardEvent || d.initKeyEvent;
					l.defaults(o, {
						cancelable: !0,
						ctrlKey: !1,
						altKey: !1,
						shiftKey: !1,
						metaKey: !1,
						keyCode: void 0,
						charCode: void 0,
					}),
						f(
							t,
							o.bubbles || !1,
							o.cancelable,
							window,
							o.ctrlKey,
							o.altKey,
							o.shiftKey,
							o.metaKey,
							o.keyCode,
							o.charCode
						);
					break;
				}
				default: {
					d.initEvent(t, o.bubbles || !1, o.cancelable || !0);
					break;
				}
			}
			l.defaults(d, s), e.dispatchEvent(d);
		},
		bind: function (e, t, i, s) {
			var o = s || !1;
			return (
				e.addEventListener
					? e.addEventListener(t, i, o)
					: e.attachEvent && e.attachEvent("on" + t, i),
				r
			);
		},
		unbind: function (e, t, i, s) {
			var o = s || !1;
			return (
				e.removeEventListener
					? e.removeEventListener(t, i, o)
					: e.detachEvent && e.detachEvent("on" + t, i),
				r
			);
		},
		addClass: function (e, t) {
			if (e.className === void 0) e.className = t;
			else if (e.className !== t) {
				var i = e.className.split(/ +/);
				i.indexOf(t) === -1 &&
					(i.push(t),
					(e.className = i.join(" ").replace(/^\s+/, "").replace(/\s+$/, "")));
			}
			return r;
		},
		removeClass: function (e, t) {
			if (t)
				if (e.className === t) e.removeAttribute("class");
				else {
					var i = e.className.split(/ +/),
						s = i.indexOf(t);
					s !== -1 && (i.splice(s, 1), (e.className = i.join(" ")));
				}
			else e.className = void 0;
			return r;
		},
		hasClass: function (e, t) {
			return (
				new RegExp("(?:^|\\s+)" + t + "(?:\\s+|$)").test(e.className) || !1
			);
		},
		getWidth: function (e) {
			var t = getComputedStyle(e);
			return (
				C(t["border-left-width"]) +
				C(t["border-right-width"]) +
				C(t["padding-left"]) +
				C(t["padding-right"]) +
				C(t.width)
			);
		},
		getHeight: function (e) {
			var t = getComputedStyle(e);
			return (
				C(t["border-top-width"]) +
				C(t["border-bottom-width"]) +
				C(t["padding-top"]) +
				C(t["padding-bottom"]) +
				C(t.height)
			);
		},
		getOffset: function (e) {
			var t = e,
				i = { left: 0, top: 0 };
			if (t.offsetParent)
				do
					(i.left += t.offsetLeft),
						(i.top += t.offsetTop),
						(t = t.offsetParent);
				while (t);
			return i;
		},
		isActive: function (e) {
			return e === document.activeElement && (e.type || e.href);
		},
	},
	xe = (function (n) {
		A(e, n);
		function e(t, i) {
			w(this, e);
			var s = S(
					this,
					(e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i)
				),
				o = s;
			(s.__prev = s.getValue()),
				(s.__checkbox = document.createElement("input")),
				s.__checkbox.setAttribute("type", "checkbox");
			function a() {
				o.setValue(!o.__prev);
			}
			return (
				r.bind(s.__checkbox, "change", a, !1),
				s.domElement.appendChild(s.__checkbox),
				s.updateDisplay(),
				s
			);
		}
		return (
			x(e, [
				{
					key: "setValue",
					value: function (i) {
						var s = E(
							e.prototype.__proto__ || Object.getPrototypeOf(e.prototype),
							"setValue",
							this
						).call(this, i);
						return (
							this.__onFinishChange &&
								this.__onFinishChange.call(this, this.getValue()),
							(this.__prev = this.getValue()),
							s
						);
					},
				},
				{
					key: "updateDisplay",
					value: function () {
						return (
							this.getValue() === !0
								? (this.__checkbox.setAttribute("checked", "checked"),
								  (this.__checkbox.checked = !0),
								  (this.__prev = !0))
								: ((this.__checkbox.checked = !1), (this.__prev = !1)),
							E(
								e.prototype.__proto__ || Object.getPrototypeOf(e.prototype),
								"updateDisplay",
								this
							).call(this)
						);
					},
				},
			]),
			e
		);
	})(T),
	Ke = (function (n) {
		A(e, n);
		function e(t, i, s) {
			w(this, e);
			var o = S(
					this,
					(e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i)
				),
				a = s,
				d = o;
			if (((o.__select = document.createElement("select")), l.isArray(a))) {
				var c = {};
				l.each(a, function (h) {
					c[h] = h;
				}),
					(a = c);
			}
			return (
				l.each(a, function (h, f) {
					var u = document.createElement("option");
					(u.innerHTML = f),
						u.setAttribute("value", h),
						d.__select.appendChild(u);
				}),
				o.updateDisplay(),
				r.bind(o.__select, "change", function () {
					var h = this.options[this.selectedIndex].value;
					d.setValue(h);
				}),
				o.domElement.appendChild(o.__select),
				o
			);
		}
		return (
			x(e, [
				{
					key: "setValue",
					value: function (i) {
						var s = E(
							e.prototype.__proto__ || Object.getPrototypeOf(e.prototype),
							"setValue",
							this
						).call(this, i);
						return (
							this.__onFinishChange &&
								this.__onFinishChange.call(this, this.getValue()),
							s
						);
					},
				},
				{
					key: "updateDisplay",
					value: function () {
						return r.isActive(this.__select)
							? this
							: ((this.__select.value = this.getValue()),
							  E(
									e.prototype.__proto__ || Object.getPrototypeOf(e.prototype),
									"updateDisplay",
									this
							  ).call(this));
					},
				},
			]),
			e
		);
	})(T),
	Qe = (function (n) {
		A(e, n);
		function e(t, i) {
			w(this, e);
			var s = S(
					this,
					(e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i)
				),
				o = s;
			function a() {
				o.setValue(o.__input.value);
			}
			function d() {
				o.__onFinishChange && o.__onFinishChange.call(o, o.getValue());
			}
			return (
				(s.__input = document.createElement("input")),
				s.__input.setAttribute("type", "text"),
				r.bind(s.__input, "keyup", a),
				r.bind(s.__input, "change", a),
				r.bind(s.__input, "blur", d),
				r.bind(s.__input, "keydown", function (c) {
					c.keyCode === 13 && this.blur();
				}),
				s.updateDisplay(),
				s.domElement.appendChild(s.__input),
				s
			);
		}
		return (
			x(e, [
				{
					key: "updateDisplay",
					value: function () {
						return (
							r.isActive(this.__input) ||
								(this.__input.value = this.getValue()),
							E(
								e.prototype.__proto__ || Object.getPrototypeOf(e.prototype),
								"updateDisplay",
								this
							).call(this)
						);
					},
				},
			]),
			e
		);
	})(T);
function he(n) {
	var e = n.toString();
	return e.indexOf(".") > -1 ? e.length - e.indexOf(".") - 1 : 0;
}
var Ce = (function (n) {
	A(e, n);
	function e(t, i, s) {
		w(this, e);
		var o = S(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i)),
			a = s || {};
		return (
			(o.__min = a.min),
			(o.__max = a.max),
			(o.__step = a.step),
			l.isUndefined(o.__step)
				? o.initialValue === 0
					? (o.__impliedStep = 1)
					: (o.__impliedStep =
							Math.pow(
								10,
								Math.floor(Math.log(Math.abs(o.initialValue)) / Math.LN10)
							) / 10)
				: (o.__impliedStep = o.__step),
			(o.__precision = he(o.__impliedStep)),
			o
		);
	}
	return (
		x(e, [
			{
				key: "setValue",
				value: function (i) {
					var s = i;
					return (
						this.__min !== void 0 && s < this.__min
							? (s = this.__min)
							: this.__max !== void 0 && s > this.__max && (s = this.__max),
						this.__step !== void 0 &&
							s % this.__step !== 0 &&
							(s = Math.round(s / this.__step) * this.__step),
						E(
							e.prototype.__proto__ || Object.getPrototypeOf(e.prototype),
							"setValue",
							this
						).call(this, s)
					);
				},
			},
			{
				key: "min",
				value: function (i) {
					return (this.__min = i), this;
				},
			},
			{
				key: "max",
				value: function (i) {
					return (this.__max = i), this;
				},
			},
			{
				key: "step",
				value: function (i) {
					return (
						(this.__step = i),
						(this.__impliedStep = i),
						(this.__precision = he(i)),
						this
					);
				},
			},
		]),
		e
	);
})(T);
function Je(n, e) {
	var t = Math.pow(10, e);
	return Math.round(n * t) / t;
}
var G = (function (n) {
	A(e, n);
	function e(t, i, s) {
		w(this, e);
		var o = S(
			this,
			(e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i, s)
		);
		o.__truncationSuspended = !1;
		var a = o,
			d = void 0;
		function c() {
			var g = parseFloat(a.__input.value);
			l.isNaN(g) || a.setValue(g);
		}
		function h() {
			a.__onFinishChange && a.__onFinishChange.call(a, a.getValue());
		}
		function f() {
			h();
		}
		function u(g) {
			var _ = d - g.clientY;
			a.setValue(a.getValue() + _ * a.__impliedStep), (d = g.clientY);
		}
		function p() {
			r.unbind(window, "mousemove", u), r.unbind(window, "mouseup", p), h();
		}
		function y(g) {
			r.bind(window, "mousemove", u),
				r.bind(window, "mouseup", p),
				(d = g.clientY);
		}
		return (
			(o.__input = document.createElement("input")),
			o.__input.setAttribute("type", "text"),
			r.bind(o.__input, "change", c),
			r.bind(o.__input, "blur", f),
			r.bind(o.__input, "mousedown", y),
			r.bind(o.__input, "keydown", function (g) {
				g.keyCode === 13 &&
					((a.__truncationSuspended = !0),
					this.blur(),
					(a.__truncationSuspended = !1),
					h());
			}),
			o.updateDisplay(),
			o.domElement.appendChild(o.__input),
			o
		);
	}
	return (
		x(e, [
			{
				key: "updateDisplay",
				value: function () {
					return (
						(this.__input.value = this.__truncationSuspended
							? this.getValue()
							: Je(this.getValue(), this.__precision)),
						E(
							e.prototype.__proto__ || Object.getPrototypeOf(e.prototype),
							"updateDisplay",
							this
						).call(this)
					);
				},
			},
		]),
		e
	);
})(Ce);
function fe(n, e, t, i, s) {
	return i + (s - i) * ((n - e) / (t - e));
}
var W = (function (n) {
		A(e, n);
		function e(t, i, s, o, a) {
			w(this, e);
			var d = S(
					this,
					(e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i, {
						min: s,
						max: o,
						step: a,
					})
				),
				c = d;
			(d.__background = document.createElement("div")),
				(d.__foreground = document.createElement("div")),
				r.bind(d.__background, "mousedown", h),
				r.bind(d.__background, "touchstart", p),
				r.addClass(d.__background, "slider"),
				r.addClass(d.__foreground, "slider-fg");
			function h(_) {
				document.activeElement.blur(),
					r.bind(window, "mousemove", f),
					r.bind(window, "mouseup", u),
					f(_);
			}
			function f(_) {
				_.preventDefault();
				var v = c.__background.getBoundingClientRect();
				return c.setValue(fe(_.clientX, v.left, v.right, c.__min, c.__max)), !1;
			}
			function u() {
				r.unbind(window, "mousemove", f),
					r.unbind(window, "mouseup", u),
					c.__onFinishChange && c.__onFinishChange.call(c, c.getValue());
			}
			function p(_) {
				_.touches.length === 1 &&
					(r.bind(window, "touchmove", y), r.bind(window, "touchend", g), y(_));
			}
			function y(_) {
				var v = _.touches[0].clientX,
					k = c.__background.getBoundingClientRect();
				c.setValue(fe(v, k.left, k.right, c.__min, c.__max));
			}
			function g() {
				r.unbind(window, "touchmove", y),
					r.unbind(window, "touchend", g),
					c.__onFinishChange && c.__onFinishChange.call(c, c.getValue());
			}
			return (
				d.updateDisplay(),
				d.__background.appendChild(d.__foreground),
				d.domElement.appendChild(d.__background),
				d
			);
		}
		return (
			x(e, [
				{
					key: "updateDisplay",
					value: function () {
						var i = (this.getValue() - this.__min) / (this.__max - this.__min);
						return (
							(this.__foreground.style.width = i * 100 + "%"),
							E(
								e.prototype.__proto__ || Object.getPrototypeOf(e.prototype),
								"updateDisplay",
								this
							).call(this)
						);
					},
				},
			]),
			e
		);
	})(Ce),
	Ee = (function (n) {
		A(e, n);
		function e(t, i, s) {
			w(this, e);
			var o = S(
					this,
					(e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i)
				),
				a = o;
			return (
				(o.__button = document.createElement("div")),
				(o.__button.innerHTML = s === void 0 ? "Fire" : s),
				r.bind(o.__button, "click", function (d) {
					return d.preventDefault(), a.fire(), !1;
				}),
				r.addClass(o.__button, "button"),
				o.domElement.appendChild(o.__button),
				o
			);
		}
		return (
			x(e, [
				{
					key: "fire",
					value: function () {
						this.__onChange && this.__onChange.call(this),
							this.getValue().call(this.object),
							this.__onFinishChange &&
								this.__onFinishChange.call(this, this.getValue());
					},
				},
			]),
			e
		);
	})(T),
	q = (function (n) {
		A(e, n);
		function e(t, i) {
			w(this, e);
			var s = S(
				this,
				(e.__proto__ || Object.getPrototypeOf(e)).call(this, t, i)
			);
			(s.__color = new b(s.getValue())), (s.__temp = new b(0));
			var o = s;
			(s.domElement = document.createElement("div")),
				r.makeSelectable(s.domElement, !1),
				(s.__selector = document.createElement("div")),
				(s.__selector.className = "selector"),
				(s.__saturation_field = document.createElement("div")),
				(s.__saturation_field.className = "saturation-field"),
				(s.__field_knob = document.createElement("div")),
				(s.__field_knob.className = "field-knob"),
				(s.__field_knob_border = "2px solid "),
				(s.__hue_knob = document.createElement("div")),
				(s.__hue_knob.className = "hue-knob"),
				(s.__hue_field = document.createElement("div")),
				(s.__hue_field.className = "hue-field"),
				(s.__input = document.createElement("input")),
				(s.__input.type = "text"),
				(s.__input_textShadow = "0 1px 1px "),
				r.bind(s.__input, "keydown", function (_) {
					_.keyCode === 13 && u.call(this);
				}),
				r.bind(s.__input, "blur", u),
				r.bind(s.__selector, "mousedown", function () {
					r.addClass(this, "drag").bind(window, "mouseup", function () {
						r.removeClass(o.__selector, "drag");
					});
				}),
				r.bind(s.__selector, "touchstart", function () {
					r.addClass(this, "drag").bind(window, "touchend", function () {
						r.removeClass(o.__selector, "drag");
					});
				});
			var a = document.createElement("div");
			l.extend(s.__selector.style, {
				width: "122px",
				height: "102px",
				padding: "3px",
				backgroundColor: "#222",
				boxShadow: "0px 1px 3px rgba(0,0,0,0.3)",
			}),
				l.extend(s.__field_knob.style, {
					position: "absolute",
					width: "12px",
					height: "12px",
					border: s.__field_knob_border + (s.__color.v < 0.5 ? "#fff" : "#000"),
					boxShadow: "0px 1px 3px rgba(0,0,0,0.5)",
					borderRadius: "12px",
					zIndex: 1,
				}),
				l.extend(s.__hue_knob.style, {
					position: "absolute",
					width: "15px",
					height: "2px",
					borderRight: "4px solid #fff",
					zIndex: 1,
				}),
				l.extend(s.__saturation_field.style, {
					width: "100px",
					height: "100px",
					border: "1px solid #555",
					marginRight: "3px",
					display: "inline-block",
					cursor: "pointer",
				}),
				l.extend(a.style, {
					width: "100%",
					height: "100%",
					background: "none",
				}),
				_e(a, "top", "rgba(0,0,0,0)", "#000"),
				l.extend(s.__hue_field.style, {
					width: "15px",
					height: "100px",
					border: "1px solid #555",
					cursor: "ns-resize",
					position: "absolute",
					top: "3px",
					right: "3px",
				}),
				et(s.__hue_field),
				l.extend(s.__input.style, {
					outline: "none",
					textAlign: "center",
					color: "#fff",
					border: 0,
					fontWeight: "bold",
					textShadow: s.__input_textShadow + "rgba(0,0,0,0.7)",
				}),
				r.bind(s.__saturation_field, "mousedown", d),
				r.bind(s.__saturation_field, "touchstart", d),
				r.bind(s.__field_knob, "mousedown", d),
				r.bind(s.__field_knob, "touchstart", d),
				r.bind(s.__hue_field, "mousedown", c),
				r.bind(s.__hue_field, "touchstart", c);
			function d(_) {
				y(_),
					r.bind(window, "mousemove", y),
					r.bind(window, "touchmove", y),
					r.bind(window, "mouseup", h),
					r.bind(window, "touchend", h);
			}
			function c(_) {
				g(_),
					r.bind(window, "mousemove", g),
					r.bind(window, "touchmove", g),
					r.bind(window, "mouseup", f),
					r.bind(window, "touchend", f);
			}
			function h() {
				r.unbind(window, "mousemove", y),
					r.unbind(window, "touchmove", y),
					r.unbind(window, "mouseup", h),
					r.unbind(window, "touchend", h),
					p();
			}
			function f() {
				r.unbind(window, "mousemove", g),
					r.unbind(window, "touchmove", g),
					r.unbind(window, "mouseup", f),
					r.unbind(window, "touchend", f),
					p();
			}
			function u() {
				var _ = Y(this.value);
				_ !== !1
					? ((o.__color.__state = _), o.setValue(o.__color.toOriginal()))
					: (this.value = o.__color.toString());
			}
			function p() {
				o.__onFinishChange &&
					o.__onFinishChange.call(o, o.__color.toOriginal());
			}
			s.__saturation_field.appendChild(a),
				s.__selector.appendChild(s.__field_knob),
				s.__selector.appendChild(s.__saturation_field),
				s.__selector.appendChild(s.__hue_field),
				s.__hue_field.appendChild(s.__hue_knob),
				s.domElement.appendChild(s.__input),
				s.domElement.appendChild(s.__selector),
				s.updateDisplay();
			function y(_) {
				_.type.indexOf("touch") === -1 && _.preventDefault();
				var v = o.__saturation_field.getBoundingClientRect(),
					k = (_.touches && _.touches[0]) || _,
					X = k.clientX,
					O = k.clientY,
					N = (X - v.left) / (v.right - v.left),
					B = 1 - (O - v.top) / (v.bottom - v.top);
				return (
					B > 1 ? (B = 1) : B < 0 && (B = 0),
					N > 1 ? (N = 1) : N < 0 && (N = 0),
					(o.__color.v = B),
					(o.__color.s = N),
					o.setValue(o.__color.toOriginal()),
					!1
				);
			}
			function g(_) {
				_.type.indexOf("touch") === -1 && _.preventDefault();
				var v = o.__hue_field.getBoundingClientRect(),
					k = (_.touches && _.touches[0]) || _,
					X = k.clientY,
					O = 1 - (X - v.top) / (v.bottom - v.top);
				return (
					O > 1 ? (O = 1) : O < 0 && (O = 0),
					(o.__color.h = O * 360),
					o.setValue(o.__color.toOriginal()),
					!1
				);
			}
			return s;
		}
		return (
			x(e, [
				{
					key: "updateDisplay",
					value: function () {
						var i = Y(this.getValue());
						if (i !== !1) {
							var s = !1;
							l.each(
								b.COMPONENTS,
								function (d) {
									if (
										!l.isUndefined(i[d]) &&
										!l.isUndefined(this.__color.__state[d]) &&
										i[d] !== this.__color.__state[d]
									)
										return (s = !0), {};
								},
								this
							),
								s && l.extend(this.__color.__state, i);
						}
						l.extend(this.__temp.__state, this.__color.__state),
							(this.__temp.a = 1);
						var o = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0,
							a = 255 - o;
						l.extend(this.__field_knob.style, {
							marginLeft: 100 * this.__color.s - 7 + "px",
							marginTop: 100 * (1 - this.__color.v) - 7 + "px",
							backgroundColor: this.__temp.toHexString(),
							border:
								this.__field_knob_border + "rgb(" + o + "," + o + "," + o + ")",
						}),
							(this.__hue_knob.style.marginTop =
								(1 - this.__color.h / 360) * 100 + "px"),
							(this.__temp.s = 1),
							(this.__temp.v = 1),
							_e(
								this.__saturation_field,
								"left",
								"#fff",
								this.__temp.toHexString()
							),
							(this.__input.value = this.__color.toString()),
							l.extend(this.__input.style, {
								backgroundColor: this.__color.toHexString(),
								color: "rgb(" + o + "," + o + "," + o + ")",
								textShadow:
									this.__input_textShadow +
									"rgba(" +
									a +
									"," +
									a +
									"," +
									a +
									",.7)",
							});
					},
				},
			]),
			e
		);
	})(T),
	Ze = ["-moz-", "-o-", "-webkit-", "-ms-", ""];
function _e(n, e, t, i) {
	(n.style.background = ""),
		l.each(Ze, function (s) {
			n.style.cssText +=
				"background: " +
				s +
				"linear-gradient(" +
				e +
				", " +
				t +
				" 0%, " +
				i +
				" 100%); ";
		});
}
function et(n) {
	(n.style.background = ""),
		(n.style.cssText +=
			"background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);"),
		(n.style.cssText +=
			"background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"),
		(n.style.cssText +=
			"background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"),
		(n.style.cssText +=
			"background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"),
		(n.style.cssText +=
			"background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);");
}
var tt = {
		load: function (e, t) {
			var i = t || document,
				s = i.createElement("link");
			(s.type = "text/css"),
				(s.rel = "stylesheet"),
				(s.href = e),
				i.getElementsByTagName("head")[0].appendChild(s);
		},
		inject: function (e, t) {
			var i = t || document,
				s = document.createElement("style");
			(s.type = "text/css"), (s.innerHTML = e);
			var o = i.getElementsByTagName("head")[0];
			try {
				o.appendChild(s);
			} catch {}
		},
	},
	nt = `<div id="dg-save" class="dg dialogue">

  Here's the new load parameter for your <code>GUI</code>'s constructor:

  <textarea id="dg-new-constructor"></textarea>

  <div id="dg-save-locally">

    <input id="dg-local-storage" type="checkbox"/> Automatically save
    values to <code>localStorage</code> on exit.

    <div id="dg-local-explain">The values saved to <code>localStorage</code> will
      override those passed to <code>dat.GUI</code>'s constructor. This makes it
      easier to work incrementally, but <code>localStorage</code> is fragile,
      and your friends may not see the same values you do.

    </div>

  </div>

</div>`,
	it = function (e, t) {
		var i = e[t];
		return l.isArray(arguments[2]) || l.isObject(arguments[2])
			? new Ke(e, t, arguments[2])
			: l.isNumber(i)
			? l.isNumber(arguments[2]) && l.isNumber(arguments[3])
				? l.isNumber(arguments[4])
					? new W(e, t, arguments[2], arguments[3], arguments[4])
					: new W(e, t, arguments[2], arguments[3])
				: l.isNumber(arguments[4])
				? new G(e, t, {
						min: arguments[2],
						max: arguments[3],
						step: arguments[4],
				  })
				: new G(e, t, { min: arguments[2], max: arguments[3] })
			: l.isString(i)
			? new Qe(e, t)
			: l.isFunction(i)
			? new Ee(e, t, "")
			: l.isBoolean(i)
			? new xe(e, t)
			: null;
	};
function st(n) {
	setTimeout(n, 1e3 / 60);
}
var ot =
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		st,
	rt = (function () {
		function n() {
			w(this, n),
				(this.backgroundElement = document.createElement("div")),
				l.extend(this.backgroundElement.style, {
					backgroundColor: "rgba(0,0,0,0.8)",
					top: 0,
					left: 0,
					display: "none",
					zIndex: "1000",
					opacity: 0,
					WebkitTransition: "opacity 0.2s linear",
					transition: "opacity 0.2s linear",
				}),
				r.makeFullscreen(this.backgroundElement),
				(this.backgroundElement.style.position = "fixed"),
				(this.domElement = document.createElement("div")),
				l.extend(this.domElement.style, {
					position: "fixed",
					display: "none",
					zIndex: "1001",
					opacity: 0,
					WebkitTransition:
						"-webkit-transform 0.2s ease-out, opacity 0.2s linear",
					transition: "transform 0.2s ease-out, opacity 0.2s linear",
				}),
				document.body.appendChild(this.backgroundElement),
				document.body.appendChild(this.domElement);
			var e = this;
			r.bind(this.backgroundElement, "click", function () {
				e.hide();
			});
		}
		return (
			x(n, [
				{
					key: "show",
					value: function () {
						var t = this;
						(this.backgroundElement.style.display = "block"),
							(this.domElement.style.display = "block"),
							(this.domElement.style.opacity = 0),
							(this.domElement.style.webkitTransform = "scale(1.1)"),
							this.layout(),
							l.defer(function () {
								(t.backgroundElement.style.opacity = 1),
									(t.domElement.style.opacity = 1),
									(t.domElement.style.webkitTransform = "scale(1)");
							});
					},
				},
				{
					key: "hide",
					value: function () {
						var t = this,
							i = function s() {
								(t.domElement.style.display = "none"),
									(t.backgroundElement.style.display = "none"),
									r.unbind(t.domElement, "webkitTransitionEnd", s),
									r.unbind(t.domElement, "transitionend", s),
									r.unbind(t.domElement, "oTransitionEnd", s);
							};
						r.bind(this.domElement, "webkitTransitionEnd", i),
							r.bind(this.domElement, "transitionend", i),
							r.bind(this.domElement, "oTransitionEnd", i),
							(this.backgroundElement.style.opacity = 0),
							(this.domElement.style.opacity = 0),
							(this.domElement.style.webkitTransform = "scale(1.1)");
					},
				},
				{
					key: "layout",
					value: function () {
						(this.domElement.style.left =
							window.innerWidth / 2 - r.getWidth(this.domElement) / 2 + "px"),
							(this.domElement.style.top =
								window.innerHeight / 2 -
								r.getHeight(this.domElement) / 2 +
								"px");
					},
				},
			]),
			n
		);
	})(),
	at =
		Xe(`.dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .cr.function .property-name{width:100%}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}
`);
tt.inject(at);
var pe = "dg",
	me = 72,
	ge = 20,
	M = "Default",
	D = (function () {
		try {
			return !!window.localStorage;
		} catch {
			return !1;
		}
	})(),
	V = void 0,
	be = !0,
	R = void 0,
	j = !1,
	Ae = [],
	m = function n(e) {
		var t = this,
			i = e || {};
		(this.domElement = document.createElement("div")),
			(this.__ul = document.createElement("ul")),
			this.domElement.appendChild(this.__ul),
			r.addClass(this.domElement, pe),
			(this.__folders = {}),
			(this.__controllers = []),
			(this.__rememberedObjects = []),
			(this.__rememberedObjectIndecesToControllers = []),
			(this.__listening = []),
			(i = l.defaults(i, {
				closeOnTop: !1,
				autoPlace: !0,
				width: n.DEFAULT_WIDTH,
			})),
			(i = l.defaults(i, { resizable: i.autoPlace, hideable: i.autoPlace })),
			l.isUndefined(i.load)
				? (i.load = { preset: M })
				: i.preset && (i.load.preset = i.preset),
			l.isUndefined(i.parent) && i.hideable && Ae.push(this),
			(i.resizable = l.isUndefined(i.parent) && i.resizable),
			i.autoPlace && l.isUndefined(i.scrollable) && (i.scrollable = !0);
		var s = D && localStorage.getItem(L(this, "isLocal")) === "true",
			o = void 0,
			a = void 0;
		if (
			(Object.defineProperties(this, {
				parent: {
					get: function () {
						return i.parent;
					},
				},
				scrollable: {
					get: function () {
						return i.scrollable;
					},
				},
				autoPlace: {
					get: function () {
						return i.autoPlace;
					},
				},
				closeOnTop: {
					get: function () {
						return i.closeOnTop;
					},
				},
				preset: {
					get: function () {
						return t.parent ? t.getRoot().preset : i.load.preset;
					},
					set: function (p) {
						t.parent ? (t.getRoot().preset = p) : (i.load.preset = p),
							ut(this),
							t.revert();
					},
				},
				width: {
					get: function () {
						return i.width;
					},
					set: function (p) {
						(i.width = p), J(t, p);
					},
				},
				name: {
					get: function () {
						return i.name;
					},
					set: function (p) {
						(i.name = p), a && (a.innerHTML = i.name);
					},
				},
				closed: {
					get: function () {
						return i.closed;
					},
					set: function (p) {
						(i.closed = p),
							i.closed
								? r.addClass(t.__ul, n.CLASS_CLOSED)
								: r.removeClass(t.__ul, n.CLASS_CLOSED),
							this.onResize(),
							t.__closeButton &&
								(t.__closeButton.innerHTML = p ? n.TEXT_OPEN : n.TEXT_CLOSED);
					},
				},
				load: {
					get: function () {
						return i.load;
					},
				},
				useLocalStorage: {
					get: function () {
						return s;
					},
					set: function (p) {
						D &&
							((s = p),
							p ? r.bind(window, "unload", o) : r.unbind(window, "unload", o),
							localStorage.setItem(L(t, "isLocal"), p));
					},
				},
			}),
			l.isUndefined(i.parent))
		) {
			if (
				((this.closed = i.closed || !1),
				r.addClass(this.domElement, n.CLASS_MAIN),
				r.makeSelectable(this.domElement, !1),
				D && s)
			) {
				t.useLocalStorage = !0;
				var d = localStorage.getItem(L(this, "gui"));
				d && (i.load = JSON.parse(d));
			}
			(this.__closeButton = document.createElement("div")),
				(this.__closeButton.innerHTML = n.TEXT_CLOSED),
				r.addClass(this.__closeButton, n.CLASS_CLOSE_BUTTON),
				i.closeOnTop
					? (r.addClass(this.__closeButton, n.CLASS_CLOSE_TOP),
					  this.domElement.insertBefore(
							this.__closeButton,
							this.domElement.childNodes[0]
					  ))
					: (r.addClass(this.__closeButton, n.CLASS_CLOSE_BOTTOM),
					  this.domElement.appendChild(this.__closeButton)),
				r.bind(this.__closeButton, "click", function () {
					t.closed = !t.closed;
				});
		} else {
			i.closed === void 0 && (i.closed = !0);
			var c = document.createTextNode(i.name);
			r.addClass(c, "controller-name"), (a = se(t, c));
			var h = function (p) {
				return p.preventDefault(), (t.closed = !t.closed), !1;
			};
			r.addClass(this.__ul, n.CLASS_CLOSED),
				r.addClass(a, "title"),
				r.bind(a, "click", h),
				i.closed || (this.closed = !1);
		}
		i.autoPlace &&
			(l.isUndefined(i.parent) &&
				(be &&
					((R = document.createElement("div")),
					r.addClass(R, pe),
					r.addClass(R, n.CLASS_AUTO_PLACE_CONTAINER),
					document.body.appendChild(R),
					(be = !1)),
				R.appendChild(this.domElement),
				r.addClass(this.domElement, n.CLASS_AUTO_PLACE)),
			this.parent || J(t, i.width)),
			(this.__resizeHandler = function () {
				t.onResizeDebounced();
			}),
			r.bind(window, "resize", this.__resizeHandler),
			r.bind(this.__ul, "webkitTransitionEnd", this.__resizeHandler),
			r.bind(this.__ul, "transitionend", this.__resizeHandler),
			r.bind(this.__ul, "oTransitionEnd", this.__resizeHandler),
			this.onResize(),
			i.resizable && ct(this),
			(o = function () {
				D &&
					localStorage.getItem(L(t, "isLocal")) === "true" &&
					localStorage.setItem(L(t, "gui"), JSON.stringify(t.getSaveObject()));
			}),
			(this.saveToLocalStorageIfPossible = o);
		function f() {
			var u = t.getRoot();
			(u.width += 1),
				l.defer(function () {
					u.width -= 1;
				});
		}
		i.parent || f();
	};
m.toggleHide = function () {
	(j = !j),
		l.each(Ae, function (n) {
			n.domElement.style.display = j ? "none" : "";
		});
};
m.CLASS_AUTO_PLACE = "a";
m.CLASS_AUTO_PLACE_CONTAINER = "ac";
m.CLASS_MAIN = "main";
m.CLASS_CONTROLLER_ROW = "cr";
m.CLASS_TOO_TALL = "taller-than-window";
m.CLASS_CLOSED = "closed";
m.CLASS_CLOSE_BUTTON = "close-button";
m.CLASS_CLOSE_TOP = "close-top";
m.CLASS_CLOSE_BOTTOM = "close-bottom";
m.CLASS_DRAG = "drag";
m.DEFAULT_WIDTH = 245;
m.TEXT_CLOSED = "Close Controls";
m.TEXT_OPEN = "Open Controls";
m._keydownHandler = function (n) {
	document.activeElement.type !== "text" &&
		(n.which === me || n.keyCode === me) &&
		m.toggleHide();
};
r.bind(window, "keydown", m._keydownHandler, !1);
l.extend(m.prototype, {
	add: function (e, t) {
		return z(this, e, t, {
			factoryArgs: Array.prototype.slice.call(arguments, 2),
		});
	},
	addColor: function (e, t) {
		return z(this, e, t, { color: !0 });
	},
	remove: function (e) {
		this.__ul.removeChild(e.__li),
			this.__controllers.splice(this.__controllers.indexOf(e), 1);
		var t = this;
		l.defer(function () {
			t.onResize();
		});
	},
	destroy: function () {
		if (this.parent)
			throw new Error(
				"Only the root GUI should be removed with .destroy(). For subfolders, use gui.removeFolder(folder) instead."
			);
		this.autoPlace && R.removeChild(this.domElement);
		var e = this;
		l.each(this.__folders, function (t) {
			e.removeFolder(t);
		}),
			r.unbind(window, "keydown", m._keydownHandler, !1),
			ve(this);
	},
	addFolder: function (e) {
		if (this.__folders[e] !== void 0)
			throw new Error(
				'You already have a folder in this GUI by the name "' + e + '"'
			);
		var t = { name: e, parent: this };
		(t.autoPlace = this.autoPlace),
			this.load &&
				this.load.folders &&
				this.load.folders[e] &&
				((t.closed = this.load.folders[e].closed),
				(t.load = this.load.folders[e]));
		var i = new m(t);
		this.__folders[e] = i;
		var s = se(this, i.domElement);
		return r.addClass(s, "folder"), i;
	},
	removeFolder: function (e) {
		this.__ul.removeChild(e.domElement.parentElement),
			delete this.__folders[e.name],
			this.load &&
				this.load.folders &&
				this.load.folders[e.name] &&
				delete this.load.folders[e.name],
			ve(e);
		var t = this;
		l.each(e.__folders, function (i) {
			e.removeFolder(i);
		}),
			l.defer(function () {
				t.onResize();
			});
	},
	open: function () {
		this.closed = !1;
	},
	close: function () {
		this.closed = !0;
	},
	hide: function () {
		this.domElement.style.display = "none";
	},
	show: function () {
		this.domElement.style.display = "";
	},
	onResize: function () {
		var e = this.getRoot();
		if (e.scrollable) {
			var t = r.getOffset(e.__ul).top,
				i = 0;
			l.each(e.__ul.childNodes, function (s) {
				(e.autoPlace && s === e.__save_row) || (i += r.getHeight(s));
			}),
				window.innerHeight - t - ge < i
					? (r.addClass(e.domElement, m.CLASS_TOO_TALL),
					  (e.__ul.style.height = window.innerHeight - t - ge + "px"))
					: (r.removeClass(e.domElement, m.CLASS_TOO_TALL),
					  (e.__ul.style.height = "auto"));
		}
		e.__resize_handle &&
			l.defer(function () {
				e.__resize_handle.style.height = e.__ul.offsetHeight + "px";
			}),
			e.__closeButton && (e.__closeButton.style.width = e.width + "px");
	},
	onResizeDebounced: l.debounce(function () {
		this.onResize();
	}, 50),
	remember: function () {
		if (
			(l.isUndefined(V) && ((V = new rt()), (V.domElement.innerHTML = nt)),
			this.parent)
		)
			throw new Error("You can only call remember on a top level GUI.");
		var e = this;
		l.each(Array.prototype.slice.call(arguments), function (t) {
			e.__rememberedObjects.length === 0 && dt(e),
				e.__rememberedObjects.indexOf(t) === -1 &&
					e.__rememberedObjects.push(t);
		}),
			this.autoPlace && J(this, this.width);
	},
	getRoot: function () {
		for (var e = this; e.parent; ) e = e.parent;
		return e;
	},
	getSaveObject: function () {
		var e = this.load;
		return (
			(e.closed = this.closed),
			this.__rememberedObjects.length > 0 &&
				((e.preset = this.preset),
				e.remembered || (e.remembered = {}),
				(e.remembered[this.preset] = $(this))),
			(e.folders = {}),
			l.each(this.__folders, function (t, i) {
				e.folders[i] = t.getSaveObject();
			}),
			e
		);
	},
	save: function () {
		this.load.remembered || (this.load.remembered = {}),
			(this.load.remembered[this.preset] = $(this)),
			K(this, !1),
			this.saveToLocalStorageIfPossible();
	},
	saveAs: function (e) {
		this.load.remembered ||
			((this.load.remembered = {}), (this.load.remembered[M] = $(this, !0))),
			(this.load.remembered[e] = $(this)),
			(this.preset = e),
			Q(this, e, !0),
			this.saveToLocalStorageIfPossible();
	},
	revert: function (e) {
		l.each(
			this.__controllers,
			function (t) {
				this.getRoot().load.remembered
					? Se(e || this.getRoot(), t)
					: t.setValue(t.initialValue),
					t.__onFinishChange && t.__onFinishChange.call(t, t.getValue());
			},
			this
		),
			l.each(this.__folders, function (t) {
				t.revert(t);
			}),
			e || K(this.getRoot(), !1);
	},
	listen: function (e) {
		var t = this.__listening.length === 0;
		this.__listening.push(e), t && ke(this.__listening);
	},
	updateDisplay: function () {
		l.each(this.__controllers, function (e) {
			e.updateDisplay();
		}),
			l.each(this.__folders, function (e) {
				e.updateDisplay();
			});
	},
});
function se(n, e, t) {
	var i = document.createElement("li");
	return (
		e && i.appendChild(e),
		t ? n.__ul.insertBefore(i, t) : n.__ul.appendChild(i),
		n.onResize(),
		i
	);
}
function ve(n) {
	r.unbind(window, "resize", n.__resizeHandler),
		n.saveToLocalStorageIfPossible &&
			r.unbind(window, "unload", n.saveToLocalStorageIfPossible);
}
function K(n, e) {
	var t = n.__preset_select[n.__preset_select.selectedIndex];
	e ? (t.innerHTML = t.value + "*") : (t.innerHTML = t.value);
}
function lt(n, e, t) {
	if (
		((t.__li = e),
		(t.__gui = n),
		l.extend(t, {
			options: function (a) {
				if (arguments.length > 1) {
					var d = t.__li.nextElementSibling;
					return (
						t.remove(),
						z(n, t.object, t.property, {
							before: d,
							factoryArgs: [l.toArray(arguments)],
						})
					);
				}
				if (l.isArray(a) || l.isObject(a)) {
					var c = t.__li.nextElementSibling;
					return (
						t.remove(),
						z(n, t.object, t.property, { before: c, factoryArgs: [a] })
					);
				}
			},
			name: function (a) {
				return (t.__li.firstElementChild.firstElementChild.innerHTML = a), t;
			},
			listen: function () {
				return t.__gui.listen(t), t;
			},
			remove: function () {
				return t.__gui.remove(t), t;
			},
		}),
		t instanceof W)
	) {
		var i = new G(t.object, t.property, {
			min: t.__min,
			max: t.__max,
			step: t.__step,
		});
		l.each(
			["updateDisplay", "onChange", "onFinishChange", "step", "min", "max"],
			function (o) {
				var a = t[o],
					d = i[o];
				t[o] = i[o] = function () {
					var c = Array.prototype.slice.call(arguments);
					return d.apply(i, c), a.apply(t, c);
				};
			}
		),
			r.addClass(e, "has-slider"),
			t.domElement.insertBefore(i.domElement, t.domElement.firstElementChild);
	} else if (t instanceof G) {
		var s = function (a) {
			if (l.isNumber(t.__min) && l.isNumber(t.__max)) {
				var d = t.__li.firstElementChild.firstElementChild.innerHTML,
					c = t.__gui.__listening.indexOf(t) > -1;
				t.remove();
				var h = z(n, t.object, t.property, {
					before: t.__li.nextElementSibling,
					factoryArgs: [t.__min, t.__max, t.__step],
				});
				return h.name(d), c && h.listen(), h;
			}
			return a;
		};
		(t.min = l.compose(s, t.min)), (t.max = l.compose(s, t.max));
	} else
		t instanceof xe
			? (r.bind(e, "click", function () {
					r.fakeEvent(t.__checkbox, "click");
			  }),
			  r.bind(t.__checkbox, "click", function (o) {
					o.stopPropagation();
			  }))
			: t instanceof Ee
			? (r.bind(e, "click", function () {
					r.fakeEvent(t.__button, "click");
			  }),
			  r.bind(e, "mouseover", function () {
					r.addClass(t.__button, "hover");
			  }),
			  r.bind(e, "mouseout", function () {
					r.removeClass(t.__button, "hover");
			  }))
			: t instanceof q &&
			  (r.addClass(e, "color"),
			  (t.updateDisplay = l.compose(function (o) {
					return (e.style.borderLeftColor = t.__color.toString()), o;
			  }, t.updateDisplay)),
			  t.updateDisplay());
	t.setValue = l.compose(function (o) {
		return (
			n.getRoot().__preset_select && t.isModified() && K(n.getRoot(), !0), o
		);
	}, t.setValue);
}
function Se(n, e) {
	var t = n.getRoot(),
		i = t.__rememberedObjects.indexOf(e.object);
	if (i !== -1) {
		var s = t.__rememberedObjectIndecesToControllers[i];
		if (
			(s === void 0 &&
				((s = {}), (t.__rememberedObjectIndecesToControllers[i] = s)),
			(s[e.property] = e),
			t.load && t.load.remembered)
		) {
			var o = t.load.remembered,
				a = void 0;
			if (o[n.preset]) a = o[n.preset];
			else if (o[M]) a = o[M];
			else return;
			if (a[i] && a[i][e.property] !== void 0) {
				var d = a[i][e.property];
				(e.initialValue = d), e.setValue(d);
			}
		}
	}
}
function z(n, e, t, i) {
	if (e[t] === void 0)
		throw new Error('Object "' + e + '" has no property "' + t + '"');
	var s = void 0;
	if (i.color) s = new q(e, t);
	else {
		var o = [e, t].concat(i.factoryArgs);
		s = it.apply(n, o);
	}
	i.before instanceof T && (i.before = i.before.__li),
		Se(n, s),
		r.addClass(s.domElement, "c");
	var a = document.createElement("span");
	r.addClass(a, "property-name"), (a.innerHTML = s.property);
	var d = document.createElement("div");
	d.appendChild(a), d.appendChild(s.domElement);
	var c = se(n, d, i.before);
	return (
		r.addClass(c, m.CLASS_CONTROLLER_ROW),
		s instanceof q ? r.addClass(c, "color") : r.addClass(c, Ye(s.getValue())),
		lt(n, c, s),
		n.__controllers.push(s),
		s
	);
}
function L(n, e) {
	return document.location.href + "." + e;
}
function Q(n, e, t) {
	var i = document.createElement("option");
	(i.innerHTML = e),
		(i.value = e),
		n.__preset_select.appendChild(i),
		t && (n.__preset_select.selectedIndex = n.__preset_select.length - 1);
}
function ye(n, e) {
	e.style.display = n.useLocalStorage ? "block" : "none";
}
function dt(n) {
	var e = (n.__save_row = document.createElement("li"));
	r.addClass(n.domElement, "has-save"),
		n.__ul.insertBefore(e, n.__ul.firstChild),
		r.addClass(e, "save-row");
	var t = document.createElement("span");
	(t.innerHTML = "&nbsp;"), r.addClass(t, "button gears");
	var i = document.createElement("span");
	(i.innerHTML = "Save"), r.addClass(i, "button"), r.addClass(i, "save");
	var s = document.createElement("span");
	(s.innerHTML = "New"), r.addClass(s, "button"), r.addClass(s, "save-as");
	var o = document.createElement("span");
	(o.innerHTML = "Revert"), r.addClass(o, "button"), r.addClass(o, "revert");
	var a = (n.__preset_select = document.createElement("select"));
	if (
		(n.load && n.load.remembered
			? l.each(n.load.remembered, function (u, p) {
					Q(n, p, p === n.preset);
			  })
			: Q(n, M, !1),
		r.bind(a, "change", function () {
			for (var u = 0; u < n.__preset_select.length; u++)
				n.__preset_select[u].innerHTML = n.__preset_select[u].value;
			n.preset = this.value;
		}),
		e.appendChild(a),
		e.appendChild(t),
		e.appendChild(i),
		e.appendChild(s),
		e.appendChild(o),
		D)
	) {
		var d = document.getElementById("dg-local-explain"),
			c = document.getElementById("dg-local-storage"),
			h = document.getElementById("dg-save-locally");
		(h.style.display = "block"),
			localStorage.getItem(L(n, "isLocal")) === "true" &&
				c.setAttribute("checked", "checked"),
			ye(n, d),
			r.bind(c, "change", function () {
				(n.useLocalStorage = !n.useLocalStorage), ye(n, d);
			});
	}
	var f = document.getElementById("dg-new-constructor");
	r.bind(f, "keydown", function (u) {
		u.metaKey && (u.which === 67 || u.keyCode === 67) && V.hide();
	}),
		r.bind(t, "click", function () {
			(f.innerHTML = JSON.stringify(n.getSaveObject(), void 0, 2)),
				V.show(),
				f.focus(),
				f.select();
		}),
		r.bind(i, "click", function () {
			n.save();
		}),
		r.bind(s, "click", function () {
			var u = prompt("Enter a new preset name.");
			u && n.saveAs(u);
		}),
		r.bind(o, "click", function () {
			n.revert();
		});
}
function ct(n) {
	var e = void 0;
	(n.__resize_handle = document.createElement("div")),
		l.extend(n.__resize_handle.style, {
			width: "6px",
			marginLeft: "-3px",
			height: "200px",
			cursor: "ew-resize",
			position: "absolute",
		});
	function t(o) {
		return (
			o.preventDefault(),
			(n.width += e - o.clientX),
			n.onResize(),
			(e = o.clientX),
			!1
		);
	}
	function i() {
		r.removeClass(n.__closeButton, m.CLASS_DRAG),
			r.unbind(window, "mousemove", t),
			r.unbind(window, "mouseup", i);
	}
	function s(o) {
		return (
			o.preventDefault(),
			(e = o.clientX),
			r.addClass(n.__closeButton, m.CLASS_DRAG),
			r.bind(window, "mousemove", t),
			r.bind(window, "mouseup", i),
			!1
		);
	}
	r.bind(n.__resize_handle, "mousedown", s),
		r.bind(n.__closeButton, "mousedown", s),
		n.domElement.insertBefore(
			n.__resize_handle,
			n.domElement.firstElementChild
		);
}
function J(n, e) {
	(n.domElement.style.width = e + "px"),
		n.__save_row && n.autoPlace && (n.__save_row.style.width = e + "px"),
		n.__closeButton && (n.__closeButton.style.width = e + "px");
}
function $(n, e) {
	var t = {};
	return (
		l.each(n.__rememberedObjects, function (i, s) {
			var o = {},
				a = n.__rememberedObjectIndecesToControllers[s];
			l.each(a, function (d, c) {
				o[c] = e ? d.initialValue : d.getValue();
			}),
				(t[s] = o);
		}),
		t
	);
}
function ut(n) {
	for (var e = 0; e < n.__preset_select.length; e++)
		n.__preset_select[e].value === n.preset &&
			(n.__preset_select.selectedIndex = e);
}
function ke(n) {
	n.length !== 0 &&
		ot.call(window, function () {
			ke(n);
		}),
		l.each(n, function (e) {
			e.updateDisplay();
		});
}
var ht = m;
const Oe = document.createElement("chess-board");
Oe.setFromFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w");
const oe = new ht(),
	Te = { pieces: "normal", theme: "wood" };
oe.add(Te, "pieces", ["normal", "chess"]).onChange((n) => Oe.changePieces(n));
oe.add(Te, "theme", ["wood", "black"]).onChange((n) => {
	const e = document.querySelector("chess-board");
	e.classList.remove("wood", "black"), e.classList.add(n);
});
oe.close();
