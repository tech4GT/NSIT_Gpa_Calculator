var reader = new FileReader();
const sems = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "garbage_val"]
reader.onload = function(event) {
    var contents = event.target.result;
    gettext(contents).then(text => {

        text = text.split("SemTotal CreditTotal Credit PointSGPACredit Secured")[1];
        const temp = [];
        let rem = text.substring(1);

        for (let i = 0; i < sems.length - 1; i++) {
            let ind = rem.indexOf(sems[i + 1]);
            if (ind === -1) {
                temp.push(sems[i] + rem.split("Grand")[0]);
                break;
            }

            temp.push(sems[i] + rem.substring(0, ind));
            rem = rem.substring(ind + sems[i + 1].length);
            console.log(temp);

        }

        let total = 0, credits = 0;

        for (let i in temp) {
            const sem = sems[i];
            const dec_loc = temp[i].indexOf(".");

            const credits_this_sem = parseInt(temp[i].substring(sem.length, sem.length + 2));
            const sgpa = parseFloat(temp[i].substring(dec_loc - 1, dec_loc + 3));

            console.log(sgpa);
            console.log(sgpa * credits_this_sem);

            credits += credits_this_sem;
            // total += (parseInt(temp[i].split(".")[0].slice(0, -1).substring(sem.length + 2)) * credits_this_sem);
            total += (sgpa * credits_this_sem);
        }

        const results = `Total Credit Point:<b> ${total}</b><br>
            Total Credits: <b>${credits}</b><br>
            Your GPA for ${temp.length} semesters is: <b>${total / credits}</b>`;

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