function url_parse(raw_url) {
    var _url = {};
    var parsed_url = /^((?<schema>http[s]?):\/\/)?(?<host>[^\/]+)(?<path>[^?\n]*)\??(?<query>.*)/g.exec(raw_url);

    if (parsed_url.groups.schema) {
        _url['schema'] = parsed_url.groups.schema;
    } else {
        _url['schema'] = 'http';
    }

    _url['host'] = parsed_url.groups.host;

    var host_port = parsed_url.groups.host.split(':');
    if (host_port.length == 2) {
        if ((_url['schema'] == 'http' && host_port[1] == 80) || (_url['schema'] == 'https' && host_port[1] == 443)) {
            _url['host'] = host_port[0];
        }
    }

    _url['path'] = parsed_url.groups.path;
    _url['raw_query'] = '';
    _url['query'] = {};

    if (parsed_url.groups.query) {
        _url['raw_query'] = parsed_url.groups.query;

        var kv_query = parsed_url.groups.query.split('&');
        for (var i in kv_query) {
            var kv = kv_query[i].split('=');
            _url['query'][kv[0]] = kv[1];
        }
    }

    return _url
}
