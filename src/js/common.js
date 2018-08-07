/**
 * !resize only width
 * */
var resizeByWidth = true;

var prevWidth = -1;
$(window).resize(function () {
	var currentWidth = $('body').outerWidth();
	resizeByWidth = prevWidth !== currentWidth;
	if (resizeByWidth) {
		$(window).trigger('resizeByWidth');
		prevWidth = currentWidth;
	}
});

/**
 * !device detected
 * */
var DESKTOP = device.desktop();
var MOBILE = device.mobile();
var TABLET = device.tablet();

/**
 * !Tooltip
 * */
function initTooltip() {
	var $elements = $('.user-options__item a');
	$.each($elements, function () {
		var $curElem = $(this);
		$curElem.attr('data-title', $curElem.attr('title')).attr('title','');
	})
}

(function($){
	var defaults = {
		// container: '.ms-drop__container-js', // is element
		opener: '.ms-drop__opener-js',
		openerText: 'span',
		drop: '.ms-drop__drop-js',
		dropOption: '.ms-drop__drop-js a',
		dropOptionText: 'span',
		initClass: 'ms-drop--initialized',
		closeOutsideClick: true, // Close all if outside click
		closeEscClick: true, // Close all if click on escape key
		closeAfterSelect: true, // Close drop after selected option
		preventOption: false, // Add preventDefault on click to option
		selectValue: true, // Display the selected value in the opener
		modifiers: {
			isOpen: 'is-open',
			activeItem: 'active-item'
		}

		// Callback functions
		// afterInit: function () {} // Fire immediately after initialized
		// afterChange: function () {} // Fire immediately after added or removed an open-class
	};

	function MsDrop(element, options) {
		var self = this;

		self.config = $.extend(true, {}, defaults, options);

		self.element = element;

		self.callbacks();
		self.event();
		// close drop if clicked outside active element
		if (self.config.closeOutsideClick) {
			self.closeOnClickOutside();
		}
		// close drop if clicked escape key
		if (self.config.closeEscClick) {
			self.closeOnClickEsc();
		}
		self.eventDropItems();
		self.init();
	}

	/** track events */
	MsDrop.prototype.callbacks = function () {
		var self = this;
		$.each(self.config, function (key, value) {
			if(typeof value === 'function') {
				self.element.on(key + '.msDrop', function (e, param) {
					return value(e, self.element, param);
				});
			}
		});
	};

	MsDrop.prototype.event = function () {
		var self = this;
		self.element.on('click', self.config.opener, function (event) {
			event.preventDefault();
			var curContainer = $(this).closest(self.element);

			if (curContainer.hasClass(self.config.modifiers.isOpen)) {

				curContainer.removeClass(self.config.modifiers.isOpen);

				// callback afterChange
				self.element.trigger('afterChange.msDrop');
				return;
			}

			self.element.removeClass(self.config.modifiers.isOpen);

			curContainer.addClass(self.config.modifiers.isOpen);

			// callback afterChange
			self.element.trigger('afterChange.msDrop');
		});
	};

	MsDrop.prototype.closeOnClickOutside = function () {

		var self = this;
		$(document).on('click', function(event){
			if( $(event.target).closest(self.element).length ) {
				return;
			}

			self.closeDrop();
			event.stopPropagation();
		});

	};

	MsDrop.prototype.closeOnClickEsc = function () {

		var self = this;
		$(document).keyup(function(e) {
			if (e.keyCode === 27) {
				self.closeDrop();
			}
		});

	};

	MsDrop.prototype.closeDrop = function (container) {

		var self = this,
			$element = $(container || self.element);

		if ($element.hasClass(self.config.modifiers.isOpen)) {
			$element.removeClass(self.config.modifiers.isOpen);
		}

	};

	MsDrop.prototype.eventDropItems = function () {

		var self = this;

		self.element.on('click', self.config.dropOption, function (e) {
			var cur = $(this);
			var curParent = cur.parent();

			if(curParent.hasClass(self.config.modifiers.activeItem)){
				e.preventDefault();
				return;
			}
			if(self.config.preventOption){
				e.preventDefault();
			}

			var curContainer = cur.closest(self.element);

			curContainer.find(self.config.dropOption).parent().removeClass(self.config.modifiers.activeItem);

			curParent
				.addClass(self.config.modifiers.activeItem);

			if(self.config.selectValue){
				curContainer
					.find(self.config.opener).find(self.config.openerText)
					.html(cur.find(self.config.dropOptionText).html());
			}

			if(self.config.closeAfterSelect) {
				self.closeDrop();
			}

		});

	};

	MsDrop.prototype.init = function () {

		this.element.addClass(this.config.initClass);

		this.element.trigger('afterInit.msDrop');

	};

	$.fn.msDrop = function (options) {
		'use strict';

		return this.each(function(){
			new MsDrop($(this), options);
		});

	};
})(jQuery);

/**
 * !Select lang
 * */
function selectLang() {
	$('.ms-drop__container-js').msDrop({})
}

/**
 *  !Add placeholder for old browsers
 * */
function placeholderInit() {
	$('[placeholder]').placeholder();
}

/**
 * !Show print page by click on the button
 * */
function printShow() {
	$('.view-print').on('click', function (e) {
		e.preventDefault();
		window.print();
	})
}

/**
 * !Toggle class on a form elements on focus
 * */
function inputFocusClass() {
	var $inputs = $('.field-js');

	if ($inputs.length) {
		var $fieldWrap = $('.input-wrap');
		var $selectWrap = $('.select');
		var classFocus = 'input--focus';

		$inputs.focus(function () {
			var $currentField = $(this);
			var $currentFieldWrap = $currentField.closest($fieldWrap);

			$currentField.addClass(classFocus);
			$currentField.prev('label').addClass(classFocus);
			$currentField.closest($selectWrap).prev('label').addClass(classFocus);
			$currentFieldWrap.addClass(classFocus);
			$currentFieldWrap.find('label').addClass(classFocus);

		}).blur(function () {
			var $currentField = $(this);
			var $currentFieldWrap = $currentField.closest($fieldWrap);

			$currentField.removeClass(classFocus);
			$currentField.prev('label').removeClass(classFocus);
			$currentField.closest($selectWrap).prev('label').removeClass(classFocus);
			$currentFieldWrap.removeClass(classFocus);
			$currentFieldWrap.find('label').removeClass(classFocus);

		});
	}
}

/**
 * !Toggle class on a form elements if this one has a value
 * */
function inputHasValueClass() {
	var $inputs = $('.field-js');

	if ($inputs.length) {
		var $fieldWrap = $('.input-wrap');
		var $selectWrap = $('.select');
		var classHasValue = 'input--has-value';

		$.each($inputs, function () {
			switchHasValue.call(this);
		});

		$inputs.on('keyup change', function () {
			switchHasValue.call(this);
		});

		function switchHasValue() {
			var $currentField = $(this);
			var $currentFieldWrap = $currentField.closest($fieldWrap);

			//first element of the select must have a value empty ("")
			if ($currentField.val().length === 0) {
				$currentField.removeClass(classHasValue);
				$currentField.prev('label').removeClass(classHasValue);
				$currentField.closest($selectWrap).prev('label').removeClass(classHasValue);
				$currentFieldWrap.removeClass(classHasValue);
				$currentFieldWrap.find('label').removeClass(classHasValue);
			} else if (!$currentField.hasClass(classHasValue)) {
				$currentField.addClass(classHasValue);
				$currentField.prev('label').addClass(classHasValue);
				$currentField.closest($selectWrap).prev('label').addClass(classHasValue);
				$currentFieldWrap.addClass(classHasValue);
				$currentFieldWrap.find('label').addClass(classHasValue);
			}
		}
	}
}

/**
 * !Initial sliders on the project
 * */
function slidersInit() {
	/*promo slider*/
	var $promoSlider = $('.promo-slider-js');
	if ($promoSlider.length) {
		$promoSlider.each(function () {
			var $thisSlider = $(this);
			var $thisBtnNext = $('.slider-arrow_next-js', $thisSlider);
			var $thisBtnPrev = $('.slider-arrow_prev-js', $thisSlider);
			var $thisPag = $('.swiper-pagination', $thisSlider);

			new Swiper($thisSlider, {
				// Optional parameters
				loop: false,
				// Keyboard
				keyboardControl: true,
				// Parallax
				parallax: true,

				// Navigation arrows
				nextButton: $thisBtnNext,
				prevButton: $thisBtnPrev,

				// Pagination
				pagination: $thisPag,
				paginationType: 'bullets',
				paginationClickable: true
			});
		});
	}

	/*tape slider*/
	var $tapeSlider = $('.tape-slider-js');
	if ($tapeSlider.length) {
		$tapeSlider.each(function () {
			var $thisSlider = $(this),
				$thisBtnNext = $('.slider-arrow_next-js', $thisSlider),
				$thisBtnPrev = $('.slider-arrow_prev-js', $thisSlider),
				$thisPag = $('.swiper-pagination', $thisSlider),
				// slidesLength = $('.swiper-slide', $thisSlider).length,
				perView = 4;

			// console.log("slidesLength: ", slidesLength);
			// console.log("perView: ", perView);

			var mySwiper = new Swiper($('.swiper-container', $thisSlider), {
				// slidesPerView: 'auto',
				slidesPerView: perView,
				// slidesPerGroup: 2,
				// autoHeight: true,
				// Optional parameters
				loop: false,
				// Keyboard
				keyboardControl: true,
				// additional slide offset in the beginning of the container
				// slidesOffsetBefore: 91,
				// spaceBetween: 65,
				// Ratio to trigger swipe to next/previous slide during long swipes
				longSwipesRatio: 0.1,
				longSwipesMs: 200,

				// Navigation arrows
				nextButton: $thisBtnNext,
				prevButton: $thisBtnPrev,
				// navigation: {
				// 	nextEl: $thisBtnNext,
				// 	prevEl: $thisBtnPrev
				// },

				// Pagination
				pagination: $thisPag,
				paginationClickable: true,
				// paginationType: 'fraction',
				// Responsive breakpoints
				breakpoints: {
					1919: {
						// slidesOffsetBefore: 71,
						// spaceBetween: 30
					},
					1599: {
						// slidesOffsetBefore: 41
					},
					1199: {
						// slidesOffsetBefore: 30
					},
					639: {
						// slidesOffsetBefore: 20
					},
					479: {
						// slidesOffsetBefore: 0,
						slidesPerView: 1
					}
				},
				// events
				onInit: function (swiper) {
					$(swiper.slides).matchHeight({
						byRow: true, property: 'height', target: null, remove: false
					});
				}
			});

			// $('h2').on('click', function () {
			// 	console.log(1);
			// 	mySwiper.detachEvents();
			// });
			// $('.parts__item__thumb').on('click', function () {
			// 	console.log(2);
			// 	mySwiper.update();
			// 	mySwiper.attachEvents();
			// })
		});
	}

	/*news slider*/
	var $newsSlider = $('.news-slider-js');
	if ($newsSlider.length) {
		$newsSlider.each(function () {
			var $thisSlider = $(this),
				$thisBtnNext = $('.slider-arrow_next-js', $thisSlider),
				$thisBtnPrev = $('.slider-arrow_prev-js', $thisSlider),
				$thisPag = $('.swiper-pagination', $thisSlider),
				// slidesLength = $('.swiper-slide', $thisSlider).length,
				perView = 3;

			// console.log("slidesLength: ", slidesLength);
			// console.log("perView: ", perView);

			var mySwiper = new Swiper($('.swiper-container', $thisSlider), {
				// slidesPerView: 'auto',
				slidesPerView: perView,
				// slidesPerGroup: 2,
				// autoHeight: true,
				// Optional parameters
				loop: false,
				// Keyboard
				keyboardControl: true,
				// additional slide offset in the beginning of the container
				// slidesOffsetBefore: 91,
				// spaceBetween: 65,
				// Ratio to trigger swipe to next/previous slide during long swipes
				longSwipesRatio: 0.1,
				longSwipesMs: 200,

				// Navigation arrows
				nextButton: $thisBtnNext,
				prevButton: $thisBtnPrev,
				// navigation: {
				// 	nextEl: $thisBtnNext,
				// 	prevEl: $thisBtnPrev
				// },

				// Pagination
				pagination: $thisPag,
				paginationClickable: true,
				// paginationType: 'fraction',
				// Responsive breakpoints
				breakpoints: {
					1919: {
						// slidesOffsetBefore: 71,
						// spaceBetween: 30
					},
					1599: {
						// slidesOffsetBefore: 41
					},
					1199: {
						// slidesOffsetBefore: 30
					},
					639: {
						// slidesOffsetBefore: 20
					},
					479: {
						// slidesOffsetBefore: 0,
						slidesPerView: 1
					}
				},
				// events
				onInit: function (swiper) {
					$(swiper.slides).matchHeight({
						byRow: true, property: 'height', target: null, remove: false
					});
				}
			});

			// $('h2').on('click', function () {
			// 	console.log(1);
			// 	mySwiper.detachEvents();
			// });
			// $('.parts__item__thumb').on('click', function () {
			// 	console.log(2);
			// 	mySwiper.update();
			// 	mySwiper.attachEvents();
			// })
		});
	}
}

