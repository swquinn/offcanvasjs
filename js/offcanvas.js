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
		this.$element  = $(element);
		this.options   = $.extend({}, Offcanvas.DEFAULTS, options);
		this.state     = null;
		this.placement = null;

		if (this.options.autohide && !this.options.modal) {
			$(document).on('click', $.proxy(this.autohide, this));
		}

		// **
		// On a newly created Offcanvas object, with "toggle: true", we should
		// immediately toggle the plugin. [SWQ]
		if (this.options.toggle) {
			this.toggle();
		}
	};

	/* (non-JSDoc)
	 * Default properties which are applied to the Offcanvas plugin if not
	 * explicitly overridden.
	 */
	Offcanvas.DEFAULTS = {
		autohide: true
		,placement: "auto"
		,transition: 'push' // SUPPORTED: push, reveal
		,toggle: true
	};

	/**
	 * Returns a set containing the canvas and all fixed elements.
	 *
	 * @return array
	 */
	Offcanvas.prototype.elements = function()
	{
		var canvas = this.options.canvas ? $(this.options.canvas) : this.$element,
			fixedElements = canvas.find('*').filter(function() {
				return $(this).css('position') === 'fixed'
			}).not(this.options.exclude);
		return canvas.add(fixedElements)
	},

	/**
	 * Handles the offset from the edge which the offcanvas element is
	 * positioned at.
	 *
	 * @return number the offset value.
	 */
	Offcanvas.prototype.offset = function()
	{
		if (this.placement === 'left' || this.placement === 'right') {
			return this.$element.outerWidth();
		}
		return this.$element.outerHeight();
	},

	/**
	 * Returns the opposing location from the passed <tt>placement</tt>
	 *
	 * @return string the opposing location to the passed placement.
	 */
	Offcanvas.prototype.opposite = function(placement)
	{
		if (placement === 'top') return 'bottom';
		if (placement === 'right') return 'left';
		if (placement === 'bottom') return 'top';
		if (placement === 'left') return 'right';
		return 'auto';
	},

	/**
	 * Updates and returns the placement of the offcanvas element on the screen.
	 * If the placement is explicitly declared as <tt>left</tt>, <tt>right</tt>,
	 * <tt>top</tt>, or <tt>bottom</tt> that placement is used, otherwise the
	 * widget will calculate the best place to attach the offcanvas element.
	 *
	 * @return string the placement.
	 */
	Offcanvas.prototype.place = function()
	{
		if (this.options.placement != 'auto') {
			this.placement = this.options.placement;
			return this.placement;
		}

		if (!this.$element.hasClass('in')) {
			this.$element.css('visibility', 'hidden !important').addClass('in');
		}

		var horizontal = $(window).width() / this.$element.width(),
			vertical   = $(window).height() / this.$element.height(),
			element    = this.$element;

		// **
		// Function which will allow the choice of a an option "a" or an option
		// "b" depending on the evaluation of the CSS rules with the same name
		// as the options passed to the chooser. The first option has priority
		// over the second, in the event that they both evaluate to the same
		// value.
		function chooser(a, b) {
			if (element.css(b) === 'auto') return a;
			if (element.css(a) === 'auto') return b;
			var sizea = parseInt(element.css(a), 10),
				sizeb = parseInt(element.css(b), 10);
			return sizea > sizeb ? b : a;
		};
		this.placement = horizontal > vertical
			? chooser('left', 'right')
			: chooser('top', 'bottom');

		if (this.$element.css('visibility') === 'hidden !important') {
			this.$element.removeClass('in').css('visibility', '');
		}
		return this.placement;
	},

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
		if (this.state !== 'open') return;

		var dfd        = this,
			elements   = this.elements('.offcanvas-open'),
			placement  = this.placement,
			offset     = -1 * this.offset(),
			startEvent = $.Event('hide.at.offcanvas'),
			complete   = function() {
				if (this.state != 'transitioning') return;
				this.state = null;
				this.placement = null;
				this.$element.removeClass('in');
				elements.removeClass('.offcanvas-open');
				elements.add(this.$element).add('body').each(function() {
					$(this).attr('style', $(this).data('offcanvas-style')).removeData('offcanvas-style');
				});
				this.$element.trigger('hidden.at.offcanvas');
			};

		this.$element.trigger(startEvent);
		if (startEvent.isDefaultPrevented()) {
			return;
		}

		if (this.options.modal) this.toggleBackdrop();
		elements.removeClass('offcanvas-open').addClass('transitioning');

		setTimeout($.proxy(function() {
			this.transition(elements, offset, $.proxy(complete, this));
		}, this), 350);
	};

	/**
	 * 
	 */
	Offcanvas.prototype.show = function(/*DOMEvent*/ e)
	{
		// **
		// Short circuit out of the method if we have some sort of state
		// associated with the widget; if the widget is being displayed, or is
		// open, it will have state, otherwise this will be null.
		if (this.state) {
			return;
		}

		var dfd        = $.Deferred(),
			startEvent = $.Event('show.bs.offcanvas'),
			elements   = this.elements(),
			placement  = this.place(),
			opposite   = this.opposite(placement),
			offset     = this.offset(),
			complete   = function() {
				if (this.state != 'transitioning') return;
				this.state = 'open';
				elements.removeClass('transitioning').addClass('offcanvas-open');
				this.$element.trigger('shown.bs.offcanvas');
			};

		this.$element.trigger(startEvent);
		if (startEvent.isDefaultPrevented()) {
			return;
		}

		this.state = 'transitioning';
		if (elements.index(this.$element) !== -1) {
			$(this.$element).data('offcanvas-style', $(this.$element).attr('style') || '')
			this.$element.css(placement, -1 * offset)
			this.$element.css(placement); // Workaround: Need to get the CSS property for it to be applied before the next line of code
		}

		elements.addClass('canvas-sliding').each(function() {
			if ($(this).data('offcanvas-style') === undefined) {
				$(this).data('offcanvas-style', $(this).attr('style') || '');
			}
			if ($(this).css('position') === 'static') {
				$(this).css('position', 'relative');
			}
			if (($(this).css(placement) === 'auto' || $(this).css(placement) === '0px')
					&& ($(this).css(opposite) === 'auto' || $(this).css(opposite) === '0px')) {
				$(this).css(placement, 0);
			}
		});
		if (this.options.modal) this.toggleBackdrop();
		setTimeout($.proxy(function() {
			this.$element.addClass('in');
			this.transition(elements, offset, $.proxy(complete, this))
		}, this), 350);
	};

	/**
	 * Toggles the offcanvas open-or-closed, depending on the current state of
	 * the offcanvas element.
	 *
	 * @return undefined
	 */
	Offcanvas.prototype.toggle = function(/*DOMEvent*/ e) {
		if (this.state === 'transitioning') return;
		this[this.state === 'open' ? 'hide' : 'show']();
	};

	/**
	 * Performs the actual transition. If a transition is not supported, the
	 * widget will use jQuery to achieve the transition's animated effect.
	 *
	 * @return undefined
	 */
	Offcanvas.prototype.transition = function (elements, offset, callback)
	{
		if (!$.support.transition) {
			var anim = {}
			anim[this.placement] = "+=" + offset
			return elements.animate(anim, 350, callback)
		}

		var placement = this.placement,
			opposite  = this.opposite(placement);

		elements.each(function() {
			if ($(this).css(placement) !== 'auto') this.placeAt(placement, offset);
			if ($(this).css(opposite) !== 'auto') this.placeAt(opposite, -offset);
		});

		this.$element
			.one($.support.transition.end, callback)
			.emulateTransitionEnd(350);
	},

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
