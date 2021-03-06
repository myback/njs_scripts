function push(r) {
    var req_id = r.variables.request_id;
    var _pl = {
        addr: r.remoteAddress,
        body: {},
        body_storage: 'json',
        headers: r.headersIn,
        request_args: r.args,
        request_id: req_id,
        request_method: r.method,
        proto: r.httpVersion,
        uri: r.variables.request_uri,
    };

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
            _pl.body = {url: `https://elsatic-1.s3-storage/${req_id}`};

            // r.subrequest(`/s3-upload/${req_id}`, {method: 'PUT'})
        }
    }

    r.subrequest(`/elastic/mirror/_doc/${req_id}`, {body: JSON.stringify(_pl), method: 'PUT'});
}

export default {push}
