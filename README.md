PM-Datepicker for En & Fa

Jalali or Gregorian Datepicker

Version : 1.0.0

Free License To Use, Debug & Add Features

Site : https://peetup.com

Use http://www.fourmilab.ch/documents/calendar

Features :

    Digit Convertor
    Change Language
    Select Calendar (Jalali or Gregorian)
    Auto Close
    Today or Set default date
    Trigger before or after generate datepicker
    Trigger after select day
    Change template
    Change labels
    Configuring Datepicker
    Time Picker
    Get Epoch DateTime or Timestamp
    Show date on label or input element
    
How to use :

on HTML head tag :

    <link rel="stylesheet" href="css/pm_datepicker.css" />
    <script type="text/javascript" language="JavaScript" src="js/calendar.js"></script>
    
on end of body tag :

    <div class="call_datepicker">
    
        <div class="pmdp" data-jd="2457711.5" data-time="22:30" data-config="{
            'input': true,
            'binding' : true,
            'lang' : 'en',
            'currentDate' : '2016/01/2 4:39',
            'autoClose' : false,
            'otherMonth' : true,
            'epochTime' : true
        }"></div>
    
        <div class="pmdp" data-jd="2457711.5" data-time="20:32" data-config="{
             'epochTime' : true
        }"></div>
    
        <div class="pmdp" data-jd="2458711.5" data-time="20:32" data-config="{
            'input': false,
            'binding' : true,
            'lang' : 'en',
            'autoClose' : true,
            'otherMonth' : false,
            'epochTime' : false
        }"></div>
        
    </div>
    <script src="js/pm_datepicker.js"></script>

Todo :
    
    filters :
     * Bind every input on initBinding
     * Switch calendar (between gregorian & jalali)
     * Min date
     * Max date
     * Disable dates
     * Result formats