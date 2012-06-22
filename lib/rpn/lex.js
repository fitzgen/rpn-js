exports.lex = {
    rules: [
        ["\\s+",                  "/* Skip whitespace! */"],
        ["#.*\\n",                "/* Skip comments! */"],
        [";",                     "return 'SEMICOLON'"],
        ["[0-9]+",                "return 'NUMBER';"],
        ["print",                 "return 'PRINT';"],
        ["[a-zA-Z][a-zA-Z0-9_]*", "return 'VARIABLE';"],
        ["=",                     "return '=';"],
        ["\\+",                   "return '+';"],
        ["\\-",                   "return '-';"],
        ["\\*",                   "return '*';"],
        ["\\/",                   "return '/';"],
        ["$",                     "return 'EOF';"]
    ]
};
