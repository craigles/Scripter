function HandleMIDI(event)
{
	var notes = [];

	switch (event.pitch) {
		case Pitch.C4:
			notes = [
				[
					new Note(Pitch.E4, Length.Whole * 2),
					new Note(Pitch.A4, Length.Whole),
				],
				new Note(Pitch.Ab4, Length.Whole)
			];
		    break;
		case Pitch.B3:
			notes = [
				[
					new Note(Pitch.D4, Length.Whole),
					new Note(Pitch.A3, Length.Whole),
					new Note(Pitch.D3, Length.Whole)
				],
				[
					new Note(Pitch.Db4, Length.Whole),
					new Note(Pitch.Ab3, Length.Whole),
					new Note(Pitch.Db3, Length.Whole)
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
	constructor(pitch, length)
	{
		this.pitch = pitch;
		this.length = length;
	}
	
	play(startTime)
	{
		var n = new NoteOn;
		n.pitch = this.pitch;
		n.sendAfterMilliseconds(startTime);

		var nOff = new NoteOff;
		nOff.pitch = this.pitch;
		nOff.sendAfterMilliseconds(startTime + this.duration() - GetParameter("Release"));
	}

	duration()
	{
		var timingInfo = GetTimingInfo();
		var barDuration = 60 / timingInfo.tempo * 1000 * timingInfo.meterNumerator;
		return barDuration * this.length;
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
			var chord = Array.isArray(note) ? note : [note];

			chord.forEach(n => n.play(currentTime));
			var minDuration = Math.min(...chord.map(n => n.duration()));
			currentTime += minDuration;
		}
	}
}

var Length = {
	Whole: 1,
	Half: 1 / 2,
	Quarter: 1 / 4,
	Eighth: 1 / 8,
	Sixteenth: 1 / 16,
};

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
