function push(r) {
    var _pl = {
        'addr': r.remoteAddress,
        'body': {},
        'body_storage': 'json',
        'headers': r.headersIn,
        'method': r.method,
        'proto': r.httpVersion,
    };

    var doc_id = Date.now();

    try {
        if (r.requestBody) {
            _pl['body'] = JSON.parse(r.requestBody);
        }

    } catch (e) {
        if (r.requestBody.length <= 4096) {
            _pl.body_storage = 'blob';
            _pl.body = {blob: r.requestBody.toString('base64url')};
        } else {
            _pl.body_storage = 'url';
            _pl.body = {url: `https://elsatic-1.s3-storage/${doc_id}_${r.remoteAddress.replace(/\./g, '_')}`}

            // r.subrequest(`/s3-upload/${doc_id}`, {method: 'PUT'})
        }
    }

    r.headersOut['Content-Type'] = "application/json; charset=utf-8";
    r.subrequest(`/elastic/mirror/_doc/${doc_id}`, {body: JSON.stringify(_pl), method: 'PUT'});
}

export default {push}
