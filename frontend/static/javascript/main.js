//  partial credit: https://github.com/sdrdis/jquery.flowchart
$(document).ready(function() {
  $flowchart = $('#graph_container');
  $container = $flowchart.parent();

  var cx = $flowchart.width() / 2;
  var cy = $flowchart.height() / 2;

  // Panzoom initialization...
  $flowchart.panzoom();
  // Centering panzoom
  $flowchart.panzoom('pan', -cx + $container.width() / 2, -cy + $container.height() / 2);
  // Panzoom zoom handling...
  var possibleZooms = [0.5, 0.75, 1, 2, 3];
  var currentZoom = 2;
  $container.on('mousewheel.focal', function( e ) {
    e.preventDefault();
    var delta = (e.delta || e.originalEvent.wheelDelta) || e.originalEvent.detail;
    var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
    currentZoom = Math.max(0, Math.min(possibleZooms.length - 1, (currentZoom + (zoomOut * 2 - 1))));
    $flowchart.flowchart('setPositionRatio', possibleZooms[currentZoom]);
    $flowchart.panzoom('zoom', possibleZooms[currentZoom], {
      animate: false,
      focal: e
    });
  });


  function update() {
    var data = $flowchart.flowchart('getData');
      $('#graphCode').html(JSON.stringify(data, null, 2));
      $('#generatedCode').html(new BACKEND().graphToCode(data));
  }

  // Create a flowchart 
  $flowchart.flowchart({
    onAfterChange: ()=>{ 
      update();
    },
    multipleLinksOnOutput: true
  });
  update();

  // setup the delete button
  $flowchart.parent().siblings('.delete_selected_button').click(function() {
    $flowchart.flowchart('deleteSelected');
  });

  // create placeholders
  LAYER_PLACEHOLDERS = [];
  AVAILABLE_LAYERS.forEach(layerClass => {
    LAYER_PLACEHOLDERS.push(new layerClass());
  });

  // render editable boxes
  LAYER_PLACEHOLDERS.forEach(layer => {
    layer.renderEditable().appendTo("#draggable_operators_list");
  });

});
