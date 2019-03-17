
//Determines the next nextGen and difficulty of the wave object
function blockDestroyed() {
	//Checks the current nextGen value and adjusts the speed at which the waves
  //fall
  if (waveone.nextGen > 1350) {
		waveone.nextGen -= 30 * settings.creationSpeedModifier;
	} else if (waveone.nextGen > 600) {
		waveone.nextGen -= 8 * settings.creationSpeedModifier;
	} else {
		waveone.nextGen = 600;
	}

	//Check the difficulty of the wave and raises the speed as neccessary
  if (waveone.difficulty < 35) {
		waveone.difficulty += 0.085 * settings.speedModifier;
	} else {
		waveone.difficulty = 35;
	}
}
//This funtion takes in a hex object and adjusts it's values 
function waveGen(hex) {
	//Class' attributes and default values
  this.lastGen = 0;
	this.last = 0;
	this.nextGen = 2700;
	this.start = 0;
	this.colors = colors;
	this.ct = 0;
	this.hex = hex;
	this.difficulty = 1;
	this.dt = 0;
  
  //Function that sets the nextGen properties based off the current waveGen
  //updateWave()
	this.update = function() {
		this.currentFunction();
		this.dt = (settings.platform == 'mobile' ? 14 : 16.6667) * MainHex.ct;
		this.computeDifficulty();
		if ((this.dt - this.lastGen) * settings.creationSpeedModifier > this.nextGen) {
			if (this.nextGen > 600) {
				this.nextGen -= 11 * ((this.nextGen / 1300)) * settings.creationSpeedModifier;
			}
		}
	};
//Function to re-assign attributes depending it's current properties
  //randomizeWaves()
	this.randomGeneration = function() {
		if (this.dt - this.lastGen > this.nextGen) {
			this.ct++;
			this.lastGen = this.dt;
			var fv = randInt(0, MainHex.sides);
			addNewBlock(fv, colors[randInt(0, colors.length)], 1.6 + (this.difficulty / 15) * 3);
			var lim = 5;
			if (this.ct > lim) {
				var nextPattern = randInt(0, 3 + 21);
				if (nextPattern > 15) {
					this.ct = 0;
					this.currentFunction = this.doubleGeneration;
				} else if (nextPattern > 10) {
					this.ct = 0;
					this.currentFunction = this.crosswiseGeneration;
				} else if (nextPattern > 7) {
					this.ct = 0;
					this.currentFunction = this.spiralGeneration;
				} else if (nextPattern > 4) {
					this.ct = 0;
					this.currentFunction = this.circleGeneration;
				} else if (nextPattern > 1) {
					this.ct = 0;
					this.currentFunction = this.halfCircleGeneration;
				}
			}
		}
	};
//Computes the difficulty of the current wave
	this.computeDifficulty = function() {
		if (this.difficulty < 35) {
			var increment;
			if (this.difficulty < 8) {
				 increment = (this.dt - this.last) / (5166667) * settings.speedModifier;
			} else if (this.difficulty < 15) {
				increment = (this.dt - this.last) / (72333333) * settings.speedModifier;
			} else {
				increment = (this.dt - this.last) / (90000000) * settings.speedModifier;
			}

			this.difficulty += increment * (1/2);
		}
	};
//Determines if the next wave is ready to be created and if so
//what the properties of the new wave should be
//Creates all 6 sides of our hexagon ring
	this.circleGeneration = function() {
		if (this.dt - this.lastGen > this.nextGen + 500) {
			var numColors = randInt(1, 4);
			if (numColors == 3) {
				numColors = randInt(1, 4);
			}

			var colorList = [];
			nextLoop: for (var i = 0; i < numColors; i++) {
				var q = randInt(0, colors.length);
				for (var j in colorList) {
					if (colorList[j] == colors[q]) {
						i--;
						continue nextLoop;
					}
				}
				colorList.push(colors[q]);
			}

			for (var i = 0; i < MainHex.sides; i++) {
				addNewBlock(i, colorList[i % numColors], 1.5 + (this.difficulty / 15) * 3);
			}

			this.ct += 15;
			this.lastGen = this.dt;
			this.shouldChangePattern(1);
		}
	};

//Same as previous fucntion, but only creates half the circle
	this.halfCircleGeneration = function() {
		if (this.dt - this.lastGen > (this.nextGen + 500) / 2) {
			var numColors = randInt(1, 3);
			var c = colors[randInt(0, colors.length)];
			var colorList = [c, c, c];
			if (numColors == 2) {
				colorList = [c, colors[randInt(0, colors.length)], c];
			}

			var d = randInt(0, 6);
			for (var i = 0; i < 3; i++) {
				addNewBlock((d + i) % 6, colorList[i], 1.5 + (this.difficulty / 15) * 3);
			}

			this.ct += 8;
			this.lastGen = this.dt;
			this.shouldChangePattern();
		}
	};
//Generates new blocks cross-wise that are all the same color
  //sameColorGeneration
	this.crosswiseGeneration = function() {
		if (this.dt - this.lastGen > this.nextGen) {
			var ri = randInt(0, colors.length);
			var i = randInt(0, colors.length);
			addNewBlock(i, colors[ri], 0.6 + (this.difficulty / 15) * 3);
			addNewBlock((i + 3) % MainHex.sides, colors[ri], 0.6 + (this.difficulty / 15) * 3);
			this.ct += 1.5;
			this.lastGen = this.dt;
			this.shouldChangePattern();
		}
	};
//Generates new blocks with colors that alternate
	//alternatingColorGeneration()
  this.spiralGeneration = function() {
		var dir = randInt(0, 2);
		if (this.dt - this.lastGen > this.nextGen * (2 / 3)) {
			if (dir) {
				addNewBlock(5 - (this.ct % MainHex.sides), colors[randInt(0, colors.length)], 1.5 + (this.difficulty / 15) * (3 / 2));
			} else {
				addNewBlock(this.ct % MainHex.sides, colors[randInt(0, colors.length)], 1.5 + (this.difficulty / 15) * (3 / 2));
			}
			this.ct += 1;
			this.lastGen = this.dt;
			this.shouldChangePattern();
		}
	};
//Generates two different blocks at in two different locations
  //doublesameColorGeneration
	this.doubleGeneration = function() {
		if (this.dt - this.lastGen > this.nextGen) {
			var i = randInt(0, colors.length);
			addNewBlock(i, colors[randInt(0, colors.length)], 1.5 + (this.difficulty / 15) * 3);
			addNewBlock((i + 1) % MainHex.sides, colors[randInt(0, colors.length)], 1.5 + (this.difficulty / 15) * 3);
			this.ct += 2;
			this.lastGen = this.dt;
			this.shouldChangePattern();
		}
	};

	this.setRandom = function() {
		this.ct = 0;
		this.currentFunction = this.randomGeneration;
	};

	this.shouldChangePattern = function(x) {
		if (x) {
			var q = randInt(0, 4);
			this.ct = 0;
			switch (q) {
				case 0:
					this.currentFunction = this.doubleGeneration;
					break;
				case 1:
					this.currentFunction = this.spiralGeneration;
					break;
				case 2:
					this.currentFunction = this.crosswiseGeneration;
					break;
			}
		} else if (this.ct > 8) {
			if (randInt(0, 2) === 0) {
				this.setRandom();
				return 1;
			}
		}

		return 0;
	};

	// rest of generation functions
	this.currentFunction = this.randomGeneration;
}
