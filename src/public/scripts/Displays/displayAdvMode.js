window.onload = function() {
   var content = document.getElementById('advModeDisplay');
   var data = localStorage.advModeData.replace(/\\n/g, '<br />').replace(/\\"/g, '');
   content.innerHTML = data;
};
