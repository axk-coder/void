(function () {
  var isTouchOnly =
    window.matchMedia &&
    window.matchMedia('(pointer: coarse) and (hover: none)').matches;
  if (!isTouchOnly) return;

  var ROWS = [
    [
      ['1','Digit1',49],['2','Digit2',50],['3','Digit3',51],['4','Digit4',52],['5','Digit5',53],
      ['6','Digit6',54],['7','Digit7',55],['8','Digit8',56],['9','Digit9',57],['0','Digit0',48]
    ],
    [
      ['q','KeyQ',81],['w','KeyW',87],['e','KeyE',69],['r','KeyR',82],['t','KeyT',84],
      ['y','KeyY',89],['u','KeyU',85],['i','KeyI',73],['o','KeyO',79],['p','KeyP',80]
    ],
    [
      ['a','KeyA',65],['s','KeyS',83],['d','KeyD',68],['f','KeyF',70],['g','KeyG',71],
      ['h','KeyH',72],['j','KeyJ',74],['k','KeyK',75],['l','KeyL',76]
    ],
    [
      ['shift','ShiftLeft',16,'wide','⇧'],
      ['z','KeyZ',90],['x','KeyX',88],['c','KeyC',67],['v','KeyV',86],
      ['b','KeyB',66],['n','KeyN',78],['m','KeyM',77],
      ['backspace','Backspace',8,'wide','⌫']
    ],
    [
      ['space',' ','Space',32,'space','space'],
      ['enter','Enter',13,'wide','⏎']
    ]
  ];

  var canvas = document.getElementById('unity-canvas');
  var vk = document.createElement('div');
  vk.id = 'vk';
  document.body.appendChild(vk);

  requestAnimationFrame(function () {
    window.dispatchEvent(new Event('resize'));
  });

  if (typeof ResizeObserver !== 'undefined') {
    var ro = new ResizeObserver(function () {
      window.dispatchEvent(new Event('resize'));
    });
    ro.observe(vk);
  }

  var shiftActive = false;
  var shiftKeys = [];

  function makeKey(spec) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'vk-key';

    var keyName, code, keyCode, modifier, label;

    if (spec[0] === 'space') {
      keyName = ' ';
      code = 'Space';
      keyCode = 32;
      modifier = 'space';
      label = 'space';
    } else if (spec[0] === 'shift') {
      keyName = 'Shift';
      code = 'ShiftLeft';
      keyCode = 16;
      modifier = spec[3] || '';
      label = spec[4] || '⇧';
      btn.classList.add('vk-shift');
      shiftKeys.push(btn);
    } else if (spec[0] === 'backspace') {
      keyName = 'Backspace';
      code = 'Backspace';
      keyCode = 8;
      modifier = spec[3] || '';
      label = spec[4] || '⌫';
    } else if (spec[0] === 'enter') {
      keyName = 'Enter';
      code = 'Enter';
      keyCode = 13;
      modifier = spec[3] || '';
      label = spec[4] || '⏎';
    } else if (spec[0] === 'comma') {
      keyName = ',';
      code = 'Comma';
      keyCode = 188;
      modifier = spec[3] || '';
      label = spec[4] || ',';
    } else {
      keyName = spec[0];
      code = spec[1];
      keyCode = spec[2];
      modifier = spec[3] || '';
      label = spec[4];
    }

    if (modifier) {
      modifier.split(' ').forEach(function (m) {
        if (m === 'wide') btn.classList.add('vk-wide');
        if (m === 'space') btn.classList.add('vk-space');
      });
    }

    btn.dataset.kname = keyName;
    btn.dataset.kcode = code;
    btn.dataset.kkey = String(keyCode);

    if (label) {
      btn.textContent = label;
    } else {
      btn.textContent = keyName.toUpperCase();
      btn.dataset.alpha = '1';
    }

    return btn;
  }

  ROWS.forEach(function (row) {
    var rowEl = document.createElement('div');
    rowEl.className = 'vk-row';
    row.forEach(function (spec) {
      rowEl.appendChild(makeKey(spec));
    });
    vk.appendChild(rowEl);
  });

  function refreshAlphaLabels() {
    var keys = vk.querySelectorAll('.vk-key[data-alpha="1"]');
    keys.forEach(function (k) {
      var name = k.dataset.kname;
      k.textContent = shiftActive ? name.toUpperCase() : name.toLowerCase();
    });
    shiftKeys.forEach(function (sk) {
      sk.classList.toggle('vk-active', shiftActive);
    });
  }

  refreshAlphaLabels();

  function makeKbEvent(type, key, code, keyCode, charCode) {
    var ev;
    try {
      ev = new KeyboardEvent(type, {
        key: key,
        code: code,
        location: 0,
        repeat: false,
        isComposing: false,
        bubbles: true,
        cancelable: true,
        composed: true,
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false
      });
    } catch (e) {
      ev = document.createEvent('Event');
      ev.initEvent(type, true, true);
      ev.key = key;
      ev.code = code;
    }
    try { Object.defineProperty(ev, 'keyCode', { get: function () { return keyCode; } }); } catch (e) {}
    try { Object.defineProperty(ev, 'which',   { get: function () { return keyCode; } }); } catch (e) {}
    try { Object.defineProperty(ev, 'charCode',{ get: function () { return charCode || 0; } }); } catch (e) {}
    return ev;
  }

  function dispatchOne(type, key, code, keyCode, charCode) {
    var ev = makeKbEvent(type, key, code, keyCode, charCode);
    try { canvas.dispatchEvent(ev); } catch (e) {}
  }

  function pressKey(keyName, code, keyCode) {
    var key = keyName;
    var charCode = 0;
    var firePress = false;

    if (keyCode === 16) {
      shiftActive = !shiftActive;
      refreshAlphaLabels();
      return;
    }

    if (keyCode === 8) {
      key = 'Backspace';
    } else if (keyCode === 13) {
      key = 'Enter';
      firePress = true;
      charCode = 13;
    } else if (keyCode === 32) {
      key = ' ';
      firePress = true;
      charCode = 32;
    } else if (keyCode === 188) {
      key = shiftActive ? '<' : ',';
      firePress = true;
      charCode = key.charCodeAt(0);
    } else if (keyCode >= 48 && keyCode <= 57) {
      key = keyName;
      firePress = true;
      charCode = key.charCodeAt(0);
    } else if (keyCode >= 65 && keyCode <= 90) {
      key = shiftActive ? keyName.toUpperCase() : keyName.toLowerCase();
      firePress = true;
      charCode = key.charCodeAt(0);
    }

    dispatchOne('keydown', key, code, keyCode, 0);
    if (firePress) {
      dispatchOne('keypress', key, code, keyCode, charCode);
    }
    dispatchOne('keyup', key, code, keyCode, 0);

    if (shiftActive && keyCode >= 65 && keyCode <= 90) {
      shiftActive = false;
      refreshAlphaLabels();
    }
  }

  function bindKey(btn) {
    var keyName = btn.dataset.kname;
    var code = btn.dataset.kcode;
    var keyCode = parseInt(btn.dataset.kkey, 10);

    function handler(e) {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.add('vk-pressed');
      setTimeout(function () { btn.classList.remove('vk-pressed'); }, 90);
      try { canvas.focus(); } catch (er) {}
      pressKey(keyName, code, keyCode);
    }

    btn.addEventListener('pointerdown', handler, { passive: false });
    btn.addEventListener('mousedown', function (e) { e.preventDefault(); }, { passive: false });
    btn.addEventListener('click', function (e) { e.preventDefault(); }, { passive: false });
    btn.addEventListener('touchstart', function (e) { e.preventDefault(); }, { passive: false });
  }

  vk.querySelectorAll('.vk-key').forEach(bindKey);

  document.addEventListener('selectstart', function (e) {
    if (e.target && e.target.closest && e.target.closest('#vk')) e.preventDefault();
  });

  window.addEventListener('load', function () {
    setTimeout(function () { try { canvas.focus(); } catch (e) {} }, 200);
  });
})();
