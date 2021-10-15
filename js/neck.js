var _KEY = "A";
var _HARMONY = "min";
var _MODE = "scale"; //notes

var fretsCount = 26;
var notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
//			  0    1     2    3    4     5    6     7    8    9     10   11

var notesFromE = ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#"];
//			       7    8    9     10   11    0    1     2    3    4     5    6     



var strings;

var sdmn = 4;
var dmn = 5;

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

var getNote = function(string, fret){
	var pos = (string + fret)%12;
	return notes[pos];
}

var drawNeck = function(){
	return new Promise((resolve, reject)=>{
		strings.forEach((string, ind)=>{
			var $row = $("<tr  class='"+string+"'/>");
			for(i=0; i<fretsCount+1; i++){
				var $cell = $("<td><div class='"+getNote(string, i).replace("#", "S")+"'><span>"+getNote(string, i)+"</span></div></td>");
				if(ind > 0 && [3,5,7,9,12,15,17,19,21,23,26].indexOf(i) >= 0){$cell.addClass("grey");}
				$row.append($cell);
			}
			$("#neck").append($row);
		});

		var $row = $("<tr class='marks'/>");
		for(i=0; i<fretsCount+1; i++){
			if([3,5,7,9,12,15,17,19,21,23,26].indexOf(i) >= 0){
				$row.append("<td><div class='fred-mark'/>"+((i == 12 || i == 26) ? "<div class='fred-mark'/>" : "") +"</td>");
			}else{
				$row.append("<td></td>");
			}
		}
		$("#neck").append($row);
		var $row = $("<tr class='numbers'/>");
		for(i=0; i<fretsCount+1; i++){
			if([3,5,7,9,12,15,17,19,21,23,26].indexOf(i) >= 0){
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

var reset = function(){
	$("#neck tr").remove();
	$("#scale-notes tr").remove();
}

var getNoteByPos = function(pos){
	if(pos > 11)
		return notes[pos-12];
	else if (pos < 0)
		return notes[pos+12];
	return notes[pos];
}

var getBem = function(note){
	return getNoteByPos(notes.indexOf(note) - 2);
}

var drawScale = function(k, h){
	var selected = [];
	var kp = notes.indexOf(k);
	var sc = scales[h];
	var bluesNote = "notexists";
	sc.forEach((inc, ind)=>{
		kp += inc;
		if($("#pent").is(":checked") && exclPent[h].indexOf((ind+1)) >= 0){
			//return; // do nothing
		} else {
			selected.push(getNoteByPos(kp).replace("#", "S"));
		}

		if(sdmn == ind+1){
			$("div."+getNoteByPos(kp).replace("#", "S")+">span").text(getNoteByPos(kp) + "s");
		}

		if(dmn == ind+1){
			$("div."+getNoteByPos(kp).replace("#", "S")+">span").text(getNoteByPos(kp) + "d");			
		}
/**/		
		if($("#blues").is(":checked") && bluesPos[h] == ind){
			bluesNote = getBem(getNoteByPos(kp)).replace("#", "S");
		}
	})

	selected.forEach((note)=>{
		$("div."+note).addClass("active");
	});

	$("div."+k.replace("#", "S")).addClass("key");
	$("div."+bluesNote).addClass("active");
	$("div."+bluesNote).addClass("blues");


};

$(()=>{
	$("#tuningSelect").change((e)=>{
		strings = tunings[$(e.target).find("option:selected").val()];
		reset(); drawNeck().then(drawNotes(_KEY, _HARMONY).then(()=>{drawScale(_KEY, _HARMONY);}))
	})

	Object.keys(tunings).forEach((key)=>{
		$("#tuningSelect").append($("<option />").val(key).text(key));
	});

	$("#tuningSelect option").children().first().attr("selected", true);
	strings = tunings[$("#tuningSelect").children().first().val()];

	$("#key-switch label").on('click', (event)=>{
		_KEY = $(event.target).find("input").val();
		reset(); drawNeck().then(drawNotes(_KEY, _HARMONY).then(()=>{drawScale(_KEY, _HARMONY);}))
	});

	$("#harmony-switch label").on('click', (event)=>{
		_HARMONY = $(event.target).find("input").val();
		reset(); drawNeck().then(drawNotes(_KEY, _HARMONY).then(()=>{drawScale(_KEY, _HARMONY);}))
	});

	$("#pent").on("change", ()=>{reset(); drawNeck().then(drawNotes(_KEY, _HARMONY).then(()=>{drawScale(_KEY, _HARMONY);}))});
	$("#blues").on("change", ()=>{reset(); drawNeck().then(drawNotes(_KEY, _HARMONY).then(()=>{drawScale(_KEY, _HARMONY);}))});

	drawNeck().then(drawNotes(_KEY, _HARMONY).then(()=>{drawScale(_KEY, _HARMONY);}));

	/*$( ".overflow" ).resizable({
		handles: "e, w"
	});*/



})