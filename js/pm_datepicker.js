/**
 * @todo can select day? if disable day (filters)
 * @todo filters :
 *			Bind every input on initBinding
 *			Switch calendar (between gregorian & jalali)
 *			Min date
 *			Max date
 *			Disable dates
 *			Result formats
 */

/**
 * Datepicker
 * Free License To Use, Debug & Add Features but you can't remove/change author name/email from this js file
 * Created at Oct 31, 2016, 5:43:48 PM
 * @author Mehdi Mohammadnejad <m.mohammadnejad@peetup.com>
 * @version 1.0.0.0
 * @see Programmers Meetup at http://peetup.com
 */
(pmDatepicker = {
	className: 'pmdp',
	id: 'pm_datepicker',
	/**
	 * Parent of node that must be bind with datepicker data
	 * @type HTMLNode
	 */
	actionNode: null,
	/**
	 * Must be gregorian datetime
	 * Format can be one of bellow: (i = minute)
	 * minimum : "yyyy/mm", etc: "2016/01"
	 * maximum : "yyyy/mm/dd hh/ii", etc: "2016/01/01 07:05", "2016/01/01 21:25"
	 * normal  : "yyyy/mm/dd", etc: "2016/01/01"
	 * onlyHour: "yyyy/mm/dd hh", etc: "2016/01/01 20"
	 * @type Date
	 */
	currentDate: '',
	/**
	 * Calendar data
	 * @type {object} calendar
	 */
	calendar: {
		jd: null,
		date: null,
		monthDays: null,
		weekDay: null,
		firstMonthWeekDay: null,
		lastMonthWeekDay: null
	},
	label: {
		en: {
			month: 'Month',
			year: 'Year',
			day: 'Day',
			today: 'Today',
			time: 'Time',
			calendar: 'جلالی'
		},
		fa: {
			month: 'ماه',
			year: 'سال',
			day: 'روز',
			today: 'امروز',
			time: 'ساعت',
			calendar: 'Gregorian'
		}
	},
	weekDays: {
		en: {
			'full': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			'abbr': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
		},
		fa: {
			'full': ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
			'abbr': ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش']
		},
		shift() {
			var lang = pmDatepicker.config.lang;
			var wd = this[lang].abbr.slice(0);
			if (lang === 'fa') {
				wd.unshift(wd.pop());
			}
			return wd;
		}
	},
	digit: ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'],
	monthName: {
		fa: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
		en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	},
	binding: '<span class="pmdp_binding">{date}</span>',
	btn: '<a class="datepicker" onclick="pmDatepicker.pmdpLaunch(this);" tabindex="" href="#">{label}{binding}</a><span class="pmdp_remove" {style} onclick="pmDatepicker.removeBinding(this);">&#xf00d;</span>',
	btnLabel: '&#xf073;',
	input: '<input class="pmdp_binding" />',
	template: '{btn}{input}',
	view: '',
	config: {
		input: true,
		binding: true,
		lang: 'fa',
		month: '',
		year: '',
		day: '',
		time: '',
		today: '',
		switchCalendar: '',
		autoClose: false,
		selectedDatetime: ''
	},
	flagClose: true,
	/**
	 * Return all elements that has class [this.className]
	 * @returns {NodeList}
	 */
	elements() {
		return document.getElementsByClassName(this.className);
	},
	/**
	 * Set current datetime
	 * Return current datetime
	 * @param {String} date from server current datetime
	 * @returns {Date}
	 */
	setCurrentDate(date = '') {
		date = date.match(/^(\d{4})\/(\d{1}|\d{2})[/]?(\d{1}|\d{2})?[ ]?(\d{1}|\d{2})?:?(\d{1}|\d{2})?$/);
		if (date !== null) {
			date.forEach(function (l, i, a) {
				a[i] = (typeof l === 'undefined') ? 0 : l;
			});
			return new Date(date[1], date[2] - 1, date[3], date[4], date[5]);
		}
		return new Date();
	},
	/**
	 * Convert single digit to two digit (etc: 1 -> '01' or '9' -> '09')
	 * @param {Number} d
	 * @returns {String}
	 */
	set2Digit(d) {
		if (Array.isArray(d)) {
			for (var i in d) {
				d[i] = ((parseInt(d[i]) < 10) ? '0' : '') + parseInt(d[i]);
			}
			return d;
		}
		return ((parseInt(d) < 10) ? '0' : '') + parseInt(d);
	},
	/**
	 * Convert to persian digit
	 * @param {int} num
	 * @returns {String}
	 */
	convertDigit(num) {
		if (this.config.lang === 'fa') {
			var arr = String(num).split("");
			num = '';
			for (var c in arr) {
				num += (isNaN(parseInt(arr[c]))) ? arr[c] : this.digit[parseInt(arr[c])];
			}
		}
		return num;
	},
	/**
	 * execute this method before generate the template to view.
	 */
	beforeGenerateTemplate() {
		return null;
	},
	/**
	 * execute this method after generate the template to view.
	 */
	afterGenerateTemplate() {
		return null;
	},
	/**
	 * execute this method after select a day from calendar.
	 */
	afterSelectDay() {
		return null;
	},
	/**
	 * Set datepicker configuration that defined by users
	 * {
	 *   'label': {
	 *     // User can set label property without set language
	 *     'month': [string],
	 *     'year': [string],
	 *     ...
	 *   },
	 *   'template': '{input}', or '{btn}', or '{input}{btn}', // type is string and if set empty generate default template ('{btn}{input}')
	 *   'input': [boolean],
	 * }
	 * @param {object} conf JSON
	 */
	setConf(conf) {
		this.currentDate = (conf.currentDate !== '') ? this.setCurrentDate(conf.currentDate) : this.setCurrentDate('');
		this.config.input = (conf.input !== false);
		this.config.binding = (conf.binding !== false);
		this.config.lang = (conf.lang === 'en') ? 'en' : 'fa';
		var prev = ['&#xf053;'], next = ['&#xf054;'];
		if (this.config.lang === 'fa') {
			prev = ['&#xf054;'];
			next = ['&#xf053;'];
		}
		this.config.month = (conf.month === false) ? '' : '<div class="pmdp_btnMonth"><span class="prev" onclick="pmDatepicker.selectPrevMonth();">' + prev[0] + '</span><label onclick="pmDatepicker.monthSection();">{month}</label><span class="next" onclick="pmDatepicker.selectNextMonth();">' + next[0] + '</span></div>';
		this.config.year = (conf.year === false) ? '' : '<div class="pmdp_btnYear"><span class="prev" onclick="pmDatepicker.prevYear();">' + prev[0] + '</span><label onclick="pmDatepicker.yearSection();">{year}</label><span class="next" onclick="pmDatepicker.nextYear();">' + next[0] + '</span></div>';
		this.config.day = (conf.day === false) ? '' : '<div class="pmdp_btnDay" onclick="pmDatepicker.daySection();"><span class="icon">&#xf073;</span></div>';
		this.config.time = (conf.time === false) ? '' : '<div class="pmdp_gettime" onclick="pmDatepicker.timeSection();"><span class="icon">&#xf017;</span></div>';
		this.config.today = (conf.today === false) ? '' : '<div class="pmdp_today" onclick="pmDatepicker.getToday();"><label>{today}</label></div>';
		this.config.switchCalendar = (conf.switchCalendar === false) ? '' : '<div class="pmdp_calendar" onclick="pmDatepicker.switchCalendar();"><span class="icon">&#xf0ec;</span></div>';
		this.config.otherMonth = (conf.otherMonth === false) ? false : true;
		this.config.autoClose = (conf.autoClose === true) ? true : false;
		this.config.epochTime = (conf.epochTime === true) ? true : false;
	},
	/**
	 * Generate datepicker node & contents to end of body
	 */
	generateCalendarNodes() {
		var dpNode = document.getElementById('pm_datepicker');
		if (dpNode !== null)
			dpNode.remove();
		var days = this.generateDays();
		var calendarHtml = '<header class="pmdp_header">' +
				this.config.day +
				this.config.year.replace('{year}', this.convertDigit(this.calendar.date[0])) +
				(this.config.month.replace('{month}', this.monthName[this.config.lang][this.calendar.date[1] - 1])) +
				'<div class="clearfix"></div>' +
				'</header>' +
				'<div class="pmdp_content">' +
				'<div class="pmdp_week">' +
				this.generateWeekDays() +
				'<div class="clearfix"></div>' +
				'</div>' +
				'<section class="pmDaypicker">' +
				days +
				'</section>' +
				'<section class="pmMonthpicker">' +
				this.generateMonth() +
				'<div class="clearfix"></div>' +
				'</section>' +
				'<section class="pmYearpicker">' +
				this.generateYear() +
				'<div class="clearfix"></div>' +
				'</section>' +
				'<section class="pmTimepicker">' +
				this.generateTime() +
				'<div class="clearfix"></div>' +
				'</section>' +
				'</div>' +
				'<footer class="pmdp_footer">' +
				this.config.time +
				this.config.switchCalendar +
				(this.config.today.replace('{today}', this.label[this.config.lang].today)) +
				'<div class="clearfix"></div>' +
				'</footer>';
		if (document.body !== null) {
			var dpElement = document.createElement('DIV');
			dpElement.id = this.id;
			dpElement.classList.add(this.config.lang);
			dpElement.innerHTML = calendarHtml;
			document.body.appendChild(dpElement);
		}
	},
	generateWeekDays() {
		var weekDays = '';
		var week = this.weekDays.shift();
		for (var i = 0; i <= 6; i++) {
			weekDays += '<span>' + week[i] + '</span>';
		}
		return weekDays;
	},
	/**
	 * Generate daypicker content
	 * @returns {String}
	 */
	generateDays() {
		var prevDays = '', currDays = '', nextDays = '', i = 1;

		if (this.config.lang === 'fa')
			this.jDate();
		else
			this.gDate();

		var prev = this.getPrevMonthDays();
		var next = this.getNextMonthDays();
		var m = 0, n = 0, until = 0;
		if (this.config.lang === 'fa') {
			until = prev;

			m = (this.calendar.firstMonthWeekDay === 5) ? -1 : this.calendar.firstMonthWeekDay + 1;
			if (m > 5) {
				m = 0;
			}

			n = 4 - this.calendar.lastMonthWeekDay;
			if (n < 0) {
				n = 7 + n;
			}
		} else {
			m = this.calendar.firstMonthWeekDay - 1;
			until = prev;

			n = 6 - this.calendar.lastMonthWeekDay;
		}

		var date = [this.calendar.date[0], this.calendar.date[1]], selected = '';
		for (i = 1; i <= this.calendar.monthDays; i++) {
			date[2] = i;
			selected = (this.calendar.date[2] === i) ? ' selected' : '';
			currDays += '<span class="curr' + selected + '" onclick="pmDatepicker.selectDay([' + date + '], this)">' + this.convertDigit(i) + '</span>';
		}

		if (this.config.otherMonth === true) {
			if ((parseInt(this.calendar.date[1]) - 1) < 1) {
				date[1] = 12;
				date[0] = parseInt(this.calendar.date[0]) - 1;
			} else
				date[1] = parseInt(this.calendar.date[1]) - 1;

			for (i = prev - m; i <= until; i++) {
				date[2] = i;
				prevDays += '<span class="prev" onclick="pmDatepicker.selectDay([' + date + '], this);">' + this.convertDigit(i) + '</span>';
			}

			if ((parseInt(this.calendar.date[1]) + 1) > 12) {
				date[1] = 1;
				date[0] = parseInt(this.calendar.date[0]) + 1;
			} else {
				date[1] = parseInt(this.calendar.date[1]) + 1;
				date[0] = this.calendar.date[0];
			}

			for (i = 1; i <= n; i++) {
				date[2] = i;
				nextDays += '<span class="next" onclick="pmDatepicker.selectDay([' + date + '], this)"">' + this.convertDigit(i) + '</span>';
			}
		} else {
			for (i = prev - m; i <= until; i++)
				prevDays += '<span class="empty"></span>';
			for (i = 1; i <= next; i++)
				nextDays += '<span class="empty"></span>';
		}

		return prevDays + currDays + nextDays + '<div class="clearfix"></div>';
	},
	/**
	 * Generate timepicker content
	 * @returns {String}
	 */
	generateTime() {
		return  '<span class="tp_up" onclick="pmDatepicker.upHour();">&#xf0d8;</span>' +
				'<span></span>' +
				'<span class="tp_up" onclick="pmDatepicker.upMinute();">&#xf0d8;</span>' +
				'<span class="tp_hour" data-hour="' + this.calendar.date[3] + '">' + this.convertDigit(this.calendar.date[3]) + '</span>' +
				'<span class="tp_sep">:</span>' +
				'<span class="tp_minute" data-minute="' + this.calendar.date[4] + '">' + this.convertDigit(this.calendar.date[4]) + '</span>' +
				'<span class="tp_down" onclick="pmDatepicker.downHour();">&#xf0d7;</span>' +
				'<span></span>' +
				'<span class="tp_down" onclick="pmDatepicker.downMinute();">&#xf0d7;</span>';
	},
	/**
	 * Generate yearpicker content
	 * @param {Number} yearNumber
	 * @returns {String}
	 */
	generateYear(yearNumber = null) {
		var year = '', curr = '', y;
		y = (yearNumber === null) ? parseInt(this.calendar.date[0]) - parseInt(this.calendar.date[0].toString().substr(-1, 1)) : parseInt(yearNumber);
		for (var i = y; i <= y + 15; i++) {
			curr = (i === this.calendar.date[0]) ? ' curr' : '';
			year += '<span class="pm_y' + i + curr + '" onclick="pmDatepicker.selectYear(' + i + ')" data-year="' + i + '">' + this.convertDigit(i) + '</span>';
		}
		return year;
	},
	/**
	 * Generate monthpicker content
	 * @returns {String}
	 */
	generateMonth() {
		var month = '', curr = '';
		for (var i = 0; i <= 11; i++) {
			curr = ((i + 1) === this.calendar.date[1]) ? ' curr' : '';
			if (this.config.lang === 'fa')
				month += '<span class="pm_m' + i + curr + '" onclick="pmDatepicker.selectMonth(' + i + ')">' + this.monthName.fa[i] + '</span>';
			else
				month += '<span class="pm_m' + i + curr + '" onclick="pmDatepicker.selectMonth(' + i + ')">' + this.monthName.en[i] + '</span>';
		}
		return month;
	},
	/**
	 * Initialize app with this method
	 */
	run() {
		this.beforeGenerateTemplate();
		this.generateTemplate();
		this.afterGenerateTemplate();
	},
	/**
	 * Generate the basic datepicker caller
	 */
	generateTemplate() {
		e = this.elements();
		for (var i = 0; i < e.length; i++) {
			this.actionNode = e[i];
			var eConf = JSON.parse(this.actionNode.dataset.config.replace(/'/g, '"'));
			this.setConf(eConf);
			this.initView();
			this.actionNode.innerHTML = this.view + this.actionNode.innerHTML;
			this.initJs();
		}
		this.actionNode = null;
	},
	/**
	 * Initialize the view without change inside elements.
	 */
	initView() {
		var btn = this.btn.replace('{label}', this.btnLabel);
		if (this.actionNode.dataset.jd) {
			btn = btn.replace('{style}', 'style="display:inline-block;"');
			this.actionNode.classList.add('fill');
		} else {
			btn = btn.replace('{style}', '');
		}
		var binding = (this.config.binding === true) ? btn.replace('{binding}', this.initBinding()) : btn.replace('{binding}', '');
		var btnTemplate = this.template.replace('{btn}', binding);
		this.view = (this.config.input === true) ? btnTemplate.replace('{input}', this.input) : btnTemplate.replace('{input}', '');
	},
	/**
	 * Display date if jd is set on the action node
	 */
	initBinding() {
		if (this.actionNode.dataset.jd) {
			var date = ((this.config.lang === 'fa') ? jd_to_persiana(this.actionNode.dataset.jd) : jd_to_gregorian(this.actionNode.dataset.jd));
			date = this.set2Digit(date);
			date = date.join('/') + ' ' + ((this.actionNode.dataset.time) ? this.actionNode.dataset.time : '00:00');
			return this.binding.replace('{date}', this.convertDigit(date));
		}
		return this.binding.replace('{date}', '');
	},
	/**
	 * Initialize runtime methods.
	 */
	initJs() {
		window.onclick = function (e) {
			var b = pmDatepicker.findParentNodeById(pmDatepicker.id, e.target);
			if (b === false && pmDatepicker.flagClose === true) {
				pmDatepicker.close();
			}
			pmDatepicker.flagClose = true;
		};
	},
	/**
	 * Find action node
	 * @param {String} parentId
	 * @param {dpElement} e
	 * @returns {pmDatepicker@call;findParentNodeById|Boolean}
	 */
	findParentNodeById(parentId, e) {
		if (e === null)
			return false;
		if (e === document.getElementById(parentId) || (e.className && e.classList.contains('datepicker') && e.nodeName === 'A')) {
			return true;
		}
		return this.findParentNodeById(parentId, e.parentNode);
	},
	/**
	 * Set action node for set the calendar data from input
	 * Open datepicker
	 * @param {dpElement} _this clicked element
	 */
	pmdpLaunch(_this) {
		pmDatepicker.actionNode = pmDatepicker.findParentNode(pmDatepicker.className, _this);
		pmDatepicker.open();
	},
	/**
	 * Find parent node that className is "pmdp" from clicked node.
	 * @param {
	 string} parentClassName
	 * @param {HTMLNode} childObj
	 * @returns {HTMLNode}
	 */
	findParentNode(parentClassName, childObj) {
		var testObj = childObj.parentNode;
		if (testObj.classList.contains(parentClassName)) {
			return testObj;
		}
		return this.findParentNode(parentClassName, testObj);
	},
	/**
	 * Set current datepicker config
	 */
	setActionNodeConf() {
		var eConf = JSON.parse(this.actionNode.dataset.config.replace(/'/g, '"'));
		this.setConf(eConf);
	},
	/**
	 * Set action node data from datepicker
	 */
	setActionNodeData() {
		this.actionNode.dataset.time = this.calendar.date[3] + ':' + this.calendar.date[4];
		this.actionNode.dataset.jd = this.calendar.jd = (this.config.lang === 'fa') ?
				persiana_to_jd(this.calendar.date[0], this.calendar.date[1], this.calendar.date[2]) :
				gregorian_to_jd(this.calendar.date[0], this.calendar.date[1], this.calendar.date[2]);
	},
	/**
	 * Remove datetime from binding nodes
	 * @param {Node} removeNode
	 */
	removeBinding(removeNode) {
		var removeNodeParent = this.findParentNode('pmdp', removeNode);
		var bSpan = removeNodeParent.querySelector('span.pmdp_binding');
		if (bSpan !== null)
			bSpan.innerHTML = '';
		var bInput = removeNodeParent.querySelector('input.pmdp_binding');
		if (bInput !== null)
			bInput.value = '';
		removeNode.style.display = 'none';
		removeNodeParent.classList.remove('fill');
	},
	/**
	 * Open calendar
	 */
	open() {
		this.setActionNodeConf();
		this.generateCalendarNodes();
	},
	/**
	 * Close calendar
	 */
	close() {
		var closeTarget = document.getElementById(this.id);
		if (closeTarget !== null)
			closeTarget.style = 'display: none;';
	},
	/**
	 * Select day & set date to binding places
	 * @param {dayDate} dayDate
	 * @param {dpElement} dayObj
	 */
	selectDay(dayDate, dayObj) {
		this.flagClose = false;
		this.setCalendarDate(dayDate);
		this.setActionNodeData();
		this.addClass(dayObj, 'selected');
		this.displayToBindingElements();
		this.updateCalendar();
		this.actionNode.querySelector('span.pmdp_remove').style.display = 'inline-block';
		this.actionNode.classList.add('fill');

		this.afterSelectDay();
		if (this.config.autoClose === true)
			this.close();
	},
	/**
	 * Set jalali date data to calendar
	 * @param {boolean} jToday
	 */
	jDate(jToday = false) {
		var jd = jDate = '';
		if (this.actionNode !== null && this.actionNode.dataset.jd && jToday === false)
			jd = this.actionNode.dataset.jd;
		else
			jd = gregorian_to_jd(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
		jDate = jd_to_persiana(jd);
		jDate[3] = this.getHour();
		jDate[4] = this.getMinute();
		this.calendar.date = jDate;
		this.calendar.monthDays = this.jalaliMonthDays(jDate[0], jDate[1]);
		this.calendar.weekDay = this.weekDays[this.config.lang].full[jwday(jd)];
		this.calendar.firstMonthWeekDay = this.getFirstMonthWeekDay();
		this.calendar.lastMonthWeekDay = this.getLastMonthWeekDay();
	},
	/**
	 * Set gregorian date data to calendar
	 * @param {boolean} gToday
	 */
	gDate(gToday = false) {
		var d = [this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate()];
		if (this.actionNode !== null && this.actionNode.dataset.jd && gToday === false)
			d = jd_to_gregorian(this.actionNode.dataset.jd);
		d[3] = this.getHour();
		d[4] = this.getMinute();
		this.calendar.date = d;
		this.calendar.monthDays = (new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0)).getDate();
		this.calendar.weekDay = this.weekDays[this.config.lang].full[this.currentDate.getDay()];
		this.calendar.firstMonthWeekDay = this.getFirstMonthWeekDay();
		this.calendar.lastMonthWeekDay = this.getLastMonthWeekDay();
	},
	/**
	 * Get month days count
	 * @param {int} year
	 * @param {int} month
	 * @returns {int}
	 */
	jalaliMonthDays(year, month) {
		if (month >= 1 && month <= 6)
			return 31;
		if (month === 12 && !leap_persiana(year))
			return 29;
		return 30;
	},
	/**
	 * Get first weekday of the month
	 * @returns {int}
	 */
	getFirstMonthWeekDay() {
		var jd = 0;
		if (this.config.lang === 'fa')
			jd = persiana_to_jd(this.calendar.date[0], this.calendar.date[1], 1);
		else
			jd = gregorian_to_jd(this.calendar.date[0], this.calendar.date[1], 1);
		return jwday(jd);
	},
	/**
	 * Get last weekday of the month
	 * @returns {int}
	 */
	getLastMonthWeekDay() {
		var jd = 0;
		if (this.config.lang === 'fa')
			jd = persiana_to_jd(this.calendar.date[0], this.calendar.date[1], this.calendar.monthDays);
		else
			jd = gregorian_to_jd(this.calendar.date[0], this.calendar.date[1], this.calendar.monthDays);
		return jwday(jd);
	},
	/**
	 * Get previus month data
	 * @returns {int}
	 */
	getPrevMonthDays() {
		var days = 0, month = 0, year = 0;
		year = parseInt(this.calendar.date[0]);
		month = parseInt(this.calendar.date[1]) - 1;
		if (month < 1) {
			year -= 1;
			month = 12;
		}

		if (this.config.lang === 'fa') {
			days = this.jalaliMonthDays(year, month);
		} else {
			days = (new Date(year, month, 0)).getDate();
		}
		return days;
	},
	/**
	 * Get next month data
	 * @returns {int}
	 */
	getNextMonthDays() {
		var days = 0, month = 0, year = 0;
		year = parseInt(this.calendar.date[0]);
		month = parseInt(this.calendar.date[1]) + 1;
		if (month > 12) {
			year += 1;
			month = 1;
		}

		if (this.config.lang === 'fa') {
			days = this.jalaliMonthDays(year, month);
		} else {
			days = (new Date(year, month, 0)).getDate();
		}
		return days;
	},
	// getNextMonthDays() {
	// 	var days = 0;
	// 	if (this.config.lang === 'fa') {
	// 		days = (this.calendar.lastMonthWeekDay === 6) ? 6 : 5 - this.calendar.lastMonthWeekDay;
	// 	} else
	// 		days = 6 - this.calendar.lastMonthWeekDay;
	// 	return days;
	// },
	/**
	 * Display timepicker section
	 */
	timeSection() {
		var tp = document.getElementById(this.id).querySelector("section.pmTimepicker");
		tp.style = 'display: block;';
		var dp = document.getElementById(this.id).querySelector("section.pmDaypicker");
		var btnYear = document.getElementById(this.id).querySelector("header.pmdp_header .pmdp_btnYear");
		var btnMonth = document.getElementById(this.id).querySelector("header.pmdp_header .pmdp_btnMonth");
		var wd = document.getElementById(this.id).querySelector(".pmdp_week");
		var footer = document.getElementById(this.id).querySelector("footer.pmdp_footer");
		dp.style = footer.style = btnYear.style = btnMonth.style = wd.style = 'display: none;';
	},
	/**
	 * Display yearpicker section
	 */
	yearSection() {
		var yearSection = document.getElementById(this.id).querySelector("section.pmYearpicker");
		var yearNavigateBtn = document.getElementById(this.id).querySelectorAll('.pmdp_btnYear span');
		yearSection.style = yearNavigateBtn[0].style = yearNavigateBtn[1].style = 'display: block;';
		var dp = document.getElementById(this.id).querySelector("section.pmDaypicker");
		var btnMonth = document.getElementById(this.id).querySelector("header.pmdp_header .pmdp_btnMonth");
		var wd = document.getElementById(this.id).querySelector(".pmdp_week");
		var footer = document.getElementById(this.id).querySelector("footer.pmdp_footer");
		dp.style = footer.style = btnMonth.style = wd.style = 'display: none;';
	},
	/**
	 * Display monthpicker section
	 */
	monthSection() {
		var yearSection = document.getElementById(this.id).querySelector("section.pmMonthpicker");
		yearSection.style = 'display: block;';
		var dp = document.getElementById(this.id).querySelector("section.pmDaypicker");
		var btnYear = document.getElementById(this.id).querySelector("header.pmdp_header .pmdp_btnYear");
		var btnMonth = document.getElementById(this.id).querySelector("header.pmdp_header .pmdp_btnMonth");
		var wd = document.getElementById(this.id).querySelector(".pmdp_week");
		var footer = document.getElementById(this.id).querySelector("footer.pmdp_footer");
		dp.style = footer.style = btnYear.style = btnMonth.style = wd.style = 'display: none;';
	},
	/**
	 * Display daypicker section
	 */
	daySection() {
		var tp = document.getElementById(this.id).querySelector("section.pmTimepicker");
		var monthSection = document.getElementById(this.id).querySelector("section.pmMonthpicker");
		var yearSection = document.getElementById(this.id).querySelector("section.pmYearpicker");
		var yearNavigateBtn = document.getElementById(this.id).querySelectorAll('.pmdp_btnYear span');
		tp.style = monthSection.style = yearSection.style = yearNavigateBtn[0].style = yearNavigateBtn[1].style = 'display: none;';
		var dp = document.getElementById(this.id).querySelector("section.pmDaypicker");
		var btnYear = document.getElementById(this.id).querySelector("header.pmdp_header .pmdp_btnYear");
		var btnMonth = document.getElementById(this.id).querySelector("header.pmdp_header .pmdp_btnMonth");
		var wd = document.getElementById(this.id).querySelector(".pmdp_week");
		var footer = document.getElementById(this.id).querySelector("footer.pmdp_footer");
		dp.style = footer.style = btnYear.style = btnMonth.style = wd.style = 'display: block;';
	},
	/**
	 * Extract hour or minute from time string
	 * @param {time} t (format: "HH:MM")
	 * @returns {Number}
	 */
	timeToArray(t) {
		return t.split(':');
	},
	/**
	 * Get the hour of calendar
	 * @returns {Number}
	 */
	getHour() {
		return (this.actionNode !== null && this.actionNode.dataset.time) ? this.timeToArray(this.actionNode.dataset.time)[0] : '00';
	},
	/**
	 * Get the minute of calendar
	 * @returns {Number}
	 */
	getMinute() {
		return (this.actionNode !== null && this.actionNode.dataset.time) ? this.timeToArray(this.actionNode.dataset.time)[1] : '00';
	},
	/**
	 * Increase 1 hour
	 */
	upHour() {
		var hour = '00';
		var tph = document.getElementById(this.id).querySelector("section.pmTimepicker .tp_hour");
		tphInt = parseInt(tph.dataset.hour) + 1;
		if (tphInt <= 23) {
			hour = this.set2Digit(tphInt);
		}

		tph.innerHTML = this.convertDigit(hour);
		tph.dataset.hour = this.calendar.date[3] = hour;
		this.setActionNodeData();
		this.displayToBindingElements();
	},
	/**
	 * Increase 1 minute
	 */
	upMinute() {
		var minute = '00';
		var tph = document.getElementById(this.id).querySelector("section.pmTimepicker .tp_minute");
		tphInt = parseInt(tph.dataset.minute) + 1;
		if (tphInt <= 59) {
			minute = this.set2Digit(tphInt);
		}

		tph.innerHTML = this.convertDigit(minute);
		tph.dataset.minute = this.calendar.date[4] = minute;
		this.setActionNodeData();
		this.displayToBindingElements();
	},
	/**
	 * Decrease 1 hour
	 */
	downHour() {
		var hour = '23';
		var tph = document.getElementById(this.id).querySelector("section.pmTimepicker .tp_hour");
		tphInt = parseInt(tph.dataset.hour) - 1;
		if (tphInt >= 0) {
			hour = this.set2Digit(tphInt);
		}

		tph.innerHTML = this.convertDigit(hour);
		tph.dataset.hour = this.calendar.date[3] = hour;
		this.setActionNodeData();
		this.displayToBindingElements();
	},
	/**
	 * Decrease 1 minute
	 */
	downMinute() {
		var minute = '59';
		var tph = document.getElementById(this.id).querySelector("section.pmTimepicker .tp_minute");
		tphInt = parseInt(tph.dataset.minute) - 1;
		if (tphInt >= 0) {
			minute = this.set2Digit(tphInt);
		}

		tph.innerHTML = this.convertDigit(minute);
		tph.dataset.minute = this.calendar.date[4] = minute;
		this.setActionNodeData();
		this.displayToBindingElements();
	},
	/**
	 * Add class name to object
	 * @param {dpElement} obj
	 * @param {String} name
	 */
	addClass(obj, name) {
		var e = obj.parentNode.querySelector(('.' + name));
		if (e !== null)
			e.classList.remove(name);
		obj.classList.add(name);
	},
	/**
	 * Display datetime to the elements that has class bindings
	 */
	displayToBindingElements() {
		var spanBinding = this.actionNode.querySelector('span.pmdp_binding');
		if (spanBinding !== null)
			spanBinding.innerHTML = this.displayDate();
		var inputBinding = this.actionNode.querySelector('input.pmdp_binding');
		if (inputBinding !== null)
			inputBinding.value = this.displayDate(false);
	},
	/**
	 * Convert array data to datetime format (yyyy/mm/dd HH:ii)
	 * @param {boolean} persianDigit
	 * @returns {String}
	 */
	displayDate(persianDigit = true) {
		var date = [], result = '';
		if (this.config.epochTime === true && persianDigit === false) {
			date = jd_to_gregorian(this.calendar.jd);
			result = (new Date(date[0] + '/' + date[1] + '/' + date[2] + ' ' + this.calendar.date[3] + ':' + this.calendar.date[4]).getTime() / 1000);
		} else {
			for (var i in this.calendar.date) {
				date[i] = (persianDigit === true) ? this.convertDigit(this.set2Digit(this.calendar.date[i])) : this.set2Digit(this.calendar.date[i]);
			}
			result = date[0] + '/' + date[1] + '/' + date[2] + ' ' + date[3] + ':' + date[4];
		}
		return result;
	},
	/**
	 * Set calendar datetime with array data
	 * @param {array} datetime
	 */
	setCalendarDate(datetime) {
		if (datetime[0])
			this.calendar.date[0] = datetime[0];
		if (datetime[1])
			this.calendar.date[1] = datetime[1];
		if (datetime[2])
			this.calendar.date[2] = datetime[2];
		if (datetime[3])
			this.calendar.date[3] = datetime[3];
		if (datetime[4])
			this.calendar.date[4] = datetime[4];
	},
	/**
	 * Get current date
	 */
	getToday() {
		if (this.config.lang === 'fa')
			this.jDate(true);
		else
			this.gDate(true);
		this.setActionNodeData();
		this.displayToBindingElements();
		this.updateCalendar();
	},
	/**
	 * Update calendar data
	 */
	updateCalendar() {
		this.setActionNodeData();
		this.displayToBindingElements();
		this.newDaypicker();
		var yearNode = this.findYearNode();
		if (yearNode === null) {
			this.newYearpicker();
			yearNode = this.findYearNode();
		}
		this.addClass(yearNode, 'curr');
		document.getElementById(this.id).querySelector('div.pmdp_btnYear label').innerHTML = yearNode.innerHTML;
		var monthNode = this.findMonthNode();
		this.addClass(monthNode, 'curr');
		document.getElementById(this.id).querySelector('div.pmdp_btnMonth label').innerHTML = monthNode.innerHTML;
		this.daySection();
	},
	/**
	 * Check the count of month day
	 */
	checkMonthDay() {
		days = (this.config.lang === 'fa') ? this.jalaliMonthDays(this.calendar.date[0], this.calendar.date[1]) : days = (new Date(this.calendar.date[0], this.calendar.date[1], 0)).getDate();
		if (this.calendar.date[2] > days)
			this.calendar.date[2] = days;
	},
	/**
	 * Get month from monthpicker & set calendar data with selected month
	 * @param {Number} m
	 */
	selectMonth(m) {
		this.calendar.date[1] = parseInt(m) + 1;
		this.checkMonthDay();
		this.updateCalendar();
	},
	/**
	 * Get month node
	 * @returns {Node}
	 */
	findMonthNode() {
		return document.getElementById(this.id).querySelector('section.pmMonthpicker .pm_m' + (parseInt(this.calendar.date[1]) - 1));
	},
	/**
	 * Generate new daypicker
	 */
	newDaypicker() {
		document.getElementById(this.id).querySelector('section.pmDaypicker').innerHTML = this.generateDays();
	},
	/**
	 * Get previous month
	 */
	selectPrevMonth() {
		var month = parseInt(this.calendar.date[1]) - 2;
		if (month < 0) {
			month = 11;
			this.calendar.date[0] = parseInt(this.calendar.date[0]) - 1;
		}
		this.selectMonth(month);
	},
	/**
	 * Get next month
	 */
	selectNextMonth() {
		var month = parseInt(this.calendar.date[1]);
		if (month > 11) {
			month = 0;
			this.calendar.date[0] = parseInt(this.calendar.date[0]) + 1;
		}
		this.selectMonth(month);
	},
	/**
	 * Get year from yearpicker & set calendar data with selected year
	 * @param {Number} y
	 */
	selectYear(y) {
		this.calendar.date[0] = y;
		this.checkMonthDay();
		this.updateCalendar();
	},
	/**
	 * Get year node
	 * @returns {Node}
	 */
	findYearNode() {
		return document.getElementById(this.id).querySelector('section.pmYearpicker .pm_y' + this.calendar.date[0]);
	},
	/**
	 * Generate new yearpicker
	 * @param {Number} yn
	 */
	newYearpicker(yn = null) {
		document.getElementById(this.id).querySelector('section.pmYearpicker').innerHTML = this.generateYear(yn);
	},
	/**
	 * Get next yearpicker list
	 */
	nextYear() {
		var year = document.getElementById(this.id).querySelector('section.pmYearpicker').firstChild.dataset.year;
		this.newYearpicker(parseInt(year) + 16);
	},
	/**
	 * Get previous yearpicker list
	 */
	prevYear() {
		var year = document.getElementById(this.id).querySelector('section.pmYearpicker').firstChild.dataset.year;
		this.newYearpicker(parseInt(year) - 16);
	}
}).run();