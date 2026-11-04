var QRCode;
(function () {
    function B(a) {
        this.mode = r.MODE_8BIT_BYTE;
        this.data = a;
        this.parsedData = [];
        a = 0;
        for (var d = this.data.length; a < d; a++) {
            var c = [],
                b = this.data.charCodeAt(a);
            65536 < b ? (c[0] = 240 | (b & 1835008) >>> 18,
                c[1] = 128 | (b & 258048) >>> 12,
                c[2] = 128 | (b & 4032) >>> 6,
                c[3] = 128 | b & 63) : 2048 < b ? (c[0] = 224 | (b & 61440) >>> 12,
                    c[1] = 128 | (b & 4032) >>> 6,
                    c[2] = 128 | b & 63) : 128 < b ? (c[0] = 192 | (b & 1984) >>> 6,
                        c[1] = 128 | b & 63) : c[0] = b;
            this.parsedData.push(c)
        }
        this.parsedData = Array.prototype.concat.apply([], this.parsedData);
        this.parsedData.length != this.data.length && (this.parsedData.unshift(191),
            this.parsedData.unshift(187),
            this.parsedData.unshift(239))
    }

    function t(a, d) {
        this.typeNumber = a;
        this.errorCorrectLevel = d;
        this.modules = null;
        this.moduleCount = 0;
        this.dataCache = null;
        this.dataList = []
    }

    function w(a, d) {
        if (void 0 == a.length)
            throw Error(a.length + "/" + d);
        for (var c = 0; c < a.length && 0 == a[c];)
            c++;
        this.num = Array(a.length - c + d);
        for (d = 0; d < a.length - c; d++)
            this.num[d] = a[d + c]
    }

    function u(a, d) {
        this.totalCount = a;
        this.dataCount = d
    }

    function C() {
        this.buffer = [];
        this.length = 0
    }

    function D() {
        var a = navigator.userAgent;
        /android/i.test(a) && (a = a.toString().match(/android ([0-9]\.[0-9])/i)) && a[1] && parseFloat(a[1]);
        return 0
    }
    B.prototype = {
        getLength: function (a) {
            return this.parsedData.length
        },
        write: function (a) {
            for (var d = 0, c = this.parsedData.length; d < c; d++)
                a.put(this.parsedData[d], 8)
        }
    };
    t.prototype = {
        addData: function (a) {
            a = new B(a);
            this.dataList.push(a);
            this.dataCache = null
        },
        isDark: function (a, d) {
            if (0 > a || this.moduleCount <= a || 0 > d || this.moduleCount <= d)
                throw Error(a + "," + d);
            return this.modules[a][d]
        },
        getModuleCount: function () {
            return this.moduleCount
        },
        make: function () {
            this.makeImpl(!1, this.getBestMaskPattern())
        },
        makeImpl: function (a, d) {
            this.moduleCount = 4 * this.typeNumber + 17;
            this.modules = Array(this.moduleCount);
            for (var c = 0; c < this.moduleCount; c++) {
                this.modules[c] = Array(this.moduleCount);
                for (var b = 0; b < this.moduleCount; b++)
                    this.modules[c][b] = null
            }
            this.setupPositionProbePattern(0, 0);
            this.setupPositionProbePattern(this.moduleCount - 7, 0);
            this.setupPositionProbePattern(0, this.moduleCount - 7);
            this.setupPositionAdjustPattern();
            this.setupTimingPattern();
            this.setupTypeInfo(a, d);
            7 <= this.typeNumber && this.setupTypeNumber(a);
            null == this.dataCache && (this.dataCache = t.createData(this.typeNumber, this.errorCorrectLevel, this.dataList));
            this.mapData(this.dataCache, d)
        },
        setupPositionProbePattern: function (a, d) {
            for (var c = -1; 7 >= c; c++)
                if (!(-1 >= a + c || this.moduleCount <= a + c))
                    for (var b = -1; 7 >= b; b++)
                        -
                            1 >= d + b || this.moduleCount <= d + b || (this.modules[a + c][d + b] = 0 <= c && 6 >= c && (0 == b || 6 == b) || 0 <= b && 6 >= b && (0 == c || 6 == c) || 2 <= c && 4 >= c && 2 <= b && 4 >= b ? !0 : !1)
        },
        getBestMaskPattern: function () {
            for (var a = 0, d = 0, c = 0; 8 > c; c++) {
                this.makeImpl(!0, c);
                var b = m.getLostPoint(this);
                if (0 == c || a > b)
                    a = b,
                        d = c
            }
            return d
        },
        createMovieClip: function (a, d, c) {
            a = a.createEmptyMovieClip(d, c);
            this.make();
            for (d = 0; d < this.modules.length; d++) {
                c = 1 * d;
                for (var b = 0; b < this.modules[d].length; b++) {
                    var e = 1 * b;
                    this.modules[d][b] && (a.beginFill(0, 100),
                        a.moveTo(e, c),
                        a.lineTo(e + 1, c),
                        a.lineTo(e + 1, c + 1),
                        a.lineTo(e, c + 1),
                        a.endFill())
                }
            }
            return a
        },
        setupTimingPattern: function () {
            for (var a = 8; a < this.moduleCount - 8; a++)
                null == this.modules[a][6] && (this.modules[a][6] = 0 == a % 2);
            for (a = 8; a < this.moduleCount - 8; a++)
                null == this.modules[6][a] && (this.modules[6][a] = 0 == a % 2)
        },
        setupPositionAdjustPattern: function () {
            for (var a = m.getPatternPosition(this.typeNumber), d = 0; d < a.length; d++)
                for (var c = 0; c < a.length; c++) {
                    var b = a[d],
                        e = a[c];
                    if (null == this.modules[b][e])
                        for (var f = -2; 2 >= f; f++)
                            for (var h = -2; 2 >= h; h++)
                                this.modules[b + f][e + h] = -2 == f || 2 == f || -2 == h || 2 == h || 0 == f && 0 == h ? !0 : !1
                }
        },
        setupTypeNumber: function (a) {
            for (var d = m.getBCHTypeNumber(this.typeNumber), c = 0; 18 > c; c++) {
                var b = !a && 1 == (d >> c & 1);
                this.modules[Math.floor(c / 3)][c % 3 + this.moduleCount - 8 - 3] = b
            }
            for (c = 0; 18 > c; c++)
                b = !a && 1 == (d >> c & 1),
                    this.modules[c % 3 + this.moduleCount - 8 - 3][Math.floor(c / 3)] = b
        },
        setupTypeInfo: function (a, d) {
            d = m.getBCHTypeInfo(this.errorCorrectLevel << 3 | d);
            for (var c = 0; 15 > c; c++) {
                var b = !a && 1 == (d >> c & 1);
                6 > c ? this.modules[c][8] = b : 8 > c ? this.modules[c + 1][8] = b : this.modules[this.moduleCount - 15 + c][8] = b
            }
            for (c = 0; 15 > c; c++)
                b = !a && 1 == (d >> c & 1),
                    8 > c ? this.modules[8][this.moduleCount - c - 1] = b : 9 > c ? this.modules[8][15 - c - 1 + 1] = b : this.modules[8][15 - c - 1] = b;
            this.modules[this.moduleCount - 8][8] = !a
        },
        mapData: function (a, d) {
            for (var c = -1, b = this.moduleCount - 1, e = 7, f = 0, h = this.moduleCount - 1; 0 < h; h -= 2)
                for (6 == h && h--; ;) {
                    for (var g = 0; 2 > g; g++)
                        if (null == this.modules[b][h - g]) {
                            var l = !1;
                            f < a.length && (l = 1 == (a[f] >>> e & 1));
                            m.getMask(d, b, h - g) && (l = !l);
                            this.modules[b][h - g] = l;
                            e--; -
                                1 == e && (f++,
                                    e = 7)
                        }
                    b += c;
                    if (0 > b || this.moduleCount <= b) {
                        b -= c;
                        c = -c;
                        break
                    }
                }
        }
    };
    t.PAD0 = 236;
    t.PAD1 = 17;
    t.createData = function (a, d, c) {
        d = u.getRSBlocks(a, d);
        for (var b = new C, e = 0; e < c.length; e++) {
            var f = c[e];
            b.put(f.mode, 4);
            b.put(f.getLength(), m.getLengthInBits(f.mode, a));
            f.write(b)
        }
        for (e = a = 0; e < d.length; e++)
            a += d[e].dataCount;
        if (b.getLengthInBits() > 8 * a)
            throw Error("code length overflow. (" + b.getLengthInBits() + ">" + 8 * a + ")");
        for (b.getLengthInBits() + 4 <= 8 * a && b.put(0, 4); 0 != b.getLengthInBits() % 8;)
            b.putBit(!1);
        for (; !(b.getLengthInBits() >= 8 * a);) {
            b.put(t.PAD0, 8);
            if (b.getLengthInBits() >= 8 * a)
                break;
            b.put(t.PAD1, 8)
        }
        return t.createBytes(b, d)
    };
    t.createBytes = function (a, d) {
        for (var c = 0, b = 0, e = 0, f = Array(d.length), h = Array(d.length), g = 0; g < d.length; g++) {
            var l = d[g].dataCount,
                p = d[g].totalCount - l;
            b = Math.max(b, l);
            e = Math.max(e, p);
            f[g] = Array(l);
            for (var k = 0; k < f[g].length; k++)
                f[g][k] = 255 & a.buffer[k + c];
            c += l;
            k = m.getErrorCorrectPolynomial(p);
            l = (new w(f[g], k.getLength() - 1)).mod(k);
            h[g] = Array(k.getLength() - 1);
            for (k = 0; k < h[g].length; k++)
                p = k + l.getLength() - h[g].length,
                    h[g][k] = 0 <= p ? l.get(p) : 0
        }
        for (k = g = 0; k < d.length; k++)
            g += d[k].totalCount;
        a = Array(g);
        for (k = c = 0; k < b; k++)
            for (g = 0; g < d.length; g++)
                k < f[g].length && (a[c++] = f[g][k]);
        for (k = 0; k < e; k++)
            for (g = 0; g < d.length; g++)
                k < h[g].length && (a[c++] = h[g][k]);
        return a
    };
    for (var r = {
        MODE_NUMBER: 1,
        MODE_ALPHA_NUM: 2,
        MODE_8BIT_BYTE: 4,
        MODE_KANJI: 8
    }, v = {
        L: 1,
        M: 0,
        Q: 3,
        H: 2
    }, m = {
        PATTERN_POSITION_TABLE: [
            [],
            [6, 18],
            [6, 22],
            [6, 26],
            [6, 30],
            [6, 34],
            [6, 22, 38],
            [6, 24, 42],
            [6, 26, 46],
            [6, 28, 50],
            [6, 30, 54],
            [6, 32, 58],
            [6, 34, 62],
            [6, 26, 46, 66],
            [6, 26, 48, 70],
            [6, 26, 50, 74],
            [6, 30, 54, 78],
            [6, 30, 56, 82],
            [6, 30, 58, 86],
            [6, 34, 62, 90],
            [6, 28, 50, 72, 94],
            [6, 26, 50, 74, 98],
            [6, 30, 54, 78, 102],
            [6, 28, 54, 80, 106],
            [6, 32, 58, 84, 110],
            [6, 30, 58, 86, 114],
            [6, 34, 62, 90, 118],
            [6, 26, 50, 74, 98, 122],
            [6, 30, 54, 78, 102, 126],
            [6, 26, 52, 78, 104, 130],
            [6, 30, 56, 82, 108, 134],
            [6, 34, 60, 86, 112, 138],
            [6, 30, 58, 86, 114, 142],
            [6, 34, 62, 90, 118, 146],
            [6, 30, 54, 78, 102, 126, 150],
            [6, 24, 50, 76, 102, 128, 154],
            [6, 28, 54, 80, 106, 132, 158],
            [6, 32, 58, 84, 110, 136, 162],
            [6, 26, 54, 82, 110, 138, 166],
            [6, 30, 58, 86, 114, 142, 170]
        ],
        G15: 1335,
        G18: 7973,
        G15_MASK: 21522,
        getBCHTypeInfo: function (a) {
            for (var d = a << 10; 0 <= m.getBCHDigit(d) - m.getBCHDigit(m.G15);)
                d ^= m.G15 << m.getBCHDigit(d) - m.getBCHDigit(m.G15);
            return (a << 10 | d) ^ m.G15_MASK
        },
        getBCHTypeNumber: function (a) {
            for (var d = a << 12; 0 <= m.getBCHDigit(d) - m.getBCHDigit(m.G18);)
                d ^= m.G18 << m.getBCHDigit(d) - m.getBCHDigit(m.G18);
            return a << 12 | d
        },
        getBCHDigit: function (a) {
            for (var d = 0; 0 != a;)
                d++,
                    a >>>= 1;
            return d
        },
        getPatternPosition: function (a) {
            return m.PATTERN_POSITION_TABLE[a - 1]
        },
        getMask: function (a, d, c) {
            switch (a) {
                case 0:
                    return 0 == (d + c) % 2;
                case 1:
                    return 0 == d % 2;
                case 2:
                    return 0 == c % 3;
                case 3:
                    return 0 == (d + c) % 3;
                case 4:
                    return 0 == (Math.floor(d / 2) + Math.floor(c / 3)) % 2;
                case 5:
                    return 0 == d * c % 2 + d * c % 3;
                case 6:
                    return 0 == (d * c % 2 + d * c % 3) % 2;
                case 7:
                    return 0 == (d * c % 3 + (d + c) % 2) % 2;
                default:
                    throw Error("bad maskPattern:" + a);
            }
        },
        getErrorCorrectPolynomial: function (a) {
            for (var d = new w([1], 0), c = 0; c < a; c++)
                d = d.multiply(new w([1, n.gexp(c)], 0));
            return d
        },
        getLengthInBits: function (a, d) {
            if (1 <= d && 10 > d)
                switch (a) {
                    case r.MODE_NUMBER:
                        return 10;
                    case r.MODE_ALPHA_NUM:
                        return 9;
                    case r.MODE_8BIT_BYTE:
                        return 8;
                    case r.MODE_KANJI:
                        return 8;
                    default:
                        throw Error("mode:" + a);
                }
            else if (27 > d)
                switch (a) {
                    case r.MODE_NUMBER:
                        return 12;
                    case r.MODE_ALPHA_NUM:
                        return 11;
                    case r.MODE_8BIT_BYTE:
                        return 16;
                    case r.MODE_KANJI:
                        return 10;
                    default:
                        throw Error("mode:" + a);
                }
            else if (41 > d)
                switch (a) {
                    case r.MODE_NUMBER:
                        return 14;
                    case r.MODE_ALPHA_NUM:
                        return 13;
                    case r.MODE_8BIT_BYTE:
                        return 16;
                    case r.MODE_KANJI:
                        return 12;
                    default:
                        throw Error("mode:" + a);
                }
            else
                throw Error("type:" + d);
        },
        getLostPoint: function (a) {
            for (var d = a.getModuleCount(), c = 0, b = 0; b < d; b++)
                for (var e = 0; e < d; e++) {
                    for (var f = 0, h = a.isDark(b, e), g = -1; 1 >= g; g++)
                        if (!(0 > b + g || d <= b + g))
                            for (var l = -1; 1 >= l; l++)
                                0 > e + l || d <= e + l || (0 != g || 0 != l) && h == a.isDark(b + g, e + l) && f++;
                    5 < f && (c += 3 + f - 5)
                }
            for (b = 0; b < d - 1; b++)
                for (e = 0; e < d - 1; e++)
                    if (f = 0,
                        a.isDark(b, e) && f++,
                        a.isDark(b + 1, e) && f++,
                        a.isDark(b, e + 1) && f++,
                        a.isDark(b + 1, e + 1) && f++,
                        0 == f || 4 == f)
                        c += 3;
            for (b = 0; b < d; b++)
                for (e = 0; e < d - 6; e++)
                    a.isDark(b, e) && !a.isDark(b, e + 1) && a.isDark(b, e + 2) && a.isDark(b, e + 3) && a.isDark(b, e + 4) && !a.isDark(b, e + 5) && a.isDark(b, e + 6) && (c += 40);
            for (e = 0; e < d; e++)
                for (b = 0; b < d - 6; b++)
                    a.isDark(b, e) && !a.isDark(b + 1, e) && a.isDark(b + 2, e) && a.isDark(b + 3, e) && a.isDark(b + 4, e) && !a.isDark(b + 5, e) && a.isDark(b + 6, e) && (c += 40);
            for (e = f = 0; e < d; e++)
                for (b = 0; b < d; b++)
                    a.isDark(b, e) && f++;
            return c + Math.abs(100 * f / d / d - 50) / 5 * 10
        }
    }, n = {
        glog: function (a) {
            if (1 > a)
                throw Error("glog(" + a + ")");
            return n.LOG_TABLE[a]
        },
        gexp: function (a) {
            for (; 0 > a;)
                a += 255;
            for (; 256 <= a;)
                a -= 255;
            return n.EXP_TABLE[a]
        },
        EXP_TABLE: Array(256),
        LOG_TABLE: Array(256)
    }, q = 0; 8 > q; q++)
        n.EXP_TABLE[q] = 1 << q;
    for (q = 8; 256 > q; q++)
        n.EXP_TABLE[q] = n.EXP_TABLE[q - 4] ^ n.EXP_TABLE[q - 5] ^ n.EXP_TABLE[q - 6] ^ n.EXP_TABLE[q - 8];
    for (q = 0; 255 > q; q++)
        n.LOG_TABLE[n.EXP_TABLE[q]] = q;
    w.prototype = {
        get: function (a) {
            return this.num[a]
        },
        getLength: function () {
            return this.num.length
        },
        multiply: function (a) {
            for (var d = Array(this.getLength() + a.getLength() - 1), c = 0; c < this.getLength(); c++)
                for (var b = 0; b < a.getLength(); b++)
                    d[c + b] ^= n.gexp(n.glog(this.get(c)) + n.glog(a.get(b)));
            return new w(d, 0)
        },
        mod: function (a) {
            if (0 > this.getLength() - a.getLength())
                return this;
            for (var d = n.glog(this.get(0)) - n.glog(a.get(0)), c = Array(this.getLength()), b = 0; b < this.getLength(); b++)
                c[b] = this.get(b);
            for (b = 0; b < a.getLength(); b++)
                c[b] ^= n.gexp(n.glog(a.get(b)) + d);
            return (new w(c, 0)).mod(a)
        }
    };
    u.RS_BLOCK_TABLE = [
        [1, 26, 19],
        [1, 26, 16],
        [1, 26, 13],
        [1, 26, 9],
        [1, 44, 34],
        [1, 44, 28],
        [1, 44, 22],
        [1, 44, 16],
        [1, 70, 55],
        [1, 70, 44],
        [2, 35, 17],
        [2, 35, 13],
        [1, 100, 80],
        [2, 50, 32],
        [2, 50, 24],
        [4, 25, 9],
        [1, 134, 108],
        [2, 67, 43],
        [2, 33, 15, 2, 34, 16],
        [2, 33, 11, 2, 34, 12],
        [2, 86, 68],
        [4, 43, 27],
        [4, 43, 19],
        [4, 43, 15],
        [2, 98, 78],
        [4, 49, 31],
        [2, 32, 14, 4, 33, 15],
        [4, 39, 13, 1, 40, 14],
        [2, 121, 97],
        [2, 60, 38, 2, 61, 39],
        [4, 40, 18, 2, 41, 19],
        [4, 40, 14, 2, 41, 15],
        [2, 146, 116],
        [3, 58, 36, 2, 59, 37],
        [4, 36, 16, 4, 37, 17],
        [4, 36, 12, 4, 37, 13],
        [2, 86, 68, 2, 87, 69],
        [4, 69, 43, 1, 70, 44],
        [6, 43, 19, 2, 44, 20],
        [6, 43, 15, 2, 44, 16],
        [4, 101, 81],
        [1, 80, 50, 4, 81, 51],
        [4, 50, 22, 4, 51, 23],
        [3, 36, 12, 8, 37, 13],
        [2, 116, 92, 2, 117, 93],
        [6, 58, 36, 2, 59, 37],
        [4, 46, 20, 6, 47, 21],
        [7, 42, 14, 4, 43, 15],
        [4, 133, 107],
        [8, 59, 37, 1, 60, 38],
        [8, 44, 20, 4, 45, 21],
        [12, 33, 11, 4, 34, 12],
        [3, 145, 115, 1, 146, 116],
        [4, 64, 40, 5, 65, 41],
        [11, 36, 16, 5, 37, 17],
        [11, 36, 12, 5, 37, 13],
        [5, 109, 87, 1, 110, 88],
        [5, 65, 41, 5, 66, 42],
        [5, 54, 24, 7, 55, 25],
        [11, 36, 12],
        [5, 122, 98, 1, 123, 99],
        [7, 73, 45, 3, 74, 46],
        [15, 43, 19, 2, 44, 20],
        [3, 45, 15, 13, 46, 16],
        [1, 135, 107, 5, 136, 108],
        [10, 74, 46, 1, 75, 47],
        [1, 50, 22, 15, 51, 23],
        [2, 42, 14, 17, 43, 15],
        [5, 150, 120, 1, 151, 121],
        [9, 69, 43, 4, 70, 44],
        [17, 50, 22, 1, 51, 23],
        [2, 42, 14, 19, 43, 15],
        [3, 141, 113, 4, 142, 114],
        [3, 70, 44, 11, 71, 45],
        [17, 47, 21, 4, 48, 22],
        [9, 39, 13, 16, 40, 14],
        [3, 135, 107, 5, 136, 108],
        [3, 67, 41, 13, 68, 42],
        [15, 54, 24, 5, 55, 25],
        [15, 43, 15, 10, 44, 16],
        [4, 144, 116, 4, 145, 117],
        [17, 68, 42],
        [17, 50, 22, 6, 51, 23],
        [19, 46, 16, 6, 47, 17],
        [2, 139, 111, 7, 140, 112],
        [17, 74, 46],
        [7, 54, 24, 16, 55, 25],
        [34, 37, 13],
        [4, 151, 121, 5, 152, 122],
        [4, 75, 47, 14, 76, 48],
        [11, 54, 24, 14, 55, 25],
        [16, 45, 15, 14, 46, 16],
        [6, 147, 117, 4, 148, 118],
        [6, 73, 45, 14, 74, 46],
        [11, 54, 24, 16, 55, 25],
        [30, 46, 16, 2, 47, 17],
        [8, 132, 106, 4, 133, 107],
        [8, 75, 47, 13, 76, 48],
        [7, 54, 24, 22, 55, 25],
        [22, 45, 15, 13, 46, 16],
        [10, 142, 114, 2, 143, 115],
        [19, 74, 46, 4, 75, 47],
        [28, 50, 22, 6, 51, 23],
        [33, 46, 16, 4, 47, 17],
        [8, 152, 122, 4, 153, 123],
        [22, 73, 45, 3, 74, 46],
        [8, 53, 23, 26, 54, 24],
        [12, 45, 15, 28, 46, 16],
        [3, 147, 117, 10, 148, 118],
        [3, 73, 45, 23, 74, 46],
        [4, 54, 24, 31, 55, 25],
        [11, 45, 15, 31, 46, 16],
        [7, 146, 116, 7, 147, 117],
        [21, 73, 45, 7, 74, 46],
        [1, 53, 23, 37, 54, 24],
        [19, 45, 15, 26, 46, 16],
        [5, 145, 115, 10, 146, 116],
        [19, 75, 47, 10, 76, 48],
        [15, 54, 24, 25, 55, 25],
        [23, 45, 15, 25, 46, 16],
        [13, 145, 115, 3, 146, 116],
        [2, 74, 46, 29, 75, 47],
        [42, 54, 24, 1, 55, 25],
        [23, 45, 15, 28, 46, 16],
        [17, 145, 115],
        [10, 74, 46, 23, 75, 47],
        [10, 54, 24, 35, 55, 25],
        [19, 45, 15, 35, 46, 16],
        [17, 145, 115, 1, 146, 116],
        [14, 74, 46, 21, 75, 47],
        [29, 54, 24, 19, 55, 25],
        [11, 45, 15, 46, 46, 16],
        [13, 145, 115, 6, 146, 116],
        [14, 74, 46, 23, 75, 47],
        [44, 54, 24, 7, 55, 25],
        [59, 46, 16, 1, 47, 17],
        [12, 151, 121, 7, 152, 122],
        [12, 75, 47, 26, 76, 48],
        [39, 54, 24, 14, 55, 25],
        [22, 45, 15, 41, 46, 16],
        [6, 151, 121, 14, 152, 122],
        [6, 75, 47, 34, 76, 48],
        [46, 54, 24, 10, 55, 25],
        [2, 45, 15, 64, 46, 16],
        [17, 152, 122, 4, 153, 123],
        [29, 74, 46, 14, 75, 47],
        [49, 54, 24, 10, 55, 25],
        [24, 45, 15, 46, 46, 16],
        [4, 152, 122, 18, 153, 123],
        [13, 74, 46, 32, 75, 47],
        [48, 54, 24, 14, 55, 25],
        [42, 45, 15, 32, 46, 16],
        [20, 147, 117, 4, 148, 118],
        [40, 75, 47, 7, 76, 48],
        [43, 54, 24, 22, 55, 25],
        [10, 45, 15, 67, 46, 16],
        [19, 148, 118, 6, 149, 119],
        [18, 75, 47, 31, 76, 48],
        [34, 54, 24, 34, 55, 25],
        [20, 45, 15, 61, 46, 16]
    ];
    u.getRSBlocks = function (a, d) {
        var c = u.getRsBlockTable(a, d);
        if (void 0 == c)
            throw Error("bad rs block @ typeNumber:" + a + "/errorCorrectLevel:" + d);
        a = c.length / 3;
        d = [];
        for (var b = 0; b < a; b++)
            for (var e = c[3 * b], f = c[3 * b + 1], h = c[3 * b + 2], g = 0; g < e; g++)
                d.push(new u(f, h));
        return d
    };
    u.getRsBlockTable = function (a, d) {
        switch (d) {
            case v.L:
                return u.RS_BLOCK_TABLE[4 * (a - 1)];
            case v.M:
                return u.RS_BLOCK_TABLE[4 * (a - 1) + 1];
            case v.Q:
                return u.RS_BLOCK_TABLE[4 * (a - 1) + 2];
            case v.H:
                return u.RS_BLOCK_TABLE[4 * (a - 1) + 3]
        }
    };
    C.prototype = {
        get: function (a) {
            return 1 == (this.buffer[Math.floor(a / 8)] >>> 7 - a % 8 & 1)
        },
        put: function (a, d) {
            for (var c = 0; c < d; c++)
                this.putBit(1 == (a >>> d - c - 1 & 1))
        },
        getLengthInBits: function () {
            return this.length
        },
        putBit: function (a) {
            var d = Math.floor(this.length / 8);
            this.buffer.length <= d && this.buffer.push(0);
            a && (this.buffer[d] |= 128 >>> this.length % 8);
            this.length++
        }
    };
    var x = [
        [17, 14, 11, 7],
        [32, 26, 20, 14],
        [53, 42, 32, 24],
        [78, 62, 46, 34],
        [106, 84, 60, 44],
        [134, 106, 74, 58],
        [154, 122, 86, 64],
        [192, 152, 108, 84],
        [230, 180, 130, 98],
        [271, 213, 151, 119],
        [321, 251, 177, 137],
        [367, 287, 203, 155],
        [425, 331, 241, 177],
        [458, 362, 258, 194],
        [520, 412, 292, 220],
        [586, 450, 322, 250],
        [644, 504, 364, 280],
        [718, 560, 394, 310],
        [792, 624, 442, 338],
        [858, 666, 482, 382],
        [929, 711, 509, 403],
        [1003, 779, 565, 439],
        [1091, 857, 611, 461],
        [1171, 911, 661, 511],
        [1273, 997, 715, 535],
        [1367, 1059, 751, 593],
        [1465, 1125, 805, 625],
        [1528, 1190, 868, 658],
        [1628, 1264, 908, 698],
        [1732, 1370, 982, 742],
        [1840, 1452, 1030, 790],
        [1952, 1538, 1112, 842],
        [2068, 1628, 1168, 898],
        [2188, 1722, 1228, 958],
        [2303, 1809, 1283, 983],
        [2431, 1911, 1351, 1051],
        [2563, 1989, 1423, 1093],
        [2699, 2099, 1499, 1139],
        [2809, 2213, 1579, 1219],
        [2953, 2331, 1663, 1273]
    ],
        E = function () {
            var a = function (d, c) {
                this._el = d;
                this._htOption = c
            };
            a.prototype.draw = function (d) {
                function c(l, p) {
                    l = document.createElementNS("http://www.w3.org/2000/svg", l);
                    for (var k in p)
                        p.hasOwnProperty(k) && l.setAttribute(k, p[k]);
                    return l
                }
                var b = this._htOption,
                    e = this._el,
                    f = d.getModuleCount();
                this.clear();
                var h = c("svg", {
                    viewBox: "0 0 " + String(f) + " " + String(f),
                    width: "100%",
                    height: "100%",
                    fill: b.colorLight
                });
                h.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
                e.appendChild(h);
                h.appendChild(c("rect", {
                    fill: b.colorLight,
                    width: "100%",
                    height: "100%"
                }));
                h.appendChild(c("rect", {
                    fill: b.colorDark,
                    width: "1",
                    height: "1",
                    id: "template"
                }));
                for (b = 0; b < f; b++)
                    for (e = 0; e < f; e++)
                        if (d.isDark(b, e)) {
                            var g = c("use", {
                                x: String(e),
                                y: String(b)
                            });
                            g.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template");
                            h.appendChild(g)
                        }
            };
            a.prototype.clear = function () {
                for (; this._el.hasChildNodes();)
                    this._el.removeChild(this._el.lastChild)
            };
            return a
        }(),
        H = "svg" === document.documentElement.tagName.toLowerCase() ? E : "undefined" == typeof CanvasRenderingContext2D ? function () {
            var a = function (d, c) {
                this._el = d;
                this._htOption = c
            };
            a.prototype.draw = function (d) {
                for (var c = this._htOption, b = this._el, e = d.getModuleCount(), f = Math.floor(c.width / e), h = Math.floor(c.height / e), g = ['<table style="border:0;border-collapse:collapse;">'], l = 0; l < e; l++) {
                    g.push("<tr>");
                    for (var p = 0; p < e; p++)
                        g.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + f + "px;height:" + h + "px;background-color:" + (d.isDark(l, p) ? c.colorDark : c.colorLight) + ';"></td>');
                    g.push("</tr>")
                }
                g.push("</table>");
                b.innerHTML = g.join("");
                d = b.childNodes[0];
                b = (c.width - d.offsetWidth) / 2;
                c = (c.height - d.offsetHeight) / 2;
                0 < b && 0 < c && (d.style.margin = c + "px " + b + "px")
            };
            a.prototype.clear = function () {
                this._el.innerHTML = ""
            };
            return a
        }() : function () {
            function a() {
                this._elImage.src = this._elCanvas.toDataURL("image/png");
                this._elImage.style.display = "block";
                this._elCanvas.style.display = "none"
            }

            function d(b, e) {
                var f = this;
                f._fFail = e;
                f._fSuccess = b;
                null === f._bSupportDataURI ? (b = document.createElement("img"),
                    e = function () {
                        f._bSupportDataURI = !1;
                        f._fFail && f._fFail.call(f)
                    },
                    b.onabort = e,
                    b.onerror = e,
                    b.onload = function () {
                        f._bSupportDataURI = !0;
                        f._fSuccess && f._fSuccess.call(f)
                    },
                    b.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==") : !0 === f._bSupportDataURI && f._fSuccess ? f._fSuccess.call(f) : !1 === f._bSupportDataURI && f._fFail && f._fFail.call(f)
            }
            var c = function (b, e) {
                this._bIsPainted = !1;
                this._android = D();
                this._htOption = e;
                this._elCanvas = document.createElement("canvas");
                this._elCanvas.width = e.width;
                this._elCanvas.height = e.height;
                b.appendChild(this._elCanvas);
                this._el = b;
                this._oContext = this._elCanvas.getContext("2d");
                this._bIsPainted = !1;
                this._elImage = document.createElement("img");
                this._elImage.alt = "Scan me!";
                this._elImage.style.display = "none";
                this._el.appendChild(this._elImage);
                this._bSupportDataURI = null
            };
            c.prototype.draw = function (b) {
                var e = this._elImage,
                    f = this._oContext,
                    h = this._htOption,
                    g = b.getModuleCount(),
                    l = h.width / g,
                    p = h.height / g,
                    k = Math.round(l),
                    F = Math.round(p);
                e.style.display = "none";
                this.clear();
                for (e = 0; e < g; e++)
                    for (var y = 0; y < g; y++) {
                        var G = b.isDark(e, y),
                            z = y * l,
                            A = e * p;
                        f.strokeStyle = G ? h.colorDark : h.colorLight;
                        f.lineWidth = 1;
                        f.fillStyle = G ? h.colorDark : h.colorLight;
                        f.fillRect(z, A, l, p);
                        f.strokeRect(Math.floor(z) + .5, Math.floor(A) + .5, k, F);
                        f.strokeRect(Math.ceil(z) - .5, Math.ceil(A) - .5, k, F)
                    }
                this._bIsPainted = !0
            };
            c.prototype.makeImage = function () {
                this._bIsPainted && d.call(this, a)
            };
            c.prototype.isPainted = function () {
                return this._bIsPainted
            };
            c.prototype.clear = function () {
                this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height);
                this._bIsPainted = !1
            };
            c.prototype.round = function (b) {
                return b ? Math.floor(1E3 * b) / 1E3 : b
            };
            return c
        }();
    QRCode = function (a, d) {
        this._htOption = {
            width: 256,
            height: 256,
            typeNumber: 4,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: v.H
        };
        "string" === typeof d && (d = {
            text: d
        });
        if (d)
            for (var c in d)
                this._htOption[c] = d[c];
        "string" == typeof a && (a = document.getElementById(a));
        this._htOption.useSVG && (H = E);
        this._android = D();
        this._el = a;
        this._oQRCode = null;
        this._oDrawing = new H(this._el, this._htOption);
        this._htOption.text && this.makeCode(this._htOption.text)
    };
    QRCode.prototype.makeCode = function (a) {
        var d = this._htOption.correctLevel,
            c = 1;
        var b = encodeURI(a).toString().replace(/%[0-9a-fA-F]{2}/g, "a");
        b = b.length + (b.length != a ? 3 : 0);
        for (var e = 0, f = x.length; e <= f; e++) {
            var h = 0;
            switch (d) {
                case v.L:
                    h = x[e][0];
                    break;
                case v.M:
                    h = x[e][1];
                    break;
                case v.Q:
                    h = x[e][2];
                    break;
                case v.H:
                    h = x[e][3]
            }
            if (b <= h)
                break;
            else
                c++
        }
        if (c > x.length)
            throw Error("Too long data");
        this._oQRCode = new t(c, this._htOption.correctLevel);
        this._oQRCode.addData(a);
        this._oQRCode.make();
        this._el.title = a;
        this._oDrawing.draw(this._oQRCode);
        this.makeImage()
    };
    QRCode.prototype.makeImage = function () {
        "function" == typeof this._oDrawing.makeImage && (!this._android || 3 <= this._android) && this._oDrawing.makeImage()
    };
    QRCode.prototype.clear = function () {
        this._oDrawing.clear()
    };
    QRCode.CorrectLevel = v
})();
