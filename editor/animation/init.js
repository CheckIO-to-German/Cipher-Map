
requirejs(['ext_editor_io', 'jquery_190', 'raphael_210'],
    function (extIO, $, TableComponent) {

        function convertStringsTo2D (strings) {
            var strings2D = [];
            for (var i =0; i < strings.length; i++) {
                strings2D.push(strings[i].split(''));
            }
            return strings2D;
        }

        function createTableFrom2D (array2D ) {
            var $table = $("<table></table>");
            for (var i=0; i < array2D.length; i++) {
                var $tr = $("<tr></tr>");
                for (var j=0; j < array2D[i].length; j++) {
                    $tr.append($("<td>").html(array2D[i][j]))
                }
                $table.append($tr);
            }
            return $table;
        }

        function rotateSquareMatrixCW (matrix) {
            var rotatedMatrix = [];
            var N = matrix.length;
            for (var i=0; i < N; i++) {
                var tempArray = [];
                for (var j=0; j < N; j++) {
                    tempArray.push(matrix[N-j-1][i]);
                }
                rotatedMatrix.push(tempArray);
            }
            return rotatedMatrix;
        }

        function mergeGrillePassword (grille, cpassword) {
            var resultMatrix = [];
            var resultStr = '';
            for (var i=0; i < grille.length; i++) {
                var tempArray = [];
                for (var j=0; j < grille[i].length; j++) {
                    if (grille[i][j] == 'X') {
                        tempArray.push(cpassword[i][j]);
                        resultStr += cpassword[i][j];
                    }
                    else {
                        tempArray.push('.');
                    }
                }
                resultMatrix.push(tempArray);
            }
            return [resultMatrix, resultStr];
        }

        function collectDataFromTable ($table, size) {
            var array2D = [];
            var tds = $table.find("td");
            var vsize = Math.floor(tds.length / size);
            for (var i=0; i < vsize; i++) {
                var tempArray = [];
                for (var j=0; j <size; j++) {
                    var k = i * vsize + j;
                    var $inElement = $(tds[k]).find("*");
                    tempArray.push($inElement.html() || $inElement.val());
                }
                array2D.push(tempArray);
            }
            return array2D;
        }

        function fillBlue() {
            if ($(this).html() == '.') {
                $(this).addClass("fill-blue");
            }
        }

        var io = new extIO({
            animationTemplateName: 'template_animation',
            functions: {
                js: 'absoluteSorting',
                python: 'checkio'
            },
            animation: function($explanation, data){
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
