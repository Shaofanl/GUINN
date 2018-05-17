// ***********************************************************
//  An interface from operators to layer objects
//    - An operator (https://github.com/sdrdis/jquery.flowchart#terminology)
//    is a box that can be parsed by jquery.flowchat
// ***********************************************************


class LayerBase {
  constructor(type, nbInput, nbOutput, params, id) { 
    if (id == undefined) 
      id = GLOBAL_NAME_COUNTER.getNextName(type.toLowerCase());
    this.type = type;  // Referred by the backend
    this.nbInput = nbInput;
    this.nbOutput = nbOutput; // usually 1 output is enough
    this.params = params;
    this.id = id; // `name` is used by `Ojbect` in JS
  }

  toOperator() {
    // throw new TypeError("Cannot parse an abstract class");
    var operator = undefined;
    return operator;
  }

  setDefaultParam(key, value) {
    if (!(key in this.params) || this.params[key] == undefined)
      this.params[key] = value;
  }

  toJSON() {
    var data = {
      properties: {
        title: this.id,
        inputs: {},
        outputs: {},
        meta: {
          type: this.type,
          params: this.params
        }
      }
    };

    for (var i = 0; i < this.nbInput; i++) {
      data.properties.inputs['input_' + i] = { label: 'Input ' + (i + 1) };
    }
    for (var i = 0; i < this.nbOutput; i++) {
      data.properties.outputs['output_' + i] = { label: 'Output ' + (i + 1) };
    }
    return data;
  }

  renderEditable() {
    var operator = 
      $('<div>', {text: this.type})
      .addClass("draggable_operator")
      .data("nb-inputs", this.nbInput)
      .data("nb-outputs", this.nbOutput);

    var thisobj = this;
    operator.draggable({
      cursor: "move",
      opacity: 0.7,

      helper: 'clone', 
      appendTo: 'body',
      zIndex: 1000,

      helper: function(e) {
        return $flowchart.flowchart('getOperatorElement', thisobj.toJSON());
      },
      stop: function(e, ui) {
        calcRelativePosition(ui, (pos) => {
          var data = thisobj.toJSON();
          data.left = pos.left;
          data.top = pos.top;
          $flowchart.flowchart('addOperator', data);

          // TODO: generate a new instance rather than update the id
          thisobj.id = GLOBAL_NAME_COUNTER.getNextName(thisobj.type);
        });
      }
    });
    return operator;
  }
}

class InputLayer extends LayerBase {
  constructor(params={}, id) { 
    super("Input", 0, 1, params, id);
    // should remove default shape
    this.setDefaultParam('shape', [28, 28]);
  }
}

class DenseLayer extends LayerBase {
  constructor(params={}, id) {
    super("Dense", 1, 1, params, id);
    this.setDefaultParam('dim', 32);
  }
}

class ConvLayer extends LayerBase {
  constructor(params={}, id) {
    super("Conv", 1, 1, params, id);
    this.setDefaultParam('filters', 1);
    this.setDefaultParam('kernel_size', 3);
    this.setDefaultParam('stride_size', 1);
  }
}

class PoolingLayer extends LayerBase {
  constructor(params={}, id) {
    super("Pooling", 1, 1, params, id);
    this.setDefaultParam('method', 'max');
    this.setDefaultParam('pool_size', 2);
    this.setDefaultParam('stride_size', this.params.pool_size);
    this.setDefaultParam('padding', 'valid');
  }
}

class MergeLayer extends LayerBase {
  constructor(params={}, id) {
    super("Merge", 2, 1, params, id);
    this.setDefaultParam('method', 'concatenate');
  }
}

class ActivationLayer extends LayerBase {
  constructor(params={}, id) {
    super("Activation", 1, 1, params, id);
    this.setDefaultParam('activation', 'linear');
  }
}

class FlattenLayer extends LayerBase {
  constructor(params={}, id) {
    super("Flatten", 1, 1, params, id);
  }
}

class OutputLayer extends LayerBase {
  constructor(params={}, id) { 
    super("Output", 1, 0, params, id);
  }
}

AVAILABLE_LAYERS = [
  InputLayer,
  DenseLayer,
  MergeLayer,
  ActivationLayer,
  ConvLayer,
  PoolingLayer,
  FlattenLayer,
  OutputLayer
];
