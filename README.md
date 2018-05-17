NN GUI
---

A GUI for building neural network.

Todolist:
- framework
  - (?) Move to MVVM/MVC framework (Currently we use the Json/JS object to communicate).
  - Use protobuf to define hyper-params of each kind of layer
  - Use python as backend to support format like ONNX
- layers.js
  - A global auto-naming system (e.g. fc1, fc2, conv1)
  - Redesign the parameter allocation in the inheritance
- engine.js
  - Multi-platform support
  - Check cycle
  - Exception handle in JS
- features
  - Edit params in graph
  - Store/Reuse sub-modules
  - Multi-component selection
  - Code-graph binding interaction
  - Shape check
