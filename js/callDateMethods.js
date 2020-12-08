/*  updateFromGregorian  --  Update all calendars from Gregorian.
                             "Why not Julian date?" you ask.  Because
                             starting from Gregorian guarantees we're
                             already snapped to an integral second, so
                             we don't get roundoff errors in other
                             calendars.  */

function updateFromGregorian()
{
    var j, year, mon, mday, hour, min, sec,
        weekday, julcal, hebcal, islcal, hmindex, utime, isoweek,
        may_countcal, mayhaabcal, maytzolkincal, bahcal, frrcal,
        indcal, isoday, xgregcal;

    year = new Number(document.gregorian.year.value);
    mon = document.gregorian.month.selectedIndex;
    mday = new Number(document.gregorian.day.value);
    hour = min = sec = 0;
    hour = new Number(document.gregorian.hour.value);
    min = new Number(document.gregorian.min.value);
    sec = new Number(document.gregorian.sec.value);

    //  Update Julian day

    j = gregorian_to_jd(year, mon + 1, mday) +
           (Math.floor(sec + 60 * (min + 60 * hour) + 0.5) / 86400.0);

    document.julianday.day.value = j;
    document.modifiedjulianday.day.value = j - JMJD;

    //  Update day of week in Gregorian box

    weekday = jwday(j);
    document.gregorian.wday.value = Weekdays[weekday];

    //  Update leap year status in Gregorian box

    document.gregorian.leap.value = NormLeap[leap_gregorian(year) ? 1 : 0];

    //  Update Julian Calendar

    julcal = jd_to_julian(j);
    document.juliancalendar.year.value = julcal[0];
    document.juliancalendar.month.selectedIndex = julcal[1] - 1;
    document.juliancalendar.day.value = julcal[2];
    document.juliancalendar.leap.value = NormLeap[leap_julian(julcal[0]) ? 1 : 0];
    weekday = jwday(j);
    document.juliancalendar.wday.value = Weekdays[weekday];

    //  Update Hebrew Calendar

    hebcal = jd_to_hebrew(j);
    if (hebrew_leap(hebcal[0])) {
        document.hebrew.month.options.length = 13;
        document.hebrew.month.options[11] = new Option("Adar I");
        document.hebrew.month.options[12] = new Option("Veadar");
    } else {
        document.hebrew.month.options.length = 12;
        document.hebrew.month.options[11] = new Option("Adar");
    }
    document.hebrew.year.value = hebcal[0];
    document.hebrew.month.selectedIndex = hebcal[1] - 1;
    document.hebrew.day.value = hebcal[2];
    hmindex = hebcal[1];
    if (hmindex == 12 && !hebrew_leap(hebcal[0])) {
        hmindex = 14;
    }
    document.hebrew.hebmonth.src = "figures/hebrew_month_" +
        hmindex + ".gif";
    switch (hebrew_year_days(hebcal[0])) {
        case 353:
            document.hebrew.leap.value = "Common deficient (353 days)";
            break;

        case 354:
            document.hebrew.leap.value = "Common regular (354 days)";
            break;

        case 355:
            document.hebrew.leap.value = "Common complete (355 days)";
            break;

        case 383:
            document.hebrew.leap.value = "Embolismic deficient (383 days)";
            break;

        case 384:
            document.hebrew.leap.value = "Embolismic regular (384 days)";
            break;

        case 385:
            document.hebrew.leap.value = "Embolismic complete (385 days)";
            break;

        default:
            document.hebrew.leap.value = "Invalid year length: " +
                hebrew_year_days(hebcal[0]) + " days.";
            break;
    }

    //  Update Islamic Calendar

    islcal = jd_to_islamic(j);
    document.islamic.year.value = islcal[0];
    document.islamic.month.selectedIndex = islcal[1] - 1;
    document.islamic.day.value = islcal[2];
    document.islamic.wday.value = "yawm " + ISLAMIC_WEEKDAYS[weekday];
    document.islamic.leap.value = NormLeap[leap_islamic(islcal[0]) ? 1 : 0];

    //  Update Persian Calendar

    perscal = jd_to_persian(j);
    document.persian.year.value = perscal[0];
    document.persian.month.selectedIndex = perscal[1] - 1;
    document.persian.day.value = perscal[2];
    document.persian.wday.value = PERSIAN_WEEKDAYS[weekday];
    document.persian.leap.value = NormLeap[leap_persian(perscal[0]) ? 1 : 0];

    //  Update Persian Astronomical Calendar

    perscal = jd_to_persiana(j);
    document.persiana.year.value = perscal[0];
    document.persiana.month.selectedIndex = perscal[1] - 1;
    document.persiana.day.value = perscal[2];
    document.persiana.wday.value = PERSIAN_WEEKDAYS[weekday];
    document.persiana.leap.value = NormLeap[leap_persiana(perscal[0]) ? 1 : 0];

    //  Update Mayan Calendars

    may_countcal = jd_to_mayan_count(j);
    document.mayancount.baktun.value = may_countcal[0];
    document.mayancount.katun.value = may_countcal[1];
    document.mayancount.tun.value = may_countcal[2];
    document.mayancount.uinal.value = may_countcal[3];
    document.mayancount.kin.value = may_countcal[4];
    mayhaabcal = jd_to_mayan_haab(j);
    document.mayancount.haab.value = "" + mayhaabcal[1] + " " + MAYAN_HAAB_MONTHS[mayhaabcal[0] - 1];
    maytzolkincal = jd_to_mayan_tzolkin(j);
    document.mayancount.tzolkin.value = "" + maytzolkincal[1] + " " + MAYAN_TZOLKIN_MONTHS[maytzolkincal[0] - 1];

    //  Update Bahai Calendar

    bahcal = jd_to_bahai(j);
    document.bahai.kull_i_shay.value = bahcal[0];
    document.bahai.vahid.value = bahcal[1];
    document.bahai.year.selectedIndex = bahcal[2] - 1;
    document.bahai.month.selectedIndex = bahcal[3] - 1;
    document.bahai.day.selectedIndex = bahcal[4] - 1;
    document.bahai.weekday.value = BAHAI_WEEKDAYS[weekday];
    document.bahai.leap.value = NormLeap[leap_gregorian(year) ? 1 : 0];  // Bahai uses same leap rule as Gregorian

    //  Update Indian Civil Calendar

    indcal = jd_to_indian_civil(j);
    document.indiancivilcalendar.year.value = indcal[0];
    document.indiancivilcalendar.month.selectedIndex = indcal[1] - 1;
    document.indiancivilcalendar.day.value = indcal[2];
    document.indiancivilcalendar.weekday.value = INDIAN_CIVIL_WEEKDAYS[weekday];
    document.indiancivilcalendar.leap.value = NormLeap[leap_gregorian(indcal[0] + 78) ? 1 : 0];

    //  Update French Republican Calendar

    frrcal = jd_to_french_revolutionary(j);
    document.french.an.value = frrcal[0];
    document.french.mois.selectedIndex = frrcal[1] - 1;
    document.french.decade.selectedIndex = frrcal[2] - 1;
    document.french.jour.selectedIndex = ((frrcal[1] <= 12) ? frrcal[3] : (frrcal[3] + 11)) - 1;

    //  Update Gregorian serial number

    if (document.gregserial != null) {
        document.gregserial.day.value = j - J0000;
    }

    //  Update Excel 1900 and 1904 day serial numbers

    document.excelserial1900.day.value = (j - J1900) + 1 +
            /*  Microsoft marching morons thought 1900 was a leap year.
                Adjust dates after 1900-02-28 to compensate for their
                idiocy.  */
            ((j > 2415078.5) ? 1 : 0)
        ;
    document.excelserial1904.day.value = j - J1904;

    //  Update Unix time()

    utime = (j - J1970) * (60 * 60 * 24 * 1000);
    document.unixtime.time.value = Math.round(utime / 1000);

    //  Update ISO Week

    isoweek = jd_to_iso(j);
    document.isoweek.year.value = isoweek[0];
    document.isoweek.week.value = isoweek[1];
    document.isoweek.day.value = isoweek[2];

    //  Update ISO Day

    isoday = jd_to_iso_day(j);
    document.isoday.year.value = isoday[0];
    document.isoday.day.value = isoday[1];
}

