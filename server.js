const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/index.html')
})

app.post('/subscribe', (req, res, next) => {
    if (
        req.body.captcha === undefined ||
        req.body.captcha === '' ||
        req.body.captcha === null
    ){
        return res.json({"success": false, "msg": "Please select Captcha"})
    }

    // Secrect Key
    const secretKey = '6LfniZwUAAAAACocVPfurssN_5cWgi-ppM6SEfYP';

    // Verify URL
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`

    // Make Request to VerifyURL
    request(verifyUrl, (err, res, body) => {
        body = JSON.parse(body)

        // If not Successful
        if (body.success !== undefined && !body.success){
            return res.json({"success": false, "msg": "Failed Captcha Verification"})
        }

        // If Successful
        return res.json({"success": true, "msg": "Captcha Passed"})
    })
})

app.listen(3000, () => {
    console.log('Server Started on port 3000')
})