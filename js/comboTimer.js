function drawTimer() {
	if(gameState==1){
		var leftVertexes = [];
		var rightVertexes = [];
	if(MainHex.ct - MainHex.lastCombo < settings.comboTime){
		for(var i=0;i<6;i++){
			var done = (MainHex.ct -MainHex.lastCombo);
			if(done<(settings.comboTime)*(5-i)*(1/6)){
				leftVertexes.push(calcSide(i,i+1,1,1));
								rightVertexes.push(calcSide(12-i,11-i,1,1));
			}
			else{
				leftVertexes.push(calcSide(i,i+1,1-((done*6)/settings.comboTime)%(1),1));
				rightVertexes.push(calcSide(12-i,11-i,1-((done*6)/settings.comboTime)%(1),1));
				break;
			}
		}
	}
		if(rightVertexes.length !== 0) drawSide(rightVertexes);
		if(leftVertexes.length !== 0) drawSide(leftVertexes);
	}
}