/**
 * !Plugin HoverClass
 * */
(function ($) {
	var HoverClass = function (settings) {
		var options = $.extend({
			container: 'ul',
			item: 'li',
			drop: 'ul'
		},settings || {});

		var self = this;
		self.options = options;

		var container = $(options.container);
		self.$container = container;
		self.$item = $(options.item, container);
		self.$drop = $(options.drop, container);
		self.$html = $('html');

		self.modifiers = {
			hover: 'hover',
			hoverNext: 'hover_next',
			hoverPrev: 'hover_prev'
		};

		self.addClassHover();

		if (!DESKTOP) {
			$(window).on('debouncedresize', function () {
				self.removeClassHover();
			});
		}
	};

	HoverClass.prototype.addClassHover = function () {
		var self = this,
			_hover = this.modifiers.hover,
			_hoverNext = this.modifiers.hoverNext,
			_hoverPrev = this.modifiers.hoverPrev,
			$item = self.$item,
			item = self.options.item,
			$container = self.$container;

		if (!DESKTOP) {

			$container.on('click', ''+item+'', function (e) {
				var $currentAnchor = $(this);
				var currentItem = $currentAnchor.closest($item);

				if (!currentItem.has(self.$drop).length){ return; }

				e.stopPropagation();

				if (currentItem.hasClass(_hover)){
					// self.$html.removeClass('css-scroll-fixed');

					// if($('.main-sections-js').length) {
					// 	$.fn.fullpage.setAllowScrolling(true); // unblocked fullpage scroll
					// }

					currentItem.removeClass(_hover).find('.'+_hover+'').removeClass(_hover);

					return;
				}

				// self.$html.addClass('css-scroll-fixed');
				// if($('.main-sections-js').length) {
				// 	$.fn.fullpage.setAllowScrolling(false); // blocked fullpage scroll
				// }

				$('.'+_hover+'').not($currentAnchor.parents('.'+_hover+''))
					.removeClass(_hover)
					.find('.'+_hover+'')
					.removeClass(_hover);
				currentItem.addClass(_hover);

				e.preventDefault();
			});

			$container.on('click', ''+self.options.drop+'', function (e) {
				e.stopPropagation();
			});

			$(document).on('click', function () {
				$item.removeClass(_hover);
			});

		} else {
			$container.on('mouseenter', ''+item+'', function () {

				var currentItem = $(this);

				if (currentItem.prop('hoverTimeout')) {
					currentItem.prop('hoverTimeout', clearTimeout(currentItem.prop('hoverTimeout')));
				}

				currentItem.prop('hoverIntent', setTimeout(function () {
					// self.$html.addClass('css-scroll-fixed');
					// if($('.main-sections-js').length) {
					// 	$.fn.fullpage.setAllowScrolling(false); // blocked fullpage scroll
					// }

					currentItem.addClass(_hover);
					currentItem.next().addClass(_hoverNext);
					currentItem.prev().addClass(_hoverPrev);

				}, 50));

			}).on('mouseleave', ''+ item+'', function () {

				var currentItem = $(this);

				if (currentItem.prop('hoverIntent')) {
					currentItem.prop('hoverIntent', clearTimeout(currentItem.prop('hoverIntent')));
				}

				currentItem.prop('hoverTimeout', setTimeout(function () {
					// self.$html.removeClass('css-scroll-fixed');
					// if($('.main-sections-js').length) {
					// 	$.fn.fullpage.setAllowScrolling(true); // unblocked fullpage scroll
					// }

					currentItem.removeClass(_hover);
					currentItem.next().removeClass(_hoverNext);
					currentItem.prev().removeClass(_hoverPrev);
				}, 50));

			});

		}
	};

	HoverClass.prototype.removeClassHover = function () {
		var self = this;
		self.$item.removeClass(self.modifiers.hover );
	};

	window.HoverClass = HoverClass;

}(jQuery));

/**
 * !Toggle "hover" class by hover on the item of the list
 * */
function initHoverClass() {
	if ($('.nav__list-js').length) {
		new HoverClass({
			container: '.nav__list-js', drop: '.nav__drop-js'
		});
	}
}

/**
 * !Equal height of blocks by maximum height of them
 */
function equalHeight() {
	// equal height
	var $equalHeight = $('.equal-height-js');

	if($equalHeight.length) {
		$equalHeight.children().matchHeight({
			byRow: true, property: 'height', target: null, remove: false
		});
	}
}

/**
 * Shutters
 * */
