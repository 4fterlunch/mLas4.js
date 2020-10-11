var _headerOn=true;
var _pointsOn=true;
var _v1 = [0,0,0,0,0];

function stringFromUInt8(A) {
    let count = A.length;
    let str = "";

    for (var i = 0; i < count; i++) {
        var ch = String.fromCharCode(A[i]);
        str += A[i] === 0 ? "x" : ch;
    }
    return str;
}
function asArray(view) {
    return Array.prototype.slice.call(view);

}

function asSingle(view) {
    return view[0];
}

function Parser(buffer) {
    var _buffer = buffer;
    var _i = 0;
    function acc(v) {_i += v.byteLength;}

    return {
        getCursorPosition: function() {
            return _i;
        },
        skip: function(bytes) {
            _i += bytes;
            return _i;
        },
        next8: function(length) {
            var view = new Uint8Array(_buffer, _i, length);
            acc(view);
            return view;
        },
        next16: function(length) {
            var view = new Uint16Array(_buffer, _i, length);
            acc(view);
            return view;
        },
        next32: function(length) {
            var view = new Uint32Array(_buffer, _i, length);
            acc(view);
            return view;
        },
        nextFloat64: function(length) {
            var view = new Float64Array(_buffer, _i, length)
            acc(view);
            return view;
        }
        
    }
}

function readlas4(evt) {
    var _header = {};
    let f = evt.target.files[0];
    if (f) {
        let r = new FileReader();
        r.onload = function(e) {
            let contents = e.target.result;
            let buffer = r.result;  
            console.log("Parsing Header...");
            try {
                var p = new Parser(buffer);
                if (_headerOn) {
                    _header.fileSignature = stringFromUInt8(p.next8(4));
                    _header.fileSourceId = asSingle(p.next16(1));
                    _header.globalEncoding = asSingle(p.next16(1));
                    _header.guid = "";
                    _header.guid += (stringFromUInt8(p.next32(1))) + ".";
                    _header.guid += (asSingle(p.next16(1))) + ".";
                    _header.guid += (asSingle(p.next16(1))) + ".";
                    _header.guid += stringFromUInt8(p.next8(8));
                    var maj = asSingle(p.next8(1));
                    var minor = asSingle(p.next8(1));
                    //version
                    if (maj === 1) {
                        _v1[minor]++;
                        console.log("detected las V1." + minor);
                        
                    } else {
                        console.error("version not compatible.");
                        return;
                    }
                    _header.version = maj + "." + minor;
                    _header.systemIdentifier = stringFromUInt8(p.next8(32));
                    _header.generatingSoftware = stringFromUInt8(p.next8(32));
                    _header.createdDayOfYear = asSingle(p.next16(1));
                    _header.fileCreationYear = asSingle(p.next16(1));
                    _header.headerSize = asSingle(p.next16(1));
                    _header.offsetToPointData = asSingle(p.next32(1));
                    _header.numberOfVariableLengthRecords = asSingle(p.next32(1));
                    _header.pointDataRecordFormat = asSingle(p.next8(1));
                    p.skip(1); //jump
                    _header.pointDataRecordLength = asSingle(p.next16(1));
                    _header.legacyNumberOfPointRecords = asSingle(p.next32(1));
                    _header.legacyNumberOfPointsByReturn = asArray(p.next32(5));

                    p.skip(124); //jump to 256
                    var xyz = asArray(p.nextFloat64(12));
                    _header.xScaleFactor = xyz[0];
                    _header.yScaleFactor = xyz[1];
                    _header.zScaleFactor = xyz[2];
                    _header.xOffset = xyz[3];
                    _header.yOffset = xyz[4];
                    _header.zOffset = xyz[5];
                    _header.maxX = xyz[6];
                    _header.minX = xyz[7];
                    _header.maxY = xyz[8];
                    _header.minY = xyz[9];
                    _header.maxZ = xyz[10];
                    _header.minZ = xyz[11];

                    if (_v1[4]) {
                        
                    }
                    console.log(p.getCursorPosition(),_header);
                
                }
                else {
                    p.skip(96);
                    var offsetToPoints = p.next32(1)[0]; 
                    console.log(offsetToPoints);
                    p.skip(offsetToPoints - 100); //minus current _i

                }

                if (_pointsOn) {
                    console.log("do points blah blah");
                }







                
            }
            catch (e) {
                console.error(e.stack);
            }

            if (_headerOn) {
                return;
            }

            

        }
        r.readAsArrayBuffer(f);

    }
    else {
        alert("failed to load");
    }
}