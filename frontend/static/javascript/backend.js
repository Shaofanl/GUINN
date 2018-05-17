// **********************************************
//  An interface from the layer object to codes
// **********************************************

class BackendBase {
  constructor() {}

  createLayer(layer) {}
  buildGraph(dataBlob, layerName) {}
  graphToCode() {}
}

// TODO(?): build a PythonBackend outside KerasBackend
// so that we can encapsulate many python gramma generator
class KerasBackend {
  constructor() {
    this.layers = [];
    this.imports = {};
  }

  _registerImports(source, element) {
    if (!(source in this.imports))
      this.imports[source] = [];
    if (!(element in this.imports[source]))
      this.imports[source].push(element);
  }

  createLayer(layer) {
    switch(layer.meta.type) {
      case "Input":
        this._registerImports('layers', 'Input');
        return `${layer.title} = Input((${layer.meta.params.shape}))`;
        break;
      case "Dense":
        this._registerImports('layers', 'Dense');
        return `${layer.title} = Dense(${layer.meta.params.dim})`;
        break;
      case "Merge":
        var layerName = {
          "concatenate": "Concatenate",
          "add": "Add",
          "average": "Average"
        }[layer.meta.params.method]; // TODO: error handle

        this._registerImports('layers', layerName);
        return `${layer.title} = ${layerName}()`;
        break;
      case "Activation":
        this._registerImports('layers', "Activation");
        return `${layer.title} = Activation('${layer.meta.params.activation}')`;
        break;
      case "Conv":
        // TODO: conv of different dims
        this._registerImports('layers', "Conv2D");
        return `${layer.title} = Conv2D(filters=${layer.meta.params.filters}, kernel_size=${layer.meta.params.kernel_size}, strides=${layer.meta.params.stride_size})`;
        break;
      case "Pooling":
        var layerName = {
          "max": "MaxPooling2D",
          "average": "AveragePooling2D"
        }[layer.meta.params.method]; // TODO: error handle

        this._registerImports('layers', layerName);
        return `${layer.title} = ${layerName}(pool_size=${layer.meta.params.pool_size}, strides=${layer.meta.params.stride_size}, padding="${layer.meta.params.padding}")`;
        break;

      case "Flatten":
        this._registerImports('layers', "Flatten");
        return `${layer.title} = Flatten()`; 
        break;
      case "Output":
        return "";
        break;
      default:
        // throw something?
        return "raise NotImplementedError";
    }
  }

  graphToCode(data) {
    var lines = [];
    // main code
    $.each(data.operators, (index, item) => {
      lines.push(this.createLayer(item.properties));
    });

    lines = lines
      .filter(code => code != "")  // code
      .map(code => "  "+code);  // indent

    // handle headers
    lines.unshift("if __name__ == '__main__':");
    lines.unshift("");

    $.each(this.imports, (source, elements) => {
      lines.unshift(`from keras.${source} import ${elements.join()}`);
    });

    return lines.join('\n');
  }
}

// switch backend here
BACKEND = KerasBackend;
