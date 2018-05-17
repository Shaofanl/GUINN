class NameCounter {
  constructor() {
    this.registerTable = {};
  }

  getNextName(prefix) {
    var nextName;
    if (prefix in this.registerTable) {
      nextName = prefix+'_'+this.registerTable[prefix];
      this.registerTable[prefix] += 1;
    }
    else {
      nextName = prefix+'_0';
      this.registerTable[prefix] = 1;
    }
    return nextName;
  }
}

GLOBAL_NAME_COUNTER = new NameCounter;

calcRelativePosition = (ui, callback) => {
  var elOffset = ui.offset;
  var containerOffset = $container.offset();
  if (elOffset.left > containerOffset.left &&
      elOffset.top > containerOffset.top && 
      elOffset.left < containerOffset.left + $container.width() &&
      elOffset.top < containerOffset.top + $container.height()) {

    var flowchartOffset = $flowchart.offset();

    var relativeLeft = elOffset.left - flowchartOffset.left;
    var relativeTop = elOffset.top - flowchartOffset.top;

    var positionRatio = $flowchart.flowchart('getPositionRatio');
    relativeLeft /= positionRatio;
    relativeTop /= positionRatio;
    if (callback) 
      callback({left: relativeLeft, top: relativeTop});
  }
}
