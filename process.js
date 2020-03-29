function addprocess() {
  var lastRow = $('#inputTable tr:last');
  var lastRowNumebr = parseInt(lastRow.children()[1].innerText);
  var newRow = '<tr><td>P'
  + (lastRowNumebr + 1)
  + '</td><td>'
  + (lastRowNumebr + 1)
  + '</td><td><input class="bursttime" type="text"/></td><td class="turntime"></td>';
  lastRow.after(newRow);
  $('#inputTable tr:last input').change(function () {
    calcturntime();
  });
}

function removeprocess() {
  var lastRow = $('#inputTable tr:last');
  lastRow.remove();
}

function calcturntime() {
  var inputTable = $('#inputTable tr');
  var totalBurstTime = 0;
  var algorithm = $('input[name=algorithm]:checked', '#algorithm').val();
  if (algorithm == "fcfs") {
    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      $(value.children[3]).text(totalBurstTime);
      var bursttime = parseInt($(value.children[2]).children().first().val());
      totalBurstTime += bursttime;
    });
  }
  else if (algorithm == "sjf") {
    var bursttimes = [];
    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      bursttimes[key - 1] = parseInt($(value.children[2]).children().first().val());
    });
    var currentIndex = -1;
    for (var i = 0; i < bursttimes.length; i++) {
      currentIndex = findNextIndex(currentIndex, bursttimes);
      if (currentIndex == -1) return;
      $(inputTable[currentIndex + 1].children[3]).text(totalBurstTime);
      totalBurstTime += bursttimes[currentIndex];
    }
  }
}

function findNextIndex(currentIndex, array) {
  var currentTime = 0;
  if (currentIndex != -1) currentTime = array[currentIndex];            
  var resultTime = 1000000;
  var resultIndex = -1;
  var sameTime = false;
  var done = false;

  $.each(array, function (key, value) {
    var changeInThisIteration = false;
    if (key == currentIndex) {
      done = true;
      return true;
    }
    if (value >= currentTime && value <= resultTime) {
      if (value == resultTime) {                        
        if (currentTime == value && !sameTime) {
          sameTime = true;
          changeInThisIteration = true;
          resultTime = value;
          resultIndex = key;                            
        }                        
      }
      else if (value == currentTime) {
        if (done) {
          sameTime = true;
          done = false;
          changeInThisIteration = true;
          resultTime = value;
          resultIndex = key;
        }
      }
      else {
        resultTime = value;
        resultIndex = key;
      }
      if (value < resultTime && !changeInThisIteration)
        sameTime = false;
    }
  });
  return resultIndex;
}

function animate() {
  $('chart').prepend('<div id="queue" style="position: absolute; right: 0; width:100%; height:100px;"></div>');
  $('#queue').width($('#resultTable').width());
  $('#queue').css({left: $('#resultTable').position().left});
  var sum = 0;
  $('.bursttime').each(function() {
      sum += Number($(this).val());
  });
  var distance = $("#queue").css("width");
  animationStep(sum, 0);
  jQuery('#queue').animate({ width: '0', marginLeft: distance}, sum*1000/2, 'linear');
}

function animationStep(steps, cur) {
	$('#timer').html(cur);
	if(cur < steps) {
		setTimeout(function(){ 
   	     animationStep(steps, cur + 1);
  	}, 500);
  }
  else {
  }
}

function gengantt() {
  $('chart').html('');
  var inputTable = $('#inputTable tr');
  var th = '';
  var td = '';
  var algorithm = $('input[name=algorithm]:checked', '#algorithm').val();
  if (algorithm == "fcfs") {
    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      var bursttime = parseInt($(value.children[2]).children().first().val());
      th += '<th style="height: 30px; width: ' + bursttime * 20 + 'px;">P' + (key - 1) + '</th>';
      td += '<td>' + bursttime + '</td>';
    });
    $('chart').html('<table id="resultTable"><tr>'
                    + th
                    + '</tr><tr>'
                    + td
                    + '</tr></table>'
                   );
  }
  else if (algorithm == "sjf") {
    var bursttimes = [];
    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      var bursttime = parseInt($(value.children[2]).children().first().val());
      bursttimes[key - 1] = { "bursttime": bursttime, "P": key - 1 };
    });
    bursttimes.sort(function (a, b) {
      if (a.bursttime == b.bursttime)
        return a.P - b.P;
      return a.bursttime - b.bursttime
    });
    $.each(bursttimes, function (key, value) {
      th += '<th style="height: 60px; width: ' + value.bursttime * 20 + 'px;">P' + value.P + '</th>';
      td += '<td>' + value.bursttime + '</td>';
    });
    $('chart').html('<table id="resultTable"><tr>'
                    + th
                    + '</tr><tr>'
                    + td
                    + '</tr></table>'
                   );
  }
  animate();
}