function XMLtoObj(xml_str) {
    return xml_str
            .replace(/\<[^>]*[\s]*\/>/g, '')
            .replace(/>\s+</g, '><')
            .XMLParser()
}

String.prototype.XMLParser = function xml_parse(xml) {
    if (xml === undefined) { xml = this }
    var reResult,
        out = {},
        reObj = /<(?<key>[\w\-\.\:]+)\s*(?<tags>[^>]*)>(?<value>.*?)<\/\1>/g,
        reObject = new RegExp(reObj),
        reString = new RegExp(/^[^<]+/);

    while(reResult = reObject.exec(xml)) {
        var v,
            reObjTest = new RegExp(reObj),
            bodyKey = reResult.groups.key,
            bodyValue = reResult.groups.value;

        if (reObjTest.test(bodyValue)) {
            v = xml_parse(bodyValue);
        } else if (reString.test(bodyValue)) {
            v = bodyValue.replace(/\"/g, '').replace(/&quot;/g, '');
        } else {
            v = bodyValue;
        }

        if (bodyKey in out) {
            if (out[bodyKey] instanceof Array) {
                out[bodyKey].push(v);
            } else {
                out[bodyKey] = [out[bodyKey], v];
            }

        } else {
            out[bodyKey] = v
        }
    }
    return out
}
