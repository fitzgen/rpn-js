exports.bnf = {
    start: [
        ["input EOF", "return $$;"]
    ],
    input: [
        ["",           "$$ = [];"],
        ["line input", "$$ = [$1].concat($2);"]
    ],
    line: [
        ["exp SEMICOLON", "$$ = $1;"]
    ],
    exp: [
        ["NUMBER",           "$$ = new yy.Number(@1.first_line, @1.first_column, yytext);"],
        ["VARIABLE",         "$$ = new yy.Variable(@1.first_line, @1.first_column, yytext);"],
        ["exp exp operator", "$$ = new yy.Expression(@3.first_line, @3.first_column, $1, $2, $3);"]
    ],
    operator: [
        ["PRINT", "$$ = new yy.Operator(@1.first_line, @1.first_column, yytext);"],
        ["=",     "$$ = new yy.Operator(@1.first_line, @1.first_column, yytext);"],
        ["+",     "$$ = new yy.Operator(@1.first_line, @1.first_column, yytext);"],
        ["-",     "$$ = new yy.Operator(@1.first_line, @1.first_column, yytext);"],
        ["*",     "$$ = new yy.Operator(@1.first_line, @1.first_column, yytext);"],
        ["/",     "$$ = new yy.Operator(@1.first_line, @1.first_column, yytext);"]
    ]
};
