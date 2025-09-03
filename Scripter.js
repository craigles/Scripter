function HandleMIDI(event)
{
	var notes = [];

	switch (event.pitch) {
		case Pitch.C4:
			notes = [
				[
					new Note(Pitch.E4, Time().Whole * 2),
					new Note(Pitch.A4, Time().Whole),
				],
				new Note(Pitch.Ab4, Time().Whole)
			];
		    break;
		case Pitch.B3:
			notes = [
				[
					new Note(Pitch.D4, Time().Whole),
					new Note(Pitch.A3, Time().Whole),
					new Note(Pitch.D3, Time().Whole)
				],
				[
					new Note(Pitch.Db4, Time().Whole),
					new Note(Pitch.Ab3, Time().Whole),
					new Note(Pitch.Db3, Time().Whole)
				],
			];
			break;
		default:
			event.send();
	}
			
	new Sequencer(notes).play();
}

class Note
{
	constructor(pitch, duration)
	{
		this.pitch = pitch;
		this.duration = duration;
	}
	
	play(startTime)
	{
		var n = new NoteOn;
		n.pitch = this.pitch;
		n.sendAfterMilliseconds(startTime);

		var nOff = new NoteOff;
		nOff.pitch = this.pitch;
		nOff.sendAfterMilliseconds(startTime + this.duration - GetParameter("Release"));
	}
}

class Sequencer
{
	constructor(notes)
	{
		this.notes = notes;
	}
	
	play()
	{
		var currentTime = 0;

		for (var note of this.notes)
		{
			if (Array.isArray(note))
			{
				note.forEach(n => n.play(currentTime));
				var minDuration = Math.min(...note.map(n => n.duration));
				currentTime += minDuration;
			} 
			else
			{
				note.play(currentTime);
				currentTime += note.duration;
			}
		}
	}
}

function Time() {
	var bpm = GetTimingInfo().tempo;
	var quarter = 60 / bpm * 1000;
	
	return {
		Whole: quarter * 4,
		Half: quarter * 2,
		Quarter: quarter,
		Eighth: quarter / 2,
		Sixteenth: quarter / 4,
	};
}

var Pitch = {
	C5: 72,
	B4: 71,
	Bb4: 70,
	A4: 69,
	Ab4: 68,
	G4: 67,
	Gb4: 66,
	F4: 65,
	E4: 64,
	Eb4: 63,
	D4: 62,
	Db4: 61,
	C4: 60,
	B3: 59,
	Bb3: 58,
	A3: 57,
	Ab3: 56,
	G3: 55,
	Gb3: 54,
	F3: 53,
	E3: 52,
	Eb3: 51,
	D3: 50,
	Db3: 49,
	C3: 48,
	B2: 47,
	Bb2: 46,
	A2: 45,
	Ab2: 44,
	G2: 43,
	Gb2: 42,
	F2: 41,
	E2: 40,
	Eb2: 39,
	D2: 38,
	Db2: 37,
	C2: 36
}

var NeedsTimingInfo = true
var PluginParameters = [
	{
		name: "Release", 
		defaultValue: 100, 
		minValue: 0, 
		maxValue: 1000, 
		numberOfSteps: 100,
		type: "lin"
	}
];
