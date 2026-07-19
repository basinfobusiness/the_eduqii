(function(window){
  var FORECAST_KEY = 'quizForecasts';
  var REMINDER_KEY = 'quizReminders';
  var scheduled = {};

  function _read(key, fallback){
    try { return JSON.parse(localStorage.getItem(key) || (fallback===undefined?null:JSON.stringify(fallback))); }
    catch(e){ return fallback===undefined?null:fallback; }
  }
  function _write(key, value){
    try { localStorage.setItem(key, JSON.stringify(value)); } catch(e){ console.error('quiz-storage write failed', e); }
  }

  function getForecasts(){ return _read(FORECAST_KEY, {} ) || {}; }
  function saveForecast(title, forecast){
    if(!title) return;
    var map = getForecasts();
    map[title] = forecast || '';
    _write(FORECAST_KEY, map);
  }

  function getReminders(){ return _read(REMINDER_KEY, [] ) || []; }
  function saveReminder(reminder){
    try {
      var list = getReminders();
      list.push(reminder);
      _write(REMINDER_KEY, list);
    } catch(e){ console.error(e); }
  }

  function scheduleInPageReminder(id, startDate, title, callback){
    try {
      if (!startDate || isNaN(startDate.getTime())) return;
      var now = new Date();
      var ms = startDate.getTime() - now.getTime();
      if (ms <= 0) return;
      var max = 2147483647; // setTimeout limit
      if (ms > max) return; // can't reliably schedule
      if (scheduled[id]) clearTimeout(scheduled[id]);
      scheduled[id] = setTimeout(function(){
        try{ callback && callback(id, title); } catch(e){}
      }, ms);
    } catch(e){ console.error(e); }
  }

  window.quizStorage = {
    getForecasts: getForecasts,
    saveForecast: saveForecast,
    getReminders: getReminders,
    saveReminder: saveReminder,
    scheduleInPageReminder: scheduleInPageReminder
  };
})(window);
