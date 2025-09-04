function ResetTheInternet(event) {
	switch (event.pitch) {
		case Pitch.C4:
			return [
				[
					new Note(Pitch.E4, Length.Double),
					new Note(Pitch.A4, Length.Whole),
				],
				new Note(Pitch.Ab4, Length.Whole),
			];
		case Pitch.B3:
			return [
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
		default:
			event.send();
			return [];
	}
}

function HandleMIDI(event)
{
	var notes = ResetTheInternet(event);
	new Sequencer(notes).play(event.beatPos);
}

class Note
{
	constructor(pitch, length)
	{
		this.pitch = pitch;
		this.length = length;
	}
	
	play(beat)
	{
		var noteOn = new NoteOn;
		noteOn.pitch = this.pitch;
		noteOn.sendAtBeat(beat);

		var noteOff = new NoteOff(noteOn);
		noteOff.sendAtBeat(beat + this.beatDuration() - GetParameter("Release"));
	}

	beatDuration()
	{
		return this.length * GetTimingInfo().meterNumerator;
	}
}

class Sequencer
{
	constructor(notes)
	{
		this.notes = notes;
	}
	
	play(beatPosition)
	{
		var currentBeat = beatPosition;

		for (var note of this.notes)
		{
			var chord = Array.isArray(note) ? note : [note];

			chord.forEach(n => n.play(currentBeat));
			var minDuration = Math.min(...chord.map(n => n.beatDuration()));
			currentBeat += minDuration;
		}
	}
}

var Length = {
	Double: 2,
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
		defaultValue: 0.5, 
		minValue: 0, 
		maxValue: 1, 
		numberOfSteps: 10,
		type: "lin"
	}
];
