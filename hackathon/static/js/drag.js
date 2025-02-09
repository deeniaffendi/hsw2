var addEvent = (function () {
  if (document.addEventListener) {
    return function (el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.addEventListener(type, fn, false);
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
    };
  } else {
    return function (el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
    };
  }
})();

// Setting up the dragstart event for the draggable items
var links = document.querySelectorAll('li > a'), el = null;
for (var i = 0; i < links.length; i++) {
  el = links[i];
  el.setAttribute('draggable', 'true');
  
  addEvent(el, 'dragstart', function (e) {
    e.dataTransfer.effectAllowed = 'copy'; // only dropEffect='copy' will be dropable
    e.dataTransfer.setData('Text', this.id); // required otherwise doesn't work
  });
}

// Now handle all bins as drop targets
var bins = document.querySelectorAll('.bin');  // Select all elements with the class .bin

bins.forEach(function(bin) {
  addEvent(bin, 'dragover', function (e) {
    if (e.preventDefault) e.preventDefault(); // allows us to drop
    this.className = 'over';
    e.dataTransfer.dropEffect = 'copy';
    return false;
  });

  addEvent(bin, 'dragenter', function (e) {
    this.className = 'over';
    return false;
  });

  addEvent(bin, 'dragleave', function () {
    this.className = '';
  });

  addEvent(bin, 'drop', function (e) {
    if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting

    var el = document.getElementById(e.dataTransfer.getData('Text'));
    
    el.parentNode.removeChild(el); // Remove the item from its current location

    this.appendChild(el); // Append the item to the bin

    this.className = ''; // Reset the bin's visual state

    return false;
  });
});