//  calcGregorian  --  Perform calculation starting with a Gregorian date

function calcGregorian()
{
    updateFromGregorian();
}

//  calcJulian  --  Perform calculation starting with a Julian date

function calcJulian()
{
    var j, date, time;

    j = new Number(document.julianday.day.value);
    date = jd_to_gregorian(j);
    time = jhms(j);
    document.gregorian.year.value = date[0];
    document.gregorian.month.selectedIndex = date[1] - 1;
    document.gregorian.day.value = date[2];
    document.gregorian.hour.value = pad(time[0], 2, " ");
    document.gregorian.min.value = pad(time[1], 2, "0");
    document.gregorian.sec.value = pad(time[2], 2, "0");
    updateFromGregorian();
}

//  setJulian  --  Set Julian date and update all calendars

function setJulian(j)
{
    document.julianday.day.value = new Number(j);
    calcJulian();
}

//  calcModifiedJulian  --  Update from Modified Julian day

function calcModifiedJulian()
{
    setJulian((new Number(document.modifiedjulianday.day.value)) + JMJD);
}

//  calcJulianCalendar  --  Update from Julian calendar

function calcJulianCalendar()
{
    setJulian(julian_to_jd((new Number(document.juliancalendar.year.value)),
                           document.juliancalendar.month.selectedIndex + 1,
                           (new Number(document.juliancalendar.day.value))));
}

