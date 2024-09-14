//Ethix-MD-V2

const FormData = require("form-data");
async function remini(_0x33b965, _0x34eff3) {
  return new Promise(async (_0x14db15, _0x267c15) => {
    let _0x45d85b = ['enhance', "recolor", "dehaze"];
    if (_0x45d85b.includes(_0x34eff3)) {
      _0x34eff3 = _0x34eff3;
    } else {
      _0x34eff3 = _0x45d85b[0x0];
    }
    let _0x370778 = new FormData();
    let _0x5c019f = "https://inferenceengine.vyro.ai/" + _0x34eff3;
    _0x370778.append("model_version", 0x1, {
      'Content-Transfer-Encoding': "binary",
      'contentType': "multipart/form-data; charset=uttf-8"
    });
    _0x370778.append('image', Buffer.from(_0x33b965), {
      'filename': "enhance_image_body.jpg",
      'contentType': "image/jpeg"
    });
    _0x370778.submit({
      'url': _0x5c019f,
      'host': "inferenceengine.vyro.ai",
      'path': '/' + _0x34eff3,
      'protocol': "https:",
      'headers': {
        'User-Agent': 'okhttp/4.9.3',
        'Connection': "Keep-Alive",
        'Accept-Encoding': "gzip"
      }
    }, function (_0x319120, _0x175e8d) {
      if (_0x319120) {
        _0x267c15();
      }
      let _0x15e24d = [];
      _0x175e8d.on('data', function (_0x2918a5, _0x2d4e53) {
        _0x15e24d.push(_0x2918a5);
      }).on("end", () => {
        _0x14db15(Buffer.concat(_0x15e24d));
      });
      _0x175e8d.on("error", _0x90e19c => {
        _0x267c15();
      });
    });
  });
}
module.exports.remini = remini;


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
