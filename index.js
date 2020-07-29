var reader = new FileReader();
reader.onload = function(event) {
    var contents = event.target.result;
    gettext(contents).then(text => {

        text = text.split("SemTotal CreditTotal Credit PointSGPACredit Secured")[1];

        const temp = [NaN];
        let rem = text;
        temp.push(text.split("II")[0]);
        rem = rem.substring(rem.indexOf("II") + 2);
        console.log(rem);
        temp.push("II" + rem.split("III")[0]);
        rem = rem.substring(rem.indexOf("III") + 3);
        temp.push("III" + rem.split("IV")[0]);
        rem = rem.substring(rem.indexOf("IV") + 2);
        temp.push("IV" + rem.split("V")[0]);
        rem = rem.substring(rem.indexOf("V") + 1);
        temp.push("V" + rem.split("VI")[0]);
        rem = rem.substring(rem.indexOf("VI") + 2);
        temp.push("VI" + rem.split("VII")[0]);
        rem = rem.substring(rem.indexOf("VII") + 3);
        temp.push("VII" + rem.split("Grand")[0]);

        console.log(temp);

        text = temp;

        let total = 0, credits = 0;

        //sem 1
        credits += parseInt(text[1].substring(1, 3));
        total += parseInt(text[1].split(".")[0].slice(0, -1).substring(3));
        // console.log(credits);
        // console.log(total);

        //sem 2
        credits += parseInt(text[2].substring(2, 4));
        total += parseInt(text[2].split(".")[0].slice(0, -1).substring(4));
        // console.log(credits);

        //sem 3
        credits += parseInt(text[3].substring(3, 5));
        total += parseInt(text[3].split(".")[0].slice(0, -1).substring(5));
        // console.log(credits);

        //sem 4
        credits += parseInt(text[4].substring(2, 4));
        total += parseInt(text[4].split(".")[0].slice(0, -1).substring(4));
        // console.log(credits);

        //sem 5
        credits += parseInt(text[5].substring(1, 3));
        total += parseInt(text[5].split(".")[0].slice(0, -1).substring(3));
        // console.log(credits);

        //sem 6
        credits += parseInt(text[6].substring(2, 4));
        total += parseInt(text[6].split(".")[0].slice(0, -1).substring(4));
        // console.log(credits);

        //sem 7
        credits += parseInt(text[7].substring(3, 5));
        total += parseInt(text[7].split(".")[0].slice(0, -1).substring(5));
        // console.log(credits);

        const results = `Total Credit Point:<b> ${total}</b><br>
            Total Credits: <b>${credits}</b><br>
            Your GPA for 7 semesters is: <b>${total / credits}</b>`;

        document.getElementById("result").innerHTML += results;
        document.getElementById("card").hidden = false;

    });
};

reader.onerror = function(event) {
    console.error("File could not be read! Code " + event.target.error.code);
};


async function getPdfText(data) {
    let doc = await pdfjsLib.getDocument({ data }).promise;
    let pageTexts = Array.from({ length: doc.numPages }, async (v, i) => {
        return (await (await doc.getPage(i + 1)).getTextContent()).items.map(token => token.str).join('');
    });
    return (await Promise.all(pageTexts)).join('');
}

function gettext(pdfUrl) {
    var pdf = pdfjsLib.getDocument(pdfUrl);
    return pdf.promise.then(function(pdf) { // get all pages text
        console.log(pdf)
        var maxPages = pdf._pdfInfo.numPages;
        var countPromises = []; // collecting all page promises
        for (var j = 1; j <= maxPages; j++) {
            var page = pdf.getPage(j);

            var txt = "";
            countPromises.push(page.then(function(page) { // add page promise
                var textContent = page.getTextContent();
                return textContent.then(function(text) { // return content promise
                    return text.items.map(function(s) { return s.str; }).join(''); // value page text 
                });
            }));
        }
        // Wait for all pages and join text
        return Promise.all(countPromises).then(function(texts) {
            return texts.join('');
        });
    });
}

document.getElementById("button").addEventListener("click", (e) => {
    reader.readAsDataURL(document.getElementById("flp").files[0]);
});