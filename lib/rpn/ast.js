var sourceMap = require("source-map");
var SourceNode = sourceMap.SourceNode;


function push(val) {
    return ["__rpn.push(", val, ");\n"];
}


var AstNode = function (line, column) {
    this._line = line;
    this._column = column;
};
AstNode.prototype.compile = function (data) {
    throw new Error("Not Yet Implemented");
};
AstNode.prototype.compileReference = function (data) {
    return this.compile(data);
};


exports.Number = function (line, column, numberText) {
    AstNode.call(this, line, column);
    this._value = Number(numberText);
};
exports.Number.prototype = Object.create(AstNode.prototype);
exports.Number.prototype.compile = function (data) {
    return new SourceNode(this._line,
                          this._column,
                          data.originalFilename,
                          push(this._value.toString()));
};


exports.Variable = function (line, column, variableText) {
    AstNode.call(this, line, column);
    this._name = variableText;
};
exports.Variable.prototype = Object.create(AstNode.prototype);
exports.Variable.prototype.compileReference = function (data) {
    return new SourceNode(this._line,
                          this._column,
                          data.originalFilename,
                          push(["'", this._name, "'"]));
};
exports.Variable.prototype.compile = function (data) {
    return new SourceNode(this._line,
                          this._column,
                          data.originalFilename,
                          push(["__rpn._env.", this._name]));
};


exports.Expression = function (line, column, operand1, operand2, operator) {
    AstNode.call(this, line, column);
    this._left = operand1;
    this._right = operand2;
    this._operator = operator;
};
exports.Expression.prototype = Object.create(AstNode.prototype);
exports.Expression.prototype.compile = function (data) {
    var left = "__rpn.registers.a";
    var right = "__rpn.registers.b";
    var output = new SourceNode(this._line, this._column, data.originalFilename);

    switch (this._operator.symbol) {
    case 'print':
        return output
            .add(this._left.compile(data))
            .add(this._right.compile(data))
            .add([right, " = __rpn.pop();\n"])
            .add(["if (", right, " <= 0) throw new Error('argument must be greater than 0');\n"])
            .add(["if (Math.floor(", right, ") != ", right,
                  ") throw new Error('argument must be an integer');\n"])
            .add([left, " = __rpn.pop();\n"])
            .add(["__rpn.print(", left, ", ", right, ");\n"]);
    case '=':
        return output
            .add(this._left.compileReference(data))
            .add(this._right.compile(data))
            .add([right, " = __rpn.pop();\n"])
            .add([left, " = __rpn.pop();\n"])
            .add(["__rpn._env[", left, "] = ", right, ";\n"]);
    case '/':
        return output
            .add(this._left.compile(data))
            .add(this._right.compile(data))
            .add([right, " = __rpn.pop();\n"])
            .add(["if (", right, " == 0) throw new Error('divide by zero error');\n"])
            .add([left, " = __rpn.pop();\n"])
            .add(push([left, " / ", right]));
    default:
        return output
            .add(this._left.compile(data))
            .add(this._right.compile(data))
            .add([right, " = __rpn.pop();\n"])
            .add([left, " = __rpn.pop();\n"])
            .add(push([left, " ", this._operator.symbol, " ", right]));
    }
};


exports.Operator = function (line, column, operatorText) {
    AstNode.call(this, line, column);
    this.symbol = operatorText;
};
exports.Operator.prototype = Object.create(AstNode.prototype);
