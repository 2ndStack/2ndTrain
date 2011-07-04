var QS = require('querystring');
var _ = require('underscore');
var jsdom = require('jsdom');
var htmlparser = require("htmlparser");
var sys = require('sys');
var http = require('http');
var dateFormatter = require('./dateformat'); //Add Format Functionality For Date Object

var TrainSchedule = function(jadwal, asal, tujuan, callback) {

    var station = {
        bd :{
            kode : "BD#BANDUNG" ,
            nama :"Bandung"
        },
        bw :{
            kode : "BW#BANYUWANGI" ,
            nama :"Banyuwangi"
        },
        cp :{
            kode : "CP#CILACAP" ,
            nama :"Cilacap"
        },
        cn :{
            kode : "CN#CIREBON" ,
            nama :"Cirebon"
        },
        gmr :{
            kode : "GMR#JAKARTA [Gambir]" ,
            nama :"Jakarta [Gambir]"
        },
        jak :{
            kode : "JAK#JAKARTA [Kota]" ,
            nama :"Jakarta [Kota]"
        },
        pse :{
            kode : "PSE#JAKARTA [Pasar Senen]" ,
            nama :"Jakarta [Pasar Senen]"
        },
        jr :{
            kode : "JR#JEMBER" ,
            nama :"Jember"
        },
        jg :{
            kode : "JG#JOMBANG" ,
            nama :"Jombang"
        },
        kd :{
            kode : "KD#KEDIRI" ,
            nama :"Kediri"
        },
        kta :{
            kode : "KTA#KUTOARJO" ,
            nama :"Kutoarjo"
        },
        mn :{
            kode : "MN#MADIUN" ,
            nama :"Madiun"
        },
        ml :{
            kode : "ML#MALANG" ,
            nama :"Malang"
        },
        pwt :{
            kode : "PWT#PURWOKERTO" ,
            nama :"Purwokerto"
        },
        smt :{
            kode : "SMT#SEMARANG [Tawang]" ,
            nama :"Semarang [Tawang]"
        },
        slo :{
            kode : "SLO#SOLOBALAPAN" ,
            nama :"Solo Balapan"
        },
        sgu :{
            kode : "SGU#SURABAYA [Gubeng]" ,
            nama :"Surabaya [Gubeng]"
        },
        sbi :{
            kode : "SBI#SURABAYA [Pasar Turi]" ,
            nama :"Surabaya [Pasar Turi]"
        },
        tg :{
            kode : "TG#TEGAL" ,
            nama :"Tegal"
        },
        yk :{
            kode : "YK#YOGYAKARTA" ,
            nama :"Yogyakarta"
        }
    };

    var params = {
        'tgl_jadwal': jadwal.format("yyyy-mm-dd#dddd, dd mmmm yyyy", "ID"),
        'stn_asal':station[asal.toLowerCase()].kode,
        'stn_tujuan':station[tujuan.toLowerCase()].kode,
        'cari':'Tampilkan'
    };

    var options = {
        host: 'www.kereta-api.co.id',
        port: 80,
        path: '/index.php?option=com_jadwal',
        method: 'POST',
        headers:{
            'Accept':    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    var result = [];

    var req = http.request(options, function(res) {
//        console.log('STATUS: ' + res.statusCode);
//        console.log('HEADERS: ' + JSON.stringify(res.headers));

//        console.log(JSON.stringify(params));
        res.setEncoding('utf8');
        var data = '';
        var i = 0;
        res.on('data', function (chunk) {
            data = data + chunk;
        });
        res.on('end', function() {

            jsdom.env(data,
                [
                    'http://code.jquery.com/jquery-1.5.min.js'
                ],
                function(errors, window) {
//                    console.log('start');
                    var kereta = [];
                    window.$('tr.Row1').each(function() {
                        var p = window.$(this).find('b').html();
                        kereta.push(p);
//                        console.log(p);
                    });

                    var i = 0;
                    window.$('tr.Row0').each(function() {
                        var obj = {};
                        var p = window.$(this).children('.TextRow');
                        obj.kereta = kereta[i++];
                        obj.nomor = p.first().html();
                        obj.berangkat = p.first().next().html();
                        obj.datang = p.first().next().next().html();
                        obj.detail = [];
                        p.last().find('tr').each(function() {
                            var det = {};
                            var x = window.$(this).children('td');
                            det.kelas = x.first().html();
                            det.harga = x.last().html();
                            obj.detail.push(det);
                        });
                        result.push(obj);
                    });

                    callback(result);
//                    console.log(sys.inspect(result));
//                    console.log('finish');


                }
            );
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    var paramString = QS.stringify(params);
//    console.log(paramString);

    req.end(paramString);

};

//console.log(req);

TrainSchedule(new Date(2011, 6, 12), 'SGU', 'YK', function(result) {
//    console.log(JSON.stringify(result));
    _.each(result, function(obj) {
        console.log(obj.kereta);
        console.log(obj.nomor);
        console.log(obj.berangkat);
        console.log(obj.datang);
        _.each(obj.detail, function(xx) {
            console.log(xx.kelas + ' Rp.' + xx.harga);
        });
        console.log('-------------');
    });
});


//console.log(dateFormat.DateFormat("Jun 9 2007", "fullDate"));

/*
 var now = new Date();

 console.log(now.format("yyyy-mm-dd#dddd, dd mmmm yyyy", "ID"));
 console.log(dateFormatter.format(now, "longTime", "ID", true));
 console.log(JSON.stringify(dateFormatter.format.i18n.en));*/

