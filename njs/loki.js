function push(r) {
    var _pl = {
        addr: r.remoteAddress,
        body: {},
        body_storage: 'json',
        headers: r.headersIn,
        request_args: r.args,
        request_method: r.method,
        proto: r.httpVersion,
        uri: r.variables.request_uri,
    };

    var unix_date = Date.now();

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

            var filename = `${unix_date}_${r.remoteAddress.replace(/\./g, '_')}`;
            _pl.body = {url: `https://loki-1.s3-storage/${filename}`}

            // r.subrequest(`/s3-upload/${filename}`, {method: 'PUT'})
        }
    }

    var loki_data = {
        streams: [{
            stream: {nginx: "test"},
            values: [[`${unix_date * 10**6}`, JSON.stringify(_pl)]]
        }]
    }

    r.subrequest(`/loki-push`, {body: JSON.stringify(loki_data), method: 'POST'});
}

export default {push}
