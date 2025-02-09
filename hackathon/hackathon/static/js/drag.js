$(document).ready(function() {
  var droppedItems = []; // Store selections as a list

  $('.add-to-cart').on('click', function() {
    console.log(droppedItems); // Return the list of selected items
  });

  var addEvent = (function() {
    if (document.addEventListener) {
      return function(el, type, fn) {
        if (el && el.nodeName || el === window) {
          el.addEventListener(type, fn, false);
        } else if (el && el.length) {
          for (var i = 0; i < el.length; i++) {
            addEvent(el[i], type, fn);
          }
        }
      };
    } else {
      return function(el, type, fn) {
        if (el && el.nodeName || el === window) {
          el.attachEvent('on' + type, function() { return fn.call(el, window.event); });
        } else if (el && el.length) {
          for (var i = 0; i < el.length; i++) {
            addEvent(el[i], type, fn);
          }
        }
      };
    }
  })();

  // Making the draggable items
  var links = document.querySelectorAll('li > a');
  for (var i = 0; i < links.length; i++) {
    var el = links[i];
    el.setAttribute('draggable', 'true');

    addEvent(el, 'dragstart', function(e) {
      e.dataTransfer.effectAllowed = 'copy';
      e.dataTransfer.setData('Text', this.id);
    });
  }

  var bins = document.querySelectorAll('.bin');

  bins.forEach(function(bin) {
    addEvent(bin, 'dragover', function(e) {
      if (e.preventDefault) e.preventDefault();
      this.className = 'over';
      e.dataTransfer.dropEffect = 'copy';
      return false;
    });

    addEvent(bin, 'dragenter', function(e) {
      this.className = 'over';
      return false;
    });

    addEvent(bin, 'dragleave', function() {
      this.className = '';
    });

    addEvent(bin, 'drop', function(e) {
      if (e.stopPropagation) e.stopPropagation();

      var el = document.getElementById(e.dataTransfer.getData('Text'));
      
      el.parentNode.removeChild(el);

      this.className = '';

      var existingImage = this.querySelector('img');
      if (existingImage) {
        existingImage.remove();
      }

      // If "No Fence" is dropped, display a clear image (or nothing)
      if (el.id === "no_fence") {
        var emptyImage = document.createElement("img");
        emptyImage.classList.add('dropped-image');
        
        this.appendChild(emptyImage);
      } else {
        // Otherwise, display the dropped image as usual
        var img = el.querySelector('img').cloneNode();
        img.classList.add('dropped-image');
        this.appendChild(img);
      }

      // Store selection in a list (replace if the bin already had an item)
      droppedItems = droppedItems.filter(item => item.bin !== this.id); // Remove previous item in the same bin
      droppedItems.push({ bin: this.id, item: el.id });

      this.style.background = 'rgba(255, 74, 74, 0)';  // Set background opacity to 0
      this.style.border = '3px dashed transparent';    // Set border opacity to 0 (transparent)
      this.querySelector('.bin-text').style.display = 'none';
    
      return false;
    });
  });
});
