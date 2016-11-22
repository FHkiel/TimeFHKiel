var fs = require('fs');
var PDFParser = require("pdf2json");
var pdfParser = new PDFParser();

var fs2 = require('fs');


var ww= function(){
    fs.readFile('./Master_MIE_Pflicht.pdf', function(err, pdfBuffer) {
        if (!err) {
        pdfParser.parseBuffer(pdfBuffer);
    }
})
}
ww();

console.log("testing");
var convertMe = function() {


    pdfParser.on("pdfParser_dataError", function (errData) {
        console.error(errData.parserError);
    });
    pdfParser.on("pdfParser_dataReady", function (pdfData) {
        fs2.writeFile("./dat145.json", JSON.stringify(pdfData));
    });
    pdfParser.loadPDF("./Master_MIE_Pflicht.pdf");
    console.log("wrote");

}
module.exports =  convertMe;
module.exports = ww;
