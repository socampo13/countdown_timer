 (function() {
    "use strict";

    // ----- DOM refs -----
    const eventNameInput = document.getElementById('eventName');
    const eventDateInput = document.getElementById('eventDate');
    const eventTimeInput = document.getElementById('eventTime');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const warningEl = document.getElementById('warningMessage');
    const eventDisplay = document.getElementById('eventDisplay');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const emptyState = document.getElementById('emptyState');
    const saveBtn = document.getElementById('saveEventBtn');
    const clearSavedBtn = document.getElementById('clearSavedBtn');

    // ----- state -----
    let countdownInterval = null;
    let currentEvent = {
      name: '',
      targetDate: null,        // Date object
    };
    let isCounting = false;
    let savedEvent = null;      // { name, dateString, timeString }

    // ----- helpers / validation -----
    function showWarning(msg) {
      warningEl.textContent = msg || '';
    }

    function clearWarning() {
      warningEl.textContent = '';
    }

    // parse date + optional time, returns Date or null if invalid
    function parseEventDateTime(dateStr, timeStr) {
      if (!dateStr) return null;
      // if time is empty, use '00:00' (midnight)
      const t = (timeStr && timeStr.trim().length > 0) ? timeStr.trim() : '00:00';
      const iso = `${dateStr}T${t}:00`;
      const d = new Date(iso);
      if (isNaN(d.getTime())) return null;
      return d;
    }

    // check overflow: maximum 30 days? we set 100 days as limit for demo (reasonable)
    // but we want to warn if overflow beyond ~ 100 days? Actually we can count any range.
    // We'll warn if difference > 1000 days? but just to keep it practical:
    // The spec says warn if time until event would overflow precision (e.g. > 99 days?)
    // We'll use a practical limit of 999 days (since we only display days as integer)
    function isOverflow(targetDate) {
      if (!targetDate) return true;
      const now = new Date();
      const diffMs = targetDate.getTime() - now.getTime();
      if (diffMs <= 0) return false; // already passed
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      return diffDays > 999;  // overflow if more than 999 days (display stays reasonable)
    }

    // ----- update timer display -----
    function updateTimerDisplay(targetDate, eventName) {
      if (!targetDate || isNaN(targetDate.getTime())) {
        // show empty state
        daysEl.textContent = '--';
        hoursEl.textContent = '--';
        minutesEl.textContent = '--';
        secondsEl.textContent = '--';
        eventDisplay.textContent = eventName ? `📅 ${eventName}` : '⏳ No event';
        emptyState.style.display = 'block';
        return;
      }

      const now = new Date();
      let diffMs = targetDate.getTime() - now.getTime();

      if (diffMs <= 0) {
        // event reached
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        eventDisplay.textContent = `🎉 ${eventName || 'Event'} reached!`;
        emptyState.style.display = 'none';
        if (countdownInterval) {
          clearInterval(countdownInterval);
          countdownInterval = null;
          isCounting = false;
        }
        // bonus: alert when reached
        alert(`🎉 Event "${eventName || 'Event'}" has arrived!`);
        return;
      }

      // compute components
      const totalSec = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');

      eventDisplay.textContent = `⏳ ${eventName || 'Event'}`;
      emptyState.style.display = 'none';
    }

    // ----- start countdown -----
    function startCountdown(eventName, targetDate) {
      // clear any previous interval
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }

      if (!targetDate || isNaN(targetDate.getTime())) {
        showWarning('Invalid date or time.');
        return false;
      }

      const now = new Date();
      if (targetDate.getTime() <= now.getTime()) {
        showWarning('Event date must be in the future.');
        return false;
      }

      if (isOverflow(targetDate)) {
        showWarning('Event date is too far in the future (overflow). Please pick a date within 999 days.');
        return false;
      }

      // everything is valid
      clearWarning();
      isCounting = true;
      currentEvent.name = eventName.trim() || 'Unnamed Event';
      currentEvent.targetDate = targetDate;

      // update display immediately
      updateTimerDisplay(targetDate, currentEvent.name);

      // start interval
      countdownInterval = setInterval(() => {
        if (!currentEvent.targetDate) {
          clearInterval(countdownInterval);
          countdownInterval = null;
          isCounting = false;
          return;
        }
        const now2 = new Date();
        if (now2 >= currentEvent.targetDate) {
          // event reached
          updateTimerDisplay(currentEvent.targetDate, currentEvent.name);
          // interval will be cleared inside updateTimerDisplay when diff <= 0
          // but we stop it here to be safe
          if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            isCounting = false;
          }
        } else {
          updateTimerDisplay(currentEvent.targetDate, currentEvent.name);
        }
      }, 1000);

      return true;
    }

    // ----- reset (stop countdown, clear display) -----
    function resetCountdown() {
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
      isCounting = false;
      currentEvent.name = '';
      currentEvent.targetDate = null;
      daysEl.textContent = '--';
      hoursEl.textContent = '--';
      minutesEl.textContent = '--';
      secondsEl.textContent = '--';
      eventDisplay.textContent = '⏳ No event';
      emptyState.style.display = 'block';
      clearWarning();
    }

    // ----- load from form and start -----
    function handleStart() {
      const name = eventNameInput.value.trim();
      const dateStr = eventDateInput.value;
      const timeStr = eventTimeInput.value;

      if (!name) {
        showWarning('Event name is required.');
        return;
      }

      if (!dateStr) {
        showWarning('Please select a date.');
        return;
      }

      const targetDate = parseEventDateTime(dateStr, timeStr);
      if (!targetDate) {
        showWarning('Invalid date or time format.');
        return;
      }

      const now = new Date();
      if (targetDate.getTime() <= now.getTime()) {
        showWarning('Event must be in the future.');
        return;
      }

      if (isOverflow(targetDate)) {
        showWarning('Event date exceeds 999 days (overflow). Please choose a closer date.');
        return;
      }

      // all good
      clearWarning();
      startCountdown(name, targetDate);
    }

    // ----- save event (bonus) -----
    function saveCurrentEvent() {
      const name = eventNameInput.value.trim();
      const dateStr = eventDateInput.value;
      const timeStr = eventTimeInput.value;
      if (!name || !dateStr) {
        showWarning('Cannot save: event name and date required.');
        return;
      }
      const targetDate = parseEventDateTime(dateStr, timeStr);
      if (!targetDate || isNaN(targetDate.getTime())) {
        showWarning('Cannot save: invalid date/time.');
        return;
      }
      savedEvent = { name, dateString: dateStr, timeString: timeStr || '' };
      // persist to localStorage
      try {
        localStorage.setItem('countdown_saved_event', JSON.stringify(savedEvent));
      } catch (e) { /* ignore */ }
      showWarning('✅ Event saved!');
      setTimeout(clearWarning, 2000);
    }

    function loadSavedEvent() {
      try {
        const raw = localStorage.getItem('countdown_saved_event');
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed && parsed.name && parsed.dateString) {
          return parsed;
        }
      } catch (e) { /* ignore */ }
      return null;
    }

    function applySavedEventToForm() {
      const saved = loadSavedEvent();
      if (!saved) return false;
      eventNameInput.value = saved.name || '';
      eventDateInput.value = saved.dateString || '';
      eventTimeInput.value = saved.timeString || '';
      return true;
    }

    function clearSaved() {
      localStorage.removeItem('countdown_saved_event');
      savedEvent = null;
      showWarning('🗑️ Saved event cleared');
      setTimeout(clearWarning, 1500);
    }

    // ----- initialization: load saved, set default, auto-start? -----
    function init() {
      // Set default date to 2026-12-31 (already in html)
      // try to load saved event
      const hasSaved = applySavedEventToForm();
      if (hasSaved) {
        // optionally auto-start? we don't auto-start to keep it clean.
        // but we can fill fields
        showWarning('📂 Saved event loaded. Press Start.');
        setTimeout(clearWarning, 2500);
      }

      // event listeners
      startBtn.addEventListener('click', handleStart);

      resetBtn.addEventListener('click', function() {
        resetCountdown();
        // also clear warning
        clearWarning();
        // set default example? we keep existing values
      });

      saveBtn.addEventListener('click', saveCurrentEvent);

      clearSavedBtn.addEventListener('click', clearSaved);

      // initial display: empty
      resetCountdown();

      // if there's a saved event but not started, show it in display
      if (hasSaved) {
        const saved = loadSavedEvent();
        if (saved) {
          const target = parseEventDateTime(saved.dateString, saved.timeString);
          if (target && target.getTime() > new Date().getTime()) {
            eventDisplay.textContent = `📌 ${saved.name}`;
          }
        }
      }
    }

    // extra: if the user types a valid date, we could preview, but not required.
    init();
  })();