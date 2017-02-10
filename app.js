//https://docs.google.com/spreadsheets/d/190pQvYlb56RFUoiikx4GpEBOGTkdUG1x1-7Bmo205eg/edit#gid=0

var spreadsheetID = "190pQvYlb56RFUoiikx4GpEBOGTkdUG1x1-7Bmo205eg";
var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID +
  "/3/public/values?alt=json";
$.getJSON(url, function(incomingData) {
  var info = incomingData.feed.entry[0].gsx$attendance.$t;
  getAttendance(info)

  labelMaker(attData)
  createAttendanceChart();
});

var attData =[];
var dates = [];
console.log(dates)
var points = [];
var color = []



function dateFormatter(date){
  var dateArr = [];
  var from = date.split("/");
  for(var i = 2; i >= 0; i--){
    dateArr.push(Number(from[i]));
  }
  return dateArr;
}

function thisDay(){
  var year      = new Date().getYear()+1900;
  var month     = new Date().getMonth();
  var date      = new Date().getDate();
  var today     = new Date(year,month,date).getTime()
  return today
}

function calculateDates(start,end){ 
  var sArr      = dateFormatter(start);
  var startDate = new Date(sArr[0],sArr[1]-1,sArr[2]).getTime();
  var eArr      = dateFormatter(end);
  var endDate   = new Date(eArr[0],eArr[1]-1,eArr[2]).getTime();
  var today = thisDay();
  var completed = (today - startDate) / 1000;
  var length = (endDate - startDate) / 1000;
  var done = (completed/length) * 100;
    return Math.round(done);
}

 
var studentStartDate ="12/12/2016";
var studentEndDate = "01/03/2017"; 

function addProgress(courseStart,courseEnd){
 // var courseStart  = "01/01/2017";
 // var courseEnd = "21/05/2017"; 
  $('#courseCompleted').progress('increment',calculateDates(courseStart,courseEnd),{
});
    
}

$('#studentCompleted').progress('increment',calculateDates(studentStartDate,studentEndDate),{
});



function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function getAttendance(info) {
  var xml = info,
    projects = [],
    projectsObj = {};
  var node = (new DOMParser()).parseFromString(xml, "text/xml").documentElement;
  var nodes = node.querySelectorAll("*");
  var nodesLength = nodes.length;
  var dateData = node;
  for (var i = 0; i < nodesLength / 2; i++) {
    var score = dateData.getElementsByTagName('attstatus')[i].textContent
    var date = dateData.getElementsByTagName('date')[i].textContent
    if (i === 0 ){
       attData.push({
      date: "Start: " + date,
      score: Number(score)
    });      
    }
    else if(i <= (nodesLength / 2)){
       attData.push({
      date: "Finish: " + date,
      score: Number(score)
    });      
    } else {
       
    attData.push({
      date: date,
      score: Number(score)
    });
            
    }
    
   
  }
  
  console.log(attData[36].date)
   addProgress(attData[0].date,attData[36].date);
}

function formattedDate(date) {
    var d = new Date(date || Date.now()),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('/');
}


function labelMaker(attData){
  var labels = attData.map(function(a, b) {
  dates.push(a.date);
  if (a.score === 0) {
    points.push(100);
    color.push("#F000FF")
  } else {
    points.push(a.score);
    color.push("#21BA45");
  }
    
});
}


var data = {
	labels: dates,
	datasets: [{
		label: '',
		data: points,
		backgroundColor: color,
		borderWidth: 0
	}]
};

function createAttendanceChart(){
var ctx = document.getElementById('attendence');
var myChart = new Chart(ctx, {
	type: 'bar',
	data: data,
	options: {      
		legend: {
			display: false
		},
       tooltips: {
          titleFontSize: 0,
	      titleMarginBottom: 0,
       callbacks: {
        connector: {
                    visible: true,
                    width: 1
                },
        label: function(tooltipItems, data) {
     
          var object = "";
          var value = data.datasets[0].data[tooltipItems.index] + "%";
          var color = data.datasets[0].backgroundColor[tooltipItems.index];
          var label = data.labels[tooltipItems.index];
          var message = "Attendance = "
          if (color === "#F000FF"){
              value = "";
              message = "Absent"
              }
            return label + ": "+message +" "+ value;
          
        }
      }
    },
    
      
		scales: {
			yAxes: [{
				ticks: {
			    beginAtZero: true
				},
				display: false,
				gridLines: {
					display: false,
				},
			}],
			xAxes: [{
                
				gridLines: {
					display: true,
					tickMarkLength: 5
				},
				ticks: {
					display: true,
					autoSkip: true,
					maxTicksLimit: 1,
					maxRotation: 0
				},
				//  display: false,				
			}]
		}
	}
});
  };

    $('#attLegend').append('<a class="ui mini label project" style="background-color:#21BA45; color:white">Present</a>');
  	$('#attLegend').append('<a class="ui mini label project" style="background-color:#F000FF; color:white">Absent</a>');
