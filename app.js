const path = require("path");

const express = require("express");

const app = express();
const route = require("./routes/approuter");

const port = process.env.PORT || 80;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('assets'))
app.use("/", route);

app.get("*", function(req, res) {
    return res.status(404).sendFile(path.join(__dirname, '/assets/', '404.html'));
});

app.use(function (err, req, res, next) {
    console.error(err.stack)
    return res.status(500).sendFile(path.join(__dirname, '/assets/', '500.html'));
});

app.listen(port, () => {
    console.log(`Server app listening on port ${port}`);
});