(function($){
	'use strict';

	var $doc = $(document),
		$html = $('html'),
		countFixedScroll = 0;

	var TClass = function(element, config){
		var self,
			$element = $(element),
			dataStopRemove = '[data-tc-stop]',
			classIsAdded = false;

		var callbacks = function() {
				/** track events */
				$.each(config, function (key, value) {
					if(typeof value === 'function') {
						$element.on('tClass.' + key, function (e, param) {
							return value(e, $element, param);
						});
					}
				});
			},
			add = function () {
				if (classIsAdded) return;

				// callback before added class
				$element.trigger('tClass.beforeAdded');

				var arr = [
					$element,
					$(config.switchBtn),
					config.toggleClassTo
				];

				$.each(arr, function () {
					var curElem = this;
					// если массив, то устанавливаем класс на каждый из элемент этого массива
					if ($.isArray(curElem)) {
						$.each(curElem, function () {
							var $curElem = $(this);
							if ($curElem.length) {
								$curElem.addClass(config.modifiers.currentClass);

								$element.trigger('tClass.afterEachAdded', $curElem);
							} else {
								// В консоль вывести предуприждение,
								// если указанного элемента не существует.
								console.warn('Element "' + this + '" does not exist!')
							}
						});
					} else {
						$(this).addClass(config.modifiers.currentClass);

						$element.trigger('tClass.afterEachAdded', $(this));
					}
				});

				if (config.cssScrollFixed) {
					countFixedScroll = ++countFixedScroll;
				}

				classIsAdded = true;

				toggleScroll();

				// callback after added class
				$element.trigger('tClass.afterAdded');
			},
			remove = function () {
				if (!classIsAdded) return;

				// callback beforeRemoved
				$element.trigger('tClass.beforeRemoved');

				var arr = [
					$element,
					$(config.switchBtn),
					config.toggleClassTo
				];

				$.each(arr, function () {
					var curElem = this;
					// если массив, то удаляем класс с каждого элемент этого массива
					if ($.isArray(curElem)) {
						$.each(curElem, function () {
							var $curElem = $(this);
							if ($curElem.length) {
								$curElem.removeClass(config.modifiers.currentClass);

								$element.trigger('tClass.afterEachRemoved', $curElem);
							} else {
								// В консоль вывести предуприждение,
								// если указанного элемента не существует.
								console.warn('Element "' + this + '" does not exist!')
							}
						});
					} else {
						$(this).removeClass(config.modifiers.currentClass);

						$element.trigger('tClass.afterEachRemoved', $(this));
					}
				});

				classIsAdded = false;

				if (config.cssScrollFixed) {
					countFixedScroll = --countFixedScroll;
				}
				toggleScroll();

				// callback afterRemoved
				$element.trigger('tClass.afterRemoved');
			},
			events = function () {
				$element.on('click', function (event) {
					if (classIsAdded) {
						remove();

						event.preventDefault();
						return false;
					}

					add();

					event.preventDefault();
					event.stopPropagation();
				});

				if (config.switchBtn) {
					$html.on('click', config.switchBtn, function (event) {
						var $this = $(this);

						event.preventDefault();

						if ($this.attr('data-tc-only-add') !== undefined) {
							add();

							return false;
						}

						if ($this.attr('data-tc-only-remove') !== undefined) {
							remove();

							return false;
						}

						if (classIsAdded) {
							remove();

							return false;
						}

						add();

						event.stopPropagation();
					})
				}
			},
			toggleScroll = function () {
				if (config.cssScrollFixed) {
					var mod = (config.cssScrollFixed === true) ? 'css-scroll-fixed' : config.cssScrollFixed;
					if (!countFixedScroll) {
						// Удаляем с тега html
						// класс блокирования прокрутки
						$html.removeClass(mod);
					} else {
						// Добавляем на тег html
						// класс блокирования прокрутки.
						$html.addClass(mod);
					}
				}
			},
			closeByClickOutside = function () {
				$doc.on('click', function(event){
					if(classIsAdded && config.removeOutsideClick && !$(event.target).closest(dataStopRemove).length) {
						remove();
						// event.stopPropagation();
					}
				});
			},
			closeByClickEsc = function () {
				$doc.keyup(function(event) {
					if (classIsAdded && event.keyCode === 27) {
						remove();
					}
				});
			},
			init = function () {
				$element.addClass(config.modifiers.init);
				$element.trigger('tClass.afterInit');
			};

		self = {
			callbacks: callbacks,
			remove: remove,
			events: events,
			closeByClickOutside: closeByClickOutside,
			closeByClickEsc: closeByClickEsc,
			init: init
		};

		return self;
	};

	// $.fn.tClass = function (options, params) {
	$.fn.tClass = function () {
		var _ = this,
			opt = arguments[0],
			args = Array.prototype.slice.call(arguments, 1),
			l = _.length,
			i,
			ret;
		for (i = 0; i < l; i++) {
			if (typeof opt === 'object' || typeof opt === 'undefined') {
				_[i].tClass = new TClass(_[i], $.extend(true, {}, $.fn.tClass.defaultOptions, opt));
				_[i].tClass.callbacks();
				_[i].tClass.events();
				_[i].tClass.closeByClickOutside();
				_[i].tClass.closeByClickEsc();
				_[i].tClass.init();
			}
			else {
				ret = _[i].tClass[opt].apply(_[i].tClass, args);
			}
			if (typeof ret !== 'undefined') {
				return ret;
			}
		}
		return _;
	};

	$.fn.tClass.defaultOptions = {
		switchBtn: null,
		toggleClassTo: null,
		removeOutsideClick: true,
		cssScrollFixed: false,
		modifiers: {
			init: 'tc--initialized',
			currentClass: 'tc--active'
		}
	};

})(jQuery);

