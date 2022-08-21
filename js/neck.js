var _KEY = "G";
var _HARMONY = "maj";
var _MODE = "normal"; //notes
var _POSITION = [1];

var FRETS_COUNT = 24;
var notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
//			  0    1     2    3    4     5    6     7    8    9     10   11

var notesFromE = ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#"];
//			       7    8    9     10   11    0    1     2    3    4     5    6     

var strings;

var sdmn = 4;
var dmn = 5;


var bluesNote = "notexists";


var tunings = {
	"STD": [7, 2, 10, 5, 0, 7],
	"Dropped D": [7, 2, 10, 5, 0, 5],
	"C Tuning": [3, 10, 6, 1, 8, 3]
};

var exclPent = {
	"min":  [2,6],
	"maj":  [4,7]	
}

var bluesPos = {
	"min": 5,
	"maj": 3		
}

var scales = {
	"min":  [0, 2, 1, 2, 2, 1, 2],
	"maj":  [0, 2, 2, 1, 2, 2, 2]
}

var drawNeck = function(){
	return new Promise((resolve, reject)=>{
		strings.forEach((string, ind)=>{
			var $row = $("<tr  class='string "+string+"'/>");
			for(i=0; i<FRETS_COUNT+1; i++){
				var $cell = $("<td><div class='"+getNote(string, i).replace("#", "S")+"'><span>"+getNote(string, i)+"</span></div></td>");
				if(ind > 0 && [3,5,7,9,12,15,17,19,21,23].indexOf(i) >= 0){$cell.addClass("grey");}
				$row.append($cell);
			}
			$("#neck").append($row);
		});

		var $row = $("<tr class='marks'/>");
		for(i=0; i<FRETS_COUNT+1; i++){
			if([3,5,7,9,12,15,17,19,21,23].indexOf(i) >= 0){
				$row.append("<td><div class='fred-mark'/>"+((i == 12 || i == 26) ? "<div class='fred-mark'/>" : "") +"</td>");
			}else{
				$row.append("<td></td>");
			}
		}
		$("#neck").append($row);
		var $row = $("<tr class='numbers'/>");
		for(i=0; i<FRETS_COUNT+1; i++){
			if([3,5,7,9,12,15,17,19,21,23].indexOf(i) >= 0){
				$row.append("<td>"+i+"</td>");
			}else{
				$row.append("<td></td>");
			}
		}
		$("#neck").append($row);
		resolve();
	})
};

var drawNotes = function(k, h){
	return new Promise((resolve, reject)=>{
		var $row = $("<tr/>");
		start = notes.indexOf(k);

		var sc = scales[h];
		var step = 1;
		sc.forEach((s, ind)=>{
			for (i=1; i<s; i++){
				$row.append("<td/>")
			}
			$row.append("<td>"+step+"</td>");
			step++;
		})

		$("#scale-notes").append($row);

		$row = $("<tr/>");
		for(i=start; i<notes.length; i++){
			var $cell = $("<td><div class='"+notes[i].replace("#", "S")+"'><span>"+notes[i]+"</span></div></td>");
			$row.append($cell)
		}

		for(i=0; i<start; i++){
			var $cell = $("<td><div class='"+notes[i].replace("#", "S")+"'><span>"+notes[i]+"</span></div></td>");
			$row.append($cell)
		}

		$("#scale-notes").append($row);
		resolve();
	})
}

var getNote = function(string, fret){
	var pos = (string + fret)%12;
	return notes[pos];
}

var getNoteByPos = function(pos){
	if(pos > 11)
		return notes[pos-12];
	else if (pos < 0)
		return notes[pos+12];
	return notes[pos];
}

var getNotePosition = function(string, note){
	for(i=0; i<FRETS_COUNT+1; i++){
		if(getNote(string, i) == note){
			return i
		}
	}

	return 0;
}

var getBem = function(note){
	return getNoteByPos(notes.indexOf(note) - 2);
}

var getScale = function(k, h){
	var selected = [];
	var kp = notes.indexOf(k);
	var sc = scales[h];	
	sc.forEach((inc, ind)=>{
		kp += inc;
		if($("#pent").is(":checked") && exclPent[h].indexOf((ind+1)) >= 0){
			//return; // do nothing
		} else {
			selected.push(getNoteByPos(kp).replace("#", "S"));
		}

		if($("#blues").is(":checked") && bluesPos[h] == ind){
			bluesNote = getBem(getNoteByPos(kp)).replace("#", "S");
			//selected.push(bluesNote);
		}
		/*
		*/
	})

	return selected;
}

var drawScale = function(notes, root){
	notes.forEach((note)=>{
		$("#scale-notes-holder div."+note).addClass("active");
	});

	$("div."+root.replace("#", "S")).addClass("key");

	if($("#blues").is(":checked")){
		$("#scale-notes-holder div."+bluesNote).addClass("active");
		$("#scale-notes-holder div."+bluesNote).addClass("blues");
	}
};


var drawScaleNew = function(type, k, h){
	var scaleNotes = getScale(k, h);
	drawScale(scaleNotes, k);

	_POSITION.forEach((_pos)=>{
		//analyse _HARMONY. In case of min we need to subtract 1

		var noteByPos;
		if(_HARMONY == "min"){
			_pos -=1;
			noteByPos = scaleNotes[_pos].replace("S", "#");
			if (_pos < 1) {
				_pos = 5;
			}
		} else {
			noteByPos = scaleNotes[_pos-1].replace("S", "#");
		}

		var startPos = [];
		startPos[0] = getNotePosition(7, noteByPos) - 1;
		startPos[1] = getNotePosition(7, noteByPos) + 11;

		var scale = scalesArray[type][_pos];

		startPos.forEach((pos)=>{
			$("tr.string").each(function(rInd, row){
				$(row).find("div").each(function(cInd, cell){
					if(cInd < pos) return;

					if(scale[rInd][cInd-pos] == 0){
						$(cell).addClass("active")
					}

					if($("#blues").is(":checked")){
						if(scale[rInd][cInd-pos] == 1){
							$(cell).addClass("active")
							$(cell).addClass("blues")
						}
					}
				})
			})
		});
	});
}

var draw = function(){
	drawNeck().then(drawNotes(_KEY, _HARMONY).then(drawScaleNew(_MODE, _KEY, _HARMONY)));
}

var reset = function(){
	$("#neck tr").remove();
	$("#scale-notes tr").remove();
	draw();
}

$(()=>{
	$("#tuningSelect").change((e)=>{
		strings = tunings[$(e.target).find("option:selected").val()];
		reset();
	})

	Object.keys(tunings).forEach((key)=>{
		$("#tuningSelect").append($("<option />").val(key).text(key));
	});

	$("#tuningSelect option").children().first().attr("selected", true);
	//strings = tunings[$("#tuningSelect").children().first().val()];
	strings = tunings["STD"];

	$("input:radio[name=key]").change((event)=>{
		_KEY = $("input:radio[name=key]:checked").val();
		reset();
	});

	$("#harmony-switch label").on('click', (event)=>{
		_HARMONY = $(event.target).find("input").val();
		reset(); 
	});

	$("#scale-mode label").on('click', (event)=>{
		_MODE = $(event.target).find("input").val();
		reset(); 
	});



	$("input:checkbox[name=position]").change(()=>{
		_POSITION = []
		$("input:checkbox[name=position]:checked").each(
			function(){
				_POSITION.push($(this).val())
			})
		reset();

	})

	$("#pent").on("change", reset);
	$("#blues").on("change", reset);

	draw();

})