//  calcHebrew  --  Update from Hebrew calendar

function calcHebrew()
{
    setJulian(hebrew_to_jd((new Number(document.hebrew.year.value)),
                          document.hebrew.month.selectedIndex + 1,
                          (new Number(document.hebrew.day.value))));
}

//  calcIslamic  --  Update from Islamic calendar

function calcIslamic()
{
    setJulian(islamic_to_jd((new Number(document.islamic.year.value)),
                           document.islamic.month.selectedIndex + 1,
                           (new Number(document.islamic.day.value))));
}

//  calcPersian  --  Update from Persian calendar

function calcPersian()
{
    setJulian(persian_to_jd((new Number(document.persian.year.value)),
                           document.persian.month.selectedIndex + 1,
                           (new Number(document.persian.day.value))));
}

//  calcPersiana  --  Update from Persian astronomical calendar

function calcPersiana()
{
    setJulian(persiana_to_jd((new Number(document.persiana.year.value)),
                           document.persiana.month.selectedIndex + 1,
                           (new Number(document.persiana.day.value))) + 0.5);
}

//  calcMayanCount  --  Update from the Mayan Long Count

function calcMayanCount()
{
    setJulian(mayan_count_to_jd((new Number(document.mayancount.baktun.value)),
                                (new Number(document.mayancount.katun.value)),
                                (new Number(document.mayancount.tun.value)),
                                (new Number(document.mayancount.uinal.value)),
                                (new Number(document.mayancount.kin.value))));
}

//  calcBahai  --  Update from Bahai calendar

function calcBahai()
{
    setJulian(bahai_to_jd((new Number(document.bahai.kull_i_shay.value)),
                          (new Number(document.bahai.vahid.value)),
                          document.bahai.year.selectedIndex + 1,
                          document.bahai.month.selectedIndex + 1,
                          document.bahai.day.selectedIndex + 1));
}

//  calcIndianCivilCalendar  --  Update from Indian Civil Calendar

function calcIndianCivilCalendar()
{
    setJulian(indian_civil_to_jd(
                           (new Number(document.indiancivilcalendar.year.value)),
                           document.indiancivilcalendar.month.selectedIndex + 1,
                           (new Number(document.indiancivilcalendar.day.value))));
}

//  calcFrench  -- Update from French Republican calendar

function calcFrench()
{
    var decade, j, mois;

    j = document.french.jour.selectedIndex;
    decade = document.french.decade.selectedIndex;
    mois = document.french.mois.selectedIndex;

    /*  If the currently selected day is one of the sansculottides,
        adjust the index to be within that period and force the
        decade to zero and the month to 12, designating the
        intercalary interval.  */

    if (j > 9) {
        j -= 11;
        decade = 0;
        mois = 12;
    }

    /*  If the selected month is the pseudo-month of the five or
        six sansculottides, ensure that the decade is 0 and the day
        number doesn't exceed six.  To avoid additional overhead, we
        don't test whether a day number of 6 is valid for this year,
        but rather simply permit it to wrap into the first day of
        the following year if this is a 365 day year.  */

    if (mois == 12) {
        decade = 0;
        if (j > 5) {
            j = 0;
        }
    }

    setJulian(french_revolutionary_to_jd((new Number(document.french.an.value)),
                                         mois + 1,
                                         decade + 1,
                                         j + 1));
}

//  calcGregSerial  --  Update from Gregorian serial day number

function calcGregSerial()
{
    setJulian((new Number(document.gregserial.day.value)) + J0000);
}

//  calcExcelSerial1900  --  Perform calculation starting with an Excel 1900 serial date

function calcExcelSerial1900()
{
    var d = new Number(document.excelserial1900.day.value);

    /* Idiot Kode Kiddies didn't twig to the fact
       (proclaimed in 1582) that 1900 wasn't a leap year,
       so every Excel day number in every database on Earth
       which represents a date subsequent to February 28,
       1900 is off by one.  Note that there is no
       acknowledgement of this betrayal or warning of its
       potential consequences in the Excel help file.  Thank
       you so much Mister Talking Paper Clip.  Some day
       we're going to celebrate your extinction like it was
       February 29 ... 1900.  */

    if (d > 60) {
        d--;
    }

    setJulian((d - 1) + J1900);
}

//  calcExcelSerial1904  --  Perform calculation starting with an Excel 1904 serial date

function calcExcelSerial1904()
{
    setJulian((new Number(document.excelserial1904.day.value)) + J1904);
}

//  calcUnixTime  --  Update from specified Unix time() value

function calcUnixTime()
{
    var t = new Number(document.unixtime.time.value);

    setJulian(J1970 + (t / (60 * 60 * 24)));
}

//  calcIsoWeek  --  Update from specified ISO year, week, and day

function calcIsoWeek()
{
    var year = new Number(document.isoweek.year.value),
        week = new Number(document.isoweek.week.value),
        day = new Number(document.isoweek.day.value);

    setJulian(iso_to_julian(year, week, day));
}

//  calcIsoDay  --  Update from specified ISO year and day of year

function calcIsoDay()
{
    var year = new Number(document.isoday.year.value),
        day = new Number(document.isoday.day.value);

    setJulian(iso_day_to_julian(year, day));
}


/*  setDateToToday  --  Preset the fields in
    the request form to today's date.  */

function setDateToToday()
{
    var today = new Date();

    /*  The following idiocy is due to bizarre incompatibilities
        in the behaviour of getYear() between Netscrape and
        Exploder.  The ideal solution is to use getFullYear(),
        which returns the actual year number, but that would
        break this code on versions of JavaScript prior to
        1.2.  So, for the moment we use the following code
        which works for all versions of JavaScript and browsers
        for all year numbers greater than 1000.  When we're willing
        to require JavaScript 1.2, this may be replaced by
        the single line:

            document.gregorian.year.value = today.getFullYear();

        Thanks to Larry Gilbert for pointing out this problem.
    */

    var y = today.getYear();
    if (y < 1000) {
        y += 1900;
    }

    document.gregorian.year.value = y;
    document.gregorian.month.selectedIndex = today.getMonth();
    document.gregorian.day.value = today.getDate();
    document.gregorian.hour.value =
    document.gregorian.min.value =
    document.gregorian.sec.value = "00";
}

/*  presetDataToRequest  --  Preset the Gregorian date to the
    	    	    	     date requested by the URL
			     search field.  */
			     
