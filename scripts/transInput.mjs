// 这些数据需要在 百度翻译网页中拿

/** window.gtk */
export const gtk = '320305.131321201';
/** 请求接口中有*/
export const token = '1b6270284894542cd54a260711e60152';
export const cookie =
    'PSTM=1651236963; BAIDUID=5F989AE0E8266A03D9D504FAEF02B2C5:FG=1; BIDUPSID=87999852B5BB4715C6FF9E860631C026; MCITY=-257:; newlogin=1; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; BDUSS=lFBTks2Qmo0RlQzSWhHQWljSUl2SEZTZVlhUmJ5akJGUkZwWjhRQXdER2JQSHhqRUFBQUFBJCQAAAAAAAAAAAEAAADGO4cwYWxleGg0MgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJuvVGObr1RjY; BDUSS_BFESS=lFBTks2Qmo0RlQzSWhHQWljSUl2SEZTZVlhUmJ5akJGUkZwWjhRQXdER2JQSHhqRUFBQUFBJCQAAAAAAAAAAAEAAADGO4cwYWxleGg0MgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJuvVGObr1RjY; APPGUIDE_10_0_2=1; REALTIME_TRANS_SWITCH=1; FANYI_WORD_SWITCH=1; HISTORY_SWITCH=1; SOUND_SPD_SWITCH=1; SOUND_PREFER_SWITCH=1; BAIDUID_BFESS=5F989AE0E8266A03D9D504FAEF02B2C5:FG=1; BA_HECTOR=80a40h2ga02ga4010k800p361hmhb271f; ZFY=CRFpkf1H59OvJXAq3THjbvq1qrdlbG1M03qd97KWxxM:C; BAIDU_WISE_UID=wapp_1667811492911_321; __bid_n=1845476a681ff1b5af4207; RT="z=1&dm=baidu.com&si=5107ba8f-9ef9-4019-861f-e1cf3dda8016&ss=la7fdt5d&sl=b&tt=73d&bcn=https://fclog.baidu.com/log/weirwood?type=perf&ld=adrr&ul=f790&hd=f7c2"; H_PS_PSSID=36547_37555_37683_37584_36885_34812_37728_36803_37533_37497_37741_26350; delPer=0; PSINO=7; Hm_lvt_64ecd82404c51e03dc91cb9e8c025574=1667258602,1667302770,1667376532,1667877185; Hm_lpvt_64ecd82404c51e03dc91cb9e8c025574=1667881125; ab_sr=1.0.1_YWI4MTQ0N2NmMjI3NjBjMzI1NDE1MjhmYTdkMmMzMmE1NGJmMDAxNTQ0M2IzZjA4MTdmZGNmNWRiMzE4MTg0ZTYxM2I5MTdmNzI0NWQ4NGY1NGJlNTZmZDI5MDVmYzY5ZjUwNDdhYjIyZjc2YWIyMGRiOWI5NWZjZTRhYzcyMGYyZWI5YmJhNTliZTA1YTI0MjJmNzliOTc1MTljYjNlNzllMzVmNjhmZWYyMzgzMjFhN2Y1MjYzMDY5MWU1YmEx';

function n(r, o) {
    for (var t = 0; t < o.length - 2; t += 3) {
        var a = o.charAt(t + 2);
        (a = a >= 'a' ? a.charCodeAt(0) - 87 : Number(a)),
            (a = '+' === o.charAt(t + 1) ? r >>> a : r << a),
            (r = '+' === o.charAt(t) ? (r + a) & 4294967295 : r ^ a);
    }
    return r;
}

export function getSign(r, gtk) {
    var o = r.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g);
    if (null === o) {
        var t = r.length;
        t > 30 &&
            (r = '' + r.substr(0, 10) + r.substr(Math.floor(t / 2) - 5, 10) + r.substr(-10, 10));
    } else {
        for (
            var e = r.split(/[\uD800-\uDBFF][\uDC00-\uDFFF]/), C = 0, h = e.length, f = [];
            h > C;
            C++
        )
            '' !== e[C] && f.push.apply(f, a(e[C].split(''))), C !== h - 1 && f.push(o[C]);
        var g = f.length;
        g > 30 &&
            (r =
                f.slice(0, 10).join('') +
                f.slice(Math.floor(g / 2) - 5, Math.floor(g / 2) + 5).join('') +
                f.slice(-10).join(''));
    }
    var u = void 0,
        l = '' + String.fromCharCode(103) + String.fromCharCode(116) + String.fromCharCode(107);
    u = null !== gtk ? gtk : (gtk = window[l] || '') || '';
    for (
        var d = u.split('.'), m = Number(d[0]) || 0, s = Number(d[1]) || 0, S = [], c = 0, v = 0;
        v < r.length;
        v++
    ) {
        var A = r.charCodeAt(v);
        128 > A
            ? (S[c++] = A)
            : (2048 > A
                  ? (S[c++] = (A >> 6) | 192)
                  : (55296 === (64512 & A) &&
                    v + 1 < r.length &&
                    56320 === (64512 & r.charCodeAt(v + 1))
                        ? ((A = 65536 + ((1023 & A) << 10) + (1023 & r.charCodeAt(++v))),
                          (S[c++] = (A >> 18) | 240),
                          (S[c++] = ((A >> 12) & 63) | 128))
                        : (S[c++] = (A >> 12) | 224),
                    (S[c++] = ((A >> 6) & 63) | 128)),
              (S[c++] = (63 & A) | 128));
    }
    for (
        var p = m,
            F =
                '' +
                String.fromCharCode(43) +
                String.fromCharCode(45) +
                String.fromCharCode(97) +
                ('' + String.fromCharCode(94) + String.fromCharCode(43) + String.fromCharCode(54)),
            D =
                '' +
                String.fromCharCode(43) +
                String.fromCharCode(45) +
                String.fromCharCode(51) +
                ('' + String.fromCharCode(94) + String.fromCharCode(43) + String.fromCharCode(98)) +
                ('' + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(102)),
            b = 0;
        b < S.length;
        b++
    )
        (p += S[b]), (p = n(p, F));
    return (
        (p = n(p, D)),
        (p ^= s),
        0 > p && (p = (2147483647 & p) + 2147483648),
        (p %= 1e6),
        p.toString() + '.' + (p ^ m)
    );
}
