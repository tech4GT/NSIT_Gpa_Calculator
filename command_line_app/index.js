#!/usr/bin/env node

const fs = require('fs');
const pdf = require('pdf-parse');
const sems = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"]

let dataBuffer = fs.readFileSync(process.argv[2]);

pdf(dataBuffer).then(function(data) {
    // console.log(data.text);

    let { text } = data;
    text = text.split("SemTotal CreditTotal Credit PointSGPACredit Secured")[1].slice(1);
    text = text.split("\n");
    // console.log(text);

    let total = 0, credits = 0;
    let num_of_sems = 0;
    for (let i in sems) {
        const sem = sems[i];
        if (!text[i].startsWith(sem)) {
            num_of_sems = i;
            break;
        }
        credits += parseInt(text[i].substring(sem.length, sem.length + 2));
        total += parseInt(text[i].split(".")[0].slice(0, -1).substring(sem.length + 2));
    }

    console.log("Total Credit point: " + total);
    console.log("Total Credits: " + credits);
    console.log(`Your GPA for ${num_of_sems} semesters is: ${total / credits}`);


});