function presetDataToRequest(s)
{
    var eq = s.indexOf("=");
    var set = false;
    if (eq != -1) {
    	var calendar = s.substring(0, eq),
	    date = decodeURIComponent(s.substring(eq + 1));
	if (calendar.toLowerCase() == "gregorian") {
	    var d = date.match(/^(\d+)\D(\d+)\D(\d+)(\D\d+)?(\D\d+)?(\D\d+)?/);
	    if (d != null) {
	    	// Sanity check date and time components
	    	if ((d[2] >= 1) && (d[2] <= 12) &&
		    (d[3] >= 1) && (d[3] <= 31) &&
		    ((d[4] == undefined) ||
		    	((d[4].substring(1) >= 0) && (d[4].substring(1) <= 23))) &&
		    ((d[5] == undefined) ||
		    	((d[5].substring(1) >= 0) && (d[5].substring(1) <= 59))) &&
		    ((d[6] == undefined) ||
		    	((d[6].substring(1) >= 0) && (d[6].substring(1) <= 59)))) {
		    document.gregorian.year.value = d[1];
		    document.gregorian.month.selectedIndex = d[2] - 1;
		    document.gregorian.day.value = Number(d[3]);
		    document.gregorian.hour.value = d[4] == undefined ? "00" :
			d[4].substring(1);
		    document.gregorian.min.value = d[5] == undefined ? "00" :
			d[5].substring(1);
    	    	    document.gregorian.sec.value = d[6] == undefined ? "00" :
			d[6].substring(1);
		    calcGregorian();
		    set = true;
		} else {
	    	    alert("Invalid Gregorian date \"" + date +
			"\" in search request");
		}
	    } else {
	    	alert("Invalid Gregorian date \"" + date +
		    "\" in search request");
	    }
	    
	} else if (calendar.toLowerCase() == "julian") {
	    var d = date.match(/^(\d+)\D(\d+)\D(\d+)(\D\d+)?(\D\d+)?(\D\d+)?/);
	    if (d != null) {
	    	// Sanity check date and time components
	    	if ((d[2] >= 1) && (d[2] <= 12) &&
		    (d[3] >= 1) && (d[3] <= 31) &&
		    ((d[4] == undefined) ||
		    	((d[4].substring(1) >= 0) && (d[4].substring(1) <= 23))) &&
		    ((d[5] == undefined) ||
		    	((d[5].substring(1) >= 0) && (d[5].substring(1) <= 59))) &&
		    ((d[6] == undefined) ||
		    	((d[6].substring(1) >= 0) && (d[6].substring(1) <= 59)))) {
		    document.juliancalendar.year.value = d[1];
		    document.juliancalendar.month.selectedIndex = d[2] - 1;
		    document.juliancalendar.day.value = Number(d[3]);
		    calcJulianCalendar();
		    document.gregorian.hour.value = d[4] == undefined ? "00" :
			d[4].substring(1);
		    document.gregorian.min.value = d[5] == undefined ? "00" :
			d[5].substring(1);
    	    	    document.gregorian.sec.value = d[6] == undefined ? "00" :
			d[6].substring(1);
		    set = true;
		} else {
	    	    alert("Invalid Julian calendar date \"" + date +
			"\" in search request");
		}
	    } else {
	    	alert("Invalid Julian calendar date \"" + date +
		    "\" in search request");
	    }

	} else if (calendar.toLowerCase() == "jd") {
	    var d = date.match(/^(\-?\d+\.?\d*)/);
	    if (d != null) {
	    	setJulian(d[1]);
		set = 1;
	    } else {
	    	alert("Invalid Julian day \"" + date +
		    "\" in search request");
	    }
	    
	} else if (calendar.toLowerCase() == "mjd") {
	    var d = date.match(/^(\-?\d+\.?\d*)/);
	    if (d != null) {
	    	document.modifiedjulianday.day.value = d[1];
	    	calcModifiedJulian();
		set = 1;
	    } else {
	    	alert("Invalid Modified Julian day \"" + date +
		    "\" in search request");
	    }
	    
	} else if (calendar.toLowerCase() == "unixtime") {
	    var d = date.match(/^(\-?\d+\.?\d*)/);
	    if (d != null) {
	    	document.unixtime.time.value = d[1];
	    	calcUnixTime();
		set = 1;
	    } else {
	    	alert("Invalid Modified Julian day \"" + date +
		    "\" in search request");
	    }
	    
	} else if (calendar.toLowerCase() == "iso") {
	    var d;
	    if ((d = date.match(/^(\-?\d+)\-(\d\d\d)/)) != null) {
	    	document.isoday.year.value = d[1];
		document.isoday.day.value= d[2];
	    	calcIsoDay();
		set = 1;
	    } else if ((d = date.match(/^(\-?\d+)\-?W(\d\d)\-?(\d)/i)) != null) {
    	    	document.isoweek.year.value = d[1];
    	    	document.isoweek.week.value = d[2];
    	    	document.isoweek.day.value = d[3];
	    	calcIsoWeek();
		set = 1;
	    } else {
	    	alert("Invalid ISO-8601 date \"" + date +
		    "\" in search request");
	    }
	    
	} else if (calendar.toLowerCase() == "excel") {
	    var d = date.match(/^(\-?\d+\.?\d*)/);
	    if (d != null) {
	    	document.excelserial1900.day.value = d[1];
	    	calcExcelSerial1900();
		set = 1;
	    } else {
	    	alert("Invalid Excel serial day (1900/PC) \"" + date +
		    "\" in search request");
	    }
	    
	} else if (calendar.toLowerCase() == "excel1904") {
	    var d = date.match(/^(\-?\d+\.?\d*)/);
	    if (d != null) {
	    	document.excelserial1904.day.value = d[1];
	    	calcExcelSerial1904();
		set = 1;
	    } else {
	    	alert("Invalid Excel serial day (1904/Mac) \"" + date +
		    "\" in search request");
	    }
	
	} else {
	    alert("Invalid calendar \"" + calendar +
	    	"\" in search request");
	}
    } else {
    	alert("Invalid search request: " + s);
    }
    
    if (!set) {
    	setDateToToday();
	calcGregorian();
    }
}
