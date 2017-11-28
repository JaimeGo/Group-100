
var mailjet = require ('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)

    //for (var user in users){
//
    //    var request = mailjet
    //    .post("send")
    //    .request({
    //        "FromEmail":"citizen805@gmail.com",
    //        "FromName":"Mailjet Pilot",
    //        "Subject":ctx.params.title,
    //        "Text-part":ctx.params.body,
    //        "Recipients":[
    //                {
    //                        "Email": user.email
    //                }
    //        ]
    //    });
//
//
    //    request
    //    .then(result => {
    //        console.log(result.body)
    //    })
    //    .catch(err => {
    //        console.log(err.statusCode)
    //    })
//
//
    //};

function sendMails(title,body,users){


    var request = mailjet
        .post("send")
        .request({
            "FromEmail":"citizen805@gmail.com",
            "FromName":"Mailjet Pilot",
            "Subject":title,
            "Text-part":body,
            "Recipients":[
                    {
                            "Email": "citizen805@gmail.com"
                    }
            ]
        });


    request
    .then(result => {
        console.log(result.body)
    })
    .catch(err => {
        console.log(err.statusCode)
    })



    ctx.redirect(ctx.router.url('newMail'));




}

module.exports = sendMails;
