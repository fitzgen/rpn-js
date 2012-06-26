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
AstNode.prototype._sn = function (originalFilename, chunk) {
    return new SourceNode(this._line, this._column, originalFilename, chunk);
};


exports.Number = function (line, column, numberText) {
    AstNode.call(this, line, column);
    this._value = Number(numberText);
};
exports.Number.prototype = Object.create(AstNode.prototype);
exports.Number.prototype.compile = function (data) {
    return this._sn(data.originalFilename,
                    push(this._value.toString()));
};


exports.Variable = function (line, column, variableText) {
    AstNode.call(this, line, column);
    this._name = variableText;
};
exports.Variable.prototype = Object.create(AstNode.prototype);
exports.Variable.prototype.compileReference = function (data) {
    return this._sn(data.originalFilename,
                    push(["'", this._name, "'"]));
};
exports.Variable.prototype.compile = function (data) {
    return this._sn(data.originalFilename,
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
    var temp = "__rpn.temp";
    var output = this._sn(data.originalFilename, "");

    switch (this._operator.symbol) {
    case 'print':
        return output
            .add(this._left.compile(data))
            .add(this._right.compile(data))
            .add([temp, " = __rpn.pop();\n"])
            .add(["if (", temp, " <= 0) throw new Error('argument must be greater than 0');\n"])
            .add(["if (Math.floor(", temp, ") != ", temp,
                  ") throw new Error('argument must be an integer');\n"])
            .add([this._operator.compile(data), "(__rpn.pop(), ", temp, ");\n"]);
    case '=':
        return output
            .add(this._right.compile(data))
            .add(this._left.compileReference(data))
            .add(["__rpn._env[__rpn.pop()] ", this._operator.compile(data), " __rpn.pop();\n"]);
    case '/':
        return output
            .add(this._left.compile(data))
            .add(this._right.compile(data))
            .add([temp, " = __rpn.pop();\n"])
            .add(["if (", temp, " === 0) throw new Error('divide by zero error');\n"])
            .add(push(["__rpn.pop() ", this._operator.compile(data), " ", temp]));
    default:
        return output
            .add(this._left.compile(data))
            .add(this._right.compile(data))
            .add([temp, " = __rpn.pop();\n"])
            .add(push(["__rpn.pop() ", this._operator.compile(data), " ", temp]));
    }
};


exports.Operator = function (line, column, operatorText) {
    AstNode.call(this, line, column);
    this.symbol = operatorText;
};
exports.Operator.prototype = Object.create(AstNode.prototype);
exports.Operator.prototype.compile = function (data) {
    if (this.symbol === "print") {
        return this._sn(data.originalFilename,
                        "__rpn.print");
    }
    else {
        return this._sn(data.originalFilename,
                        this.symbol);
    }
};