function toggleShutters() {
	var $nav = $('.nav-opener-js'),
		nav,
		$filters = $('.filters-opener-js'),
		filters,
		$search = $('.search-opener-js'),
		search,
		searchForm = '.search-form-js';

	if ($nav.length) {
		nav = $nav.tClass({
			toggleClassTo: ['html', '.nav-overlay-js', '.shutter--nav-js']
			, modifiers: {
				currentClass: 'nav-is-open open-only-mob'
				// open-only-mob - используется для адаптива
			}
			, cssScrollFixed: true
			, removeOutsideClick: true
			, beforeAdded: function () {
				$search.length && search.tClass('remove');
				$filters.length && filters.tClass('remove');
			}
		});
	}

	// filters
	if ($filters.length) {
		filters = $filters.tClass({
			toggleClassTo: ['html', '.filters-overlay-js', '.shutter--filters-js']
			, switchBtn: '.filter-closer-js'
			, modifiers: {
				currentClass: 'filters-is-open open-only-mob'
			}
			, cssScrollFixed: true
			, removeOutsideClick: true
			, beforeAdded: function () {
				$search.length && search.tClass('remove');
				$nav.length && nav.tClass('remove');
			}
		});
	}

	if ($search.length) {
		search = $search.tClass({
			toggleClassTo: ['html', searchForm]
			, modifiers: {
				currentClass: 'search-is-open'
			}
			, cssScrollFixed: false
			, removeOutsideClick: true
			, switchBtn: '.search-closer-js'
			, beforeAdded: function () {
				$nav.length && nav.tClass('remove');
				$filters.length && filters.tClass('remove');
			}
			, afterAdded: function () {
				setTimeout(function () {
					$(searchForm).find('input[type=search]').focus();
				}, 100)
			}
			, afterRemoved: function () {
				$(searchForm).find('input[type=search]').blur();
			}
		});
	}
}

/**
 * !Form validation
 * */
function formValidation() {
	$('.user-form form').validate({
		errorClass: "error",
		validClass: "success",
		errorElement: false,
		errorPlacement: function(error,element) {
			return true;
		},
		highlight: function(element, errorClass, successClass) {
			$(element)
				.removeClass(successClass)
				.addClass(errorClass)
				.closest('form').find('label[for="' + $(element).attr('id') + '"]')
				.removeClass(successClass)
				.addClass(errorClass);
		},
		unhighlight: function(element, errorClass, successClass) {
			$(element)
				.removeClass(errorClass)
				.addClass(successClass)
				.closest('form').find('label[for="' + $(element).attr('id') + '"]')
				.removeClass(errorClass)
				.addClass(successClass);
		}
	});
}

/**
 * =========== !ready document, load/resize window ===========
 */

$(window).on('load', function () {
	// add functions
});

$(window).on('debouncedresize', function () {
	// $(document.body).trigger("sticky_kit:recalc");
});

$(document).ready(function () {
	initTooltip();
	selectLang();
	placeholderInit();
	printShow();
	inputFocusClass();
	inputHasValueClass();
	slidersInit();
	initHoverClass();
	equalHeight();
	toggleShutters();
	objectFitImages(); // object-fit-images initial

	formValidation();
});
