#!/usr/bin/env node

const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync(process.argv[2]);

pdf(dataBuffer).then(function(data) {
    // console.log(data.text);

    let { text } = data;
    text = text.split("SemTotal CreditTotal Credit PointSGPACredit Secured")[1];
    text = text.split("\n");
    // console.log(text);

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

    console.log("Total Credit point: " + total);
    console.log("Total Credits: " + credits);
    console.log("Your GPA for 6 semesters is: " + total / credits);


});