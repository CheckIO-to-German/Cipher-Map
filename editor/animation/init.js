requirejs(['ext_editor_io', 'jquery_190', 'raphael_210'],
    function (extIO, $, TableComponent) {
        var io = new extIO({
            functions: {
                js: 'absoluteSorting',
                python: 'checkio'
            },
            animation: function($expl, data){
                var checkioInput = data.in;
                var grille = convertStringsTo2D(checkioInput[0]);
                var cpassword = convertStringsTo2D(checkioInput[1]);

                var $grilleTable = createTableFrom2D(grille);
                var $cpasswordTable = createTableFrom2D(cpassword);


                var $grilleTd = $explanation.find("table .td-grille");
                var $cpasswordTd = $explanation.find("table .td-cpassword");

                $grilleTd.append($grilleTable);
                $cpasswordTd.append($cpasswordTable);

                $grilleTable.find("td").each(function() {
                    if ($(this).html() != 'X') {
                        $(this).addClass("fill-blue");
                    }
                });



                for (var k=1; k <= 4; k++) {
                    var mergeResult = mergeGrillePassword(grille, cpassword);
                    var $iterationTable = createTableFrom2D(mergeResult[0]);
                    var $iterationTd = $explanation.find("table .td-iteration" + k);
                    var $iterationResultTd = $explanation.find("table .td-iteration-result" + k);
                    $iterationResultTd.html('"' + mergeResult[1] + '"');
                    $iterationTd.append($iterationTable);
                    $iterationTable.find("td").each(fillBlue);

                    grille = rotateSquareMatrixCW(grille);
                }
            }
        });
        io.start();
    }
);
