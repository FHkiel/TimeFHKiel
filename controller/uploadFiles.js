
var fs = require('fs');
var PDFParser = require("pdf2json");
var pdfParser = new PDFParser();

var fs2 = require('fs'), PDFParser = require("pdf2json");

var pdfParser = new PDFParser();

exports.file = function(req, res) {
    req.pipe(req.busboy);
    var filePath;
    req.busboy.on('file', function(fieldname, file, filename) {
        var fstream = fs.createWriteStream('./Schedules/' + filename);
        filePath = './Schedules/' + filename;
        file.pipe(fstream);
        fstream.on('close', function () {
            res.redirect('back');
        });
        fs2.writeFile("./test.json", "Something");
        pdfParser.on("pdfParser_dataError", function(errData){console.error(errData.parserError);});
        pdfParser.on("pdfParser_dataReady", function(pdfData){ fs2.writeFile("./dataaaa.json", JSON.stringify(pdfData));});
        pdfParser.loadPDF("./Master_MIE_Pflicht.pdf");
        console.log("I ran");



    });
    console.write("fail to ran");
};


