function echo(r) {
    var j = {
        headers: r.headersIn,
    };

    try {
        if (r.requestBody) {
            j['body'] = JSON.parse(r.requestBody);
        }

    } catch (e) {
        r.error(`ECHO: Marshal request body failed: ${e}`);
        j['body'] = 'Not marshaled, see error.log';
    }

    r.headersOut['Content-Type'] = "application/json; charset=utf-8";
    r.return(200, JSON.stringify(j));
}

export default {echo}
