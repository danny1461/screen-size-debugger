(function() {

	let defaultFrameworks = {
		'bootstrap': {
			width: ['XL', 1200, 'LG', 992, 'MD', 768, 'SM', 0]
		}
	};

	class ScreenSizeDebugger {
		constructor(opts) {
			this.id = ScreenSizeDebugger.id++;
			this.opts = Object.assign({
				attach: true,
				framework: 'bootstrap',
				style: {}
			}, opts || {});

			if (typeof this.opts.framework == 'string') {
				this.opts.framework = defaultFrameworks[this.opts.framework];
			}

			if (!Object.keys(this.opts.style).filter(v => ['left', 'right', 'top', 'bottom'].indexOf(v) >= 0).length) {
				Object.assign(this.opts.style, {
					right: 0,
					bottom: 0
				});

				if (!this.opts.style.position) {
					this.opts.style.position = 'fixed';
				}
			}

			this._initListeners();
			this._createStyles();
			this._createEls();
			this.resize();

			if (this.opts.attach) {
				let DOMReady = () => {
					document.body.appendChild(this.el);
					if (!this.styleEl.parentNode) {
						document.head.appendChild(this.styleEl);
					}
				};

				if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
					DOMReady();
				}
				else {
					document.addEventListener('DOMContentLoaded', DOMReady);
				}
			}
		}

		_initListeners() {
			let e = window, a = 'inner';
			if (!('innerWidth' in window )) {
				a = 'client';
				e = document.documentElement || document.body;
			}

			this.width = e[ a+'Width' ];
			this.height = e[ a+'Height' ];

			window.addEventListener('resize', () => {
				this.width = e[ a+'Width' ];
				this.height = e[ a+'Height' ];
				this.resize();
			});
		}

		_createStyles() {
			document.querySelectorAll('style').forEach((style) => {
				if (style._screenSizeDebugger) {
					this.styleEl = style;
				}
			});

			if (!this.styleEl) {
				let styleEl = document.createElement('style');
				styleEl._screenSizeDebugger = true;

				styleEl.innerHTML = `
.screen-size-debugger {
	background-color: #000;
	color: #ffffff;
	padding: 2px 4px;
	font-size: .6rem;
	text-align: center;
}

.screen-size-debugger div {
	display: none;
	color: #ffff00;
}

.screen-size-debugger:hover div {
	display: block;
}
				`.trim();

				this.styleEl = styleEl;
			}
		}

		_createEls() {
			let el = document.createElement('div');
			el.className = 'screen-size-debugger';
			el.setAttribute('data-id', this.id);
			
			let style = '';
			for (let i in this.opts.style) {
				style += `${i}: ${this.opts.style[i]};`;
			}
			el.style = style;

			this.el = el;
		}

		resize() {
			['width', 'height'].forEach((size) => {
				if (!this.opts.framework[size]) {
					return;
				}

				for (let i = 0; i < this.opts.framework[size].length; i += 2) {
					if (this[size] >= this.opts.framework[size][i + 1]) {
						this[`framework_${size}`] = this.opts.framework[size][i];
						break;
					}
				}
			});

			let str = [this.framework_width, this.framework_height].filter(v => v).join(' x '),
				alwaysVisibleStyle = this.opts.alwaysVisible ? ' style="display:block;"' : '';

			this.el.innerHTML = `${str}<div${alwaysVisibleStyle}>${this.width} x ${this.height}</div>`;
		}
	}

	ScreenSizeDebugger.id = 1;

	// Who initialized us
	document.querySelectorAll('script').forEach((script) => {
		if (!script.src || script._handled) {
			return;
		}

		let match = script.src.match(/[\/\\]screen-size-debugger(?:\.min)?\.js$/);
		if (match) {
			let options = {};

			for (let j = 0; j < script.attributes.length; j++) {
				let attr = script.attributes[j];
				if (attr.name.indexOf('data-') === 0) {
					let name = attr.name.substr(5);

					if (name.indexOf('style-') === 0) {
						options.style = options.style || {};
						name = name.substr(6);
						options.style[name] = attr.value;
					}
					else {
						name = name.replace(/-[a-z]/g, (m) => {
							return m[1].toUpperCase();
						});

						options[name] = attr.value;
						try {
							options[name] = eval(options[name]);
						}
						catch (error) {}
					}
				}
			}

			let inst = new ScreenSizeDebugger(options),
				key = inst.id > 1 ? inst.id : '';

			ScreenSizeDebugger[`default${key}`] = inst;
			script._handled = true;
		}
	});

	window.ScreenSizeDebugger = ScreenSizeDebugger;

})();