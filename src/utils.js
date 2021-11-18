/*Diverse utility elements*/


/*We consider a constant list of all possible answers to a question*/
const list_possible_answer = ["yes","no","idk","ok","not_ok"]
const list_possible_answer_trad = ["Oui","Non","?","OK","Non OK"]

/*Function to translate an answer into mountable french version*/
const trad_answer = (answer) => {
  return list_possible_answer_trad[list_possible_answer.indexOf(answer)]
}

/*List of possible options (answers), used in the multiselect component to choose the question answers*/
const possible_options = []
list_possible_answer.forEach(function(answer){
  possible_options.push({"labelKey": answer, "value": trad_answer(answer), "isSelected":false})
})

/*Function that make the operation of type "is val1 op val2 ?' with op the operator in string input*/
const simple_operation = (val1, string_op, val2) => {
  switch (string_op) {
    case ">" : return val1 > val2;
    case "<" : return val1 < val2;
    case "=" : return val1 === val2 ;
    default: return true;
  }
}

/*Function that take the list of checklist, transform it in json format and export as .json file*/
const checklist_to_json = (checklistList) => {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(checklistList));
    console.log(dataStr)
    var b = document.createElement('a');
    b.href = dataStr ;
    b.download = "checklist.json";
    document.body.appendChild(b);
    b.click();
    b.remove()
}

/*Function to take a data array and put in a .csv file, with some characteristics*/
function CsvGenerator(dataArray, fileName, separator, addQuotes) {
    this.dataArray = dataArray;
    this.fileName = fileName;
    this.separator = separator || ',';
    this.addQuotes = !!addQuotes;

    if (this.addQuotes) {
        this.separator = '"' + this.separator + '"';
    }

    this.getDownloadLink = function () {
        var separator = this.separator;
        var addQuotes = this.addQuotes;

        var rows = this.dataArray.map(function (row) {
            var rowData = row.join(separator);

            if (rowData.length && addQuotes) {
                return '"' + rowData + '"';
            }

            return rowData;
        });

        var type = 'data:text/csv;charset=utf-8';
        var data = rows.join('\n');

        if (typeof btoa === 'function') {
            type += ';base64';
            data = btoa(data);
        } else {
            data = encodeURIComponent(data);
        }

        return this.downloadLink = this.downloadLink || type + ',' + data;
    };

    this.getLinkElement = function (linkText) {
        var downloadLink = this.getDownloadLink();
        var fileName = this.fileName;
        this.linkElement = this.linkElement || (function() {
            var a = document.createElement('a');
            a.innerHTML = linkText || '';
            a.href = downloadLink;
            a.download = fileName;
            return a;
        }());
        return this.linkElement;
    };

    // call with removeAfterDownload = true if you want the link to be removed after downloading
    this.download = function (removeAfterDownload) {
        var linkElement = this.getLinkElement();
        linkElement.style.display = 'none';
        document.body.appendChild(linkElement);
        linkElement.click();
        if (removeAfterDownload) {
            document.body.removeChild(linkElement);
        }
    };
}




export {list_possible_answer_trad, list_possible_answer, trad_answer, possible_options, CsvGenerator, simple_operation, checklist_to_json}