function Songs() {
	return {
		"C4": [
			[
				new Note("E3", Length.Double),
				new Note("A3", Length.Whole),
			],
			new Note("G#3", Length.Whole),
		],
		"B3": [
			[
				new Note("D3", Length.Whole),
				new Note("A2", Length.Whole),
				new Note("D2", Length.Whole)
			],
			[
				new Note("C#3", Length.Whole),
				new Note("G#2", Length.Whole),
				new Note("C#2", Length.Whole)
			],
		]
	};
};

function HandleMIDI(event)
{
	var notes = Songs()[MIDI.noteName(event.pitch)];

	if (notes) {
		new Sequencer(notes).play(event.beatPos);
		return
	}
	
	event.send();
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
		noteOn.pitch = MIDI.noteNumber(this.pitch);
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
