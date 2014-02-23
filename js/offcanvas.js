/* Copyright (c) 2014 Extesla Digital, LLC.
 *
 * Licensed under the MIT License (http://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any
 * person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the
 * Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice
 * shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
 * KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function($) {

	'use strict';

	/* (non-JSDoc)
	 * The transition class prefix. All CSS transitions are defined with a
	 * "transition-" prefix, the transition relating to the value configured
	 * on the offcanvas object, e.g. "push", "reveal", "slide", etc.
	 */
	var TRANSITION_CLASS_PREFIX = 'transition-',
		OFFCANVAS_PUSH_CLASS    = '';

	/**
	 * Constructor and offcanvas plugin "class" definition.
	 * 
	 * The Offcanvas plugin adds support for offcanvas content and the display
	 * of that content using various different transitions, such as pushing,
	 * revealing, sliding, and 3D animations.
	 *
	 * @author Sean.Quinn
	 * @since 1.0
	 */
	var Offcanvas = function(element, options)
	{
		var _self = this;

		this.$element      = $(element);
		this.options       = $.extend({}, Offcanvas.DEFAULTS, options);
		this.parent        = this.options.parent ? $(this.options.parent) : this.$element.parent();
		this.transition    = null;
		this.transitioning = null;

		// ** Initialize the plugin.
		this._initialize();

		// ** Decorate classes
		if (this.transition === null) {
			this.setTransition(this.options.transition);
		}

		$(document).on('click', function(/*DOMEvent*/ e) {
			e.preventDefault();
			var $target = $(e.target);
			if ($target.closest(_self.$element).length === 0) {
				console.log('Outside of body');
				//_self.hide(e);
			}
		});

		// **
		// On a newly created Offcanvas object, with "toggle: true", we should
		// immediately toggle the plugin. [SWQ]
		if (this.options.toggle) {
			this.toggle();
		}
	};
	
	/**
	 *
	 */
	Offcanvas.prototype._initialize = function()
	{
		if (!this.options.content) {
			throw 'Offcanvas must specify a content target via the `content` query property or `data-content` query attribute. No target found.';
		}
		this.$content = $(this.options.content);
	}

	/* (non-JSDoc)
	 * Default properties which are applied to the Offcanvas plugin.
	 */
	Offcanvas.DEFAULTS = {
		transition: 'push' // SUPPORTED: push, reveal
		,toggle: true
	};

	/**
	 *
	 */
	Offcanvas.prototype.dimension = function () {
		var hasWidth = this.$element.hasClass('width')
		return hasWidth ? 'width' : 'height'
	  }

	/**
	 * Closes the Offcanvas element, by hiding it.
	 * 
	 * @return undefined
	 */
	Offcanvas.prototype.hide = function(/*DOMEvent*/ e) {
		if (this.transitioning || !this.parent.hasClass('offcanvas-active')) {
			return;
		}

		var _self      = this,
			startEvent = $.Event('hide.at.offcanvas'),
			complete   = function() {
				this.transitioning = 0;
				this.parent
					.removeClass('offcanvas-close')
					.removeClass('transitioning');
				this.$element.trigger('hidden.at.offcanvas');
			};

		this.$element.trigger(startEvent);
		if (startEvent.isDefaultPrevented()) {
			return;
		}

		this.parent
			.addClass('offcanvas-close')
			.addClass('transitioning');
		this.transitioning = 1;
		setTimeout(function() {
			_self.parent.removeClass('offcanvas-active');
			return complete.call(_self);
		}, 350);
		/*
		this.parent.removeClass('offcanvas-active');
		
		if (!$.support.transition) {
			return complete.call(this);
		}

		this.$element
			.one($.support.transition.end, $.proxy(complete, this))
			.emulateTransitionEnd(350);
		*/
	};

	/**
	 * 
	 */
	Offcanvas.prototype.show = function(/*DOMEvent*/ e) {
		if (this.transitioning || this.parent.hasClass('offcanvas-active')) {
			return;
		}

		var _self      = this,
			startEvent = $.Event('show.at.offcanvas'),
			complete   = function() {
				this.parent
					.removeClass('offcanvas-open')
					.removeClass('transitioning');
				this.transitioning = 0;
				this.$element.trigger('shown.at.offcanvas');
			};

		this.$element.trigger(startEvent);
		if (startEvent.isDefaultPrevented()) {
			return;
		}

		this.parent
			.addClass('offcanvas-open')
			.addClass('transitioning');
		this.transitioning = 1;
		setTimeout(function() {
			_self.parent.addClass('offcanvas-active');
			return complete.call(_self);
		}, 350);

		/*
		if (!$.support.transition) {
			return complete.call(this);
		}

		this.$element
			.one($.support.transition.end, $.proxy(complete, this))
			.emulateTransitionEnd(350);
		*/
	};

	/**
	 * Toggles the offcanvas open-or-closed, depending on the current state of
	 * the offcanvas element.
	 */
	Offcanvas.prototype.toggle = function(/*DOMEvent*/ e) {
		this[this.parent.hasClass('offcanvas-active') ? 'hide' : 'show']();
	};

	/**
	 * Toggles the offcanvas open-or-closed, depending on the current state of
	 * the offcanvas element.
	 */
	Offcanvas.prototype.setTransition = function(/*string*/ transition) {
		if (transition) {
			var transitionClass = TRANSITION_CLASS_PREFIX + transition;
			if (this.transition !== transitionClass) {
				if (this.transition !== null) {
					console.info('Offcanvas: Removing transition class: ', this.transition, ' from parent: ', this.parent);
					this.parent.removeClass(this.transition);
				}
				console.info('Offcanvas: Setting transition class: ', transitionClass, ' on parent: ', this.parent);
				this.transition = transitionClass;
				this.parent.addClass(this.transition);
			}
		}
	};

	// OFFCANVAS PLUGIN DEFINITION
	// ===========================
	var old = $.fn.offcanvas;
	$.fn.offcanvas = function(option) {
		return this.each(function() {
			var $this   = $(this),
				data    = $this.data('at.offcanvas'),
				options = $.extend({}, Offcanvas.DEFAULTS, $this.data(), (typeof option === 'object') && option);

			// **
			// If an Offcanvas object has not yet been created, but the only
			// value passed into the offcanvas() method was 'show', we
			// negate the option. [SWQ]
			if (!data && options.toggle && option === 'show') {
				option = !option;
			}

			// **
			// If the Offcanvas data-model has not yet been instantiated,
			// instatiate it with the options. [SWQ]
			if (!data) {
				$this.data('at.offcanvas', (data = new Offcanvas(this, options)));
			}

			// **
			// We can trigger certain default actions, or set state, on the
			// offcanvas data model. [SWQ]
			//
			// e.g.
			// if (func === 'toggle') {
			//   data.toggle();
			// }
			if (option && typeof(option) === 'string'
					&& data[option] && typeof(data[option]) === 'function') {
				data[option]();
			}
		});
	};
	$.fn.offcanvas.Constructor = Offcanvas;

	// OFFCANVAS NO CONFLICT
	// =====================
	$.fn.offcanvas.noConflict = function() {
		$.fn.offcanvas = old;
		return this;
	};
	
	// OFFCANVAS DATA-API
	// ==================
	$(document).on('click.at.offcanvas.data-api', '[data-toggle="offcanvas"]', function (e) {
		e.preventDefault();
		var $this       = $(this), href
			,target     = $this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7
			,$target    = $(target)
			,parent     = $this.attr('data-parent')
			,$parent    = parent && $(parent)
			,data       = $target.data('at.offcanvas')
			,options    = data ? 'toggle' : $this.data()
			,transition = $this.attr('data-transition');

		// **
		// If we're in the process of transitioning...
		if (!data || !data.transitioning) {
			if ($parent) {
				$parent.find('[data-toggle="offcanvas"][data-parent="' + parent + '"]').not($this).addClass('opened');
			}
			$this[$target.hasClass('open') ? 'addClass' : 'removeClass']('open');
		}

		// **
		// If a different transition was passed in, we should update the
		// transition class on the target offcanvas object.
		if (data && transition) {
			data.setTransition(transition);
		}
		$target.offcanvas(options);
	});
}(jQuery));
