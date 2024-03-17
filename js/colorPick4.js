/*!
*
* ColorPick jQuery plugin
* https://github.com/philzet/ColorPick.js
*
* Copyright (c) 2017-2019 Phil Zet (a.k.a. Phil Zakharchenko)
* Licensed under the MIT License
*
*/
(function( $ ) {

    $.fn.colorPick = function(config) {

        return this.each(function() {
            new $.colorPick(this, config || {});
        });

    };

    $.colorPick = function (element, options) {
        options = options || {};
        this.options = $.extend({}, $.fn.colorPick.defaults, options);
        if(options.str) {
            this.options.str = $.extend({}, $.fn.colorPick.defaults.str, options.str);
        }
        $.fn.colorPick.defaults = this.options;

        var uniquePalette = [];
        $.each($.fn.colorPick.defaults.palette.map(function(x){ return x.toUpperCase() }), function(i, el){
            if($.inArray(el, uniquePalette) === -1) uniquePalette.push(el);
        });

        this.palette = uniquePalette;
	this.position = $(element).html();
	this.colorCD = 0;
        this.color   = this.palette[this.options.initialColor-2];
        this.element = $(element);

        var dataInitialColor = this.element.data('initialcolor');
        if (dataInitialColor) {
            this.color = dataInitialColor;
            this.appendToStorage(this.color);
        }


        return this.element.hasClass(this.options.pickrclass) ? this : this.init();
    };

    $.fn.colorPick.defaults = {
        'initialColor': 7,
        'paletteLabel': 'Cube palette:',
        'allowRecent': false,
        'recentMax': 6,
        'allowCustomColor': false,
        'palette': ["#FF6907", "#00A75D", "#B60101", "#213DFD", "#FFD500", "#888", "#FFF"],
        'onColorSelected': function() {
		this.element.css({'backgroundColor': this.color, 'color': this.color});
		this.colorCD = this.palette.indexOf(this.color) + 2;
		console.log("The user has selected the color: " + this.colorCD);
        }
    };

    $.colorPick.prototype = {

        init : function(){

            var self = this;
            var o = this.options;

            $.proxy($.fn.colorPick.defaults.onColorSelected, this)();

            this.element.click(function(event) {
                if (event.target != event.currentTarget){
			        return;
				}

                var offset = $(self.element).offset();

                event.preventDefault();
                self.show(self.element, event.pageX - offset.left-100, event.pageY - offset.top);

                $('.customColorHash').val(self.color);

                $('.colorPickButton').click(function(event) {
					self.color = $(event.target).attr('hexValue');
					self.appendToStorage($(event.target).attr('hexValue'));
					self.hide();
					$.proxy(self.options.onColorSelected, self)();
					return false;
            	});
                $('.customColorHash').click(function(event) {
                    return false;
                }).keyup(function (event) {
                    var hash = $(this).val();
                    if (hash.indexOf('#') !== 0) {
                        hash = "#"+hash;
                    }
                    if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hash)) {
                        self.color = hash;
                        self.appendToStorage(hash);
                        $.proxy(self.options.onColorSelected, self)();
                        $(this).removeClass('error');
                    } else {
                        $(this).addClass('error');
                    }
                });

                return false;
            }).blur(function() {
                self.element.val(self.color);
                $.proxy(self.options.onColorSelected, self)();
                self.hide();
                return false;
            });

            $(document).on('click', function(event) {
                if ($.contains(self.element[0], event.target)){
                    return;
                }
                self.hide();
                return true;
            });

            return this;
        },

        appendToStorage: function(color) {
	        if ($.fn.colorPick.defaults.allowRecent === true) {
	        	var storedColors = JSON.parse(localStorage.getItem("colorPickRecentItems"));
				if (storedColors == null) {
		     	    storedColors = [];
	        	}
				if ($.inArray(color, storedColors) == -1) {
		    	    storedColors.unshift(color);
					storedColors = storedColors.slice(0, $.fn.colorPick.defaults.recentMax)
					localStorage.setItem("colorPickRecentItems", JSON.stringify(storedColors));
	        	}
	        }
        },

        show: function(element, left, top) {

            $(".colorPickWrapper").remove();

            $(element).prepend('<div class="colorPickWrapper"><div id="colorPick" style="display:none;top:' + top + 'px;left:' + left + 'px"><span>'+$.fn.colorPick.defaults.paletteLabel+'</span></div></div>');

	        jQuery.each(this.palette, function (index, item) {
				$("#colorPick").append('<div class="colorPickButton" hexValue="' + item + '" style="background:' + item + '"></div>');
			});
            if ($.fn.colorPick.defaults.allowCustomColor === true) {
                $("#colorPick").append('<input type="text" style="margin-top:5px" class="customColorHash" />');
            }
			if ($.fn.colorPick.defaults.allowRecent === true) {
				$("#colorPick").append('<span style="margin-top:5px">Recent:</span>');
				if (JSON.parse(localStorage.getItem("colorPickRecentItems")) == null || JSON.parse(localStorage.getItem("colorPickRecentItems")) == []) {
					$("#colorPick").append('<div class="colorPickButton colorPickDummy"></div>');
				} else {
					jQuery.each(JSON.parse(localStorage.getItem("colorPickRecentItems")), function (index, item) {
		        		$("#colorPick").append('<div class="colorPickButton" hexValue="' + item + '" style="background:' + item + '"></div>');
                        if (index == $.fn.colorPick.defaults.recentMax-1) {
                            return false;
                        }
					});
				}
			}
	        $("#colorPick").fadeIn(200);
        },

	    hide: function() {
		    $( ".colorPickWrapper" ).fadeOut(200, function() {
                $(".colorPickWrapper").remove();
			    return this;
			});
        },

    };
}( jQuery ));

function getNumValue(id, min, max) {
  var result = parseInt($(id).val());
  if (isNaN(result) || result < min) {
    result = min;
  } else if (result > max) {
    result = max;
  }
  return result;
}

function onInputRGB() {
  var r = getNumValue('#rgb_r', 0, 255);
  var g = getNumValue('#rgb_g', 0, 255);
  var b = getNumValue('#rgb_b', 0, 255);
  var o = getNumValue('#rgb_o', 0, 255);
  var w = getNumValue('#rgb_w', 0, 255);
  setRgbRange(r, g, b, o, w);

  var code = convertRgbToCode(r, g, b);
  setCode(code);
}

function onInputRange(fromId, toId) {
  $('#' + toId).val($('#' + fromId).val());
  onInputRGB();
}

function onInputCode() {
  var code = $('#camera_code').val().replace(/[^0-9a-f]/ig, '');
  code = (code + '000000').substr(0, 6);
  return;
  setPreview('#' + code);

  var rgb = convertCodeToRgb(code);
  setRgb(rgb.r, rgb.g, rgb.b, rgb.o, rgb.w);
  setRgbRange(rgb.r, rgb.g, rgb.b, rgb.o, rgb.w);

}

function convertRgbToCode(r, g, b) {
  var codeR = ('0' + r.toString(16)).slice(-2);
  var codeG = ('0' + g.toString(16)).slice(-2);
  var codeB = ('0' + b.toString(16)).slice(-2);
  return '#' + (codeR + codeG + codeB).toUpperCase();
}

function convertCodeToRgb(code) {
  var rgb = {};
  rgb.r = parseInt(code.substr(0, 2), 16);
  rgb.g = parseInt(code.substr(2, 2), 16);
  rgb.b = parseInt(code.substr(4, 2), 16);
  return rgb;
}

function setRgb(r, g, b, o, w) {
  $('#rgb_r').val(r);
  $('#rgb_g').val(g);
  $('#rgb_b').val(b);
  $('#rgb_o').val(o);
  $('#rgb_w').val(w);
}

function setRgbRange(r, g, b, o, w) {
  $('#range_rgb_r').val(r);
  $('#range_rgb_g').val(g);
  $('#range_rgb_b').val(b);
  $('#range_rgb_o').val(o);
  $('#range_rgb_w').val(w);
}

function setCode(code) {
  $('#preview_code').val(code);
}

function get_color(c) {
	return c == 'r' ? 'red' :
		   c == 'o' ? 'orange' :
		   c == 'g' ? 'lime' :
		   c == 'y' ? 'yellow' :
		   c == 'b' ? 'deepskyblue' :
		   c == 'w' ? 'white' : 'gray';
}

var result = '';
var timer = null;
function capture() {
	if (localMediaStream) {
   		ctx.drawImage(video, 0, 0, video.width, video.height);
		var fail = false;
                result = "";
		var count = {'r':0,'o':0,'y':0,'g':0,'b':0};
		for (var y = 5-N; y < 5; y++) {
			for (var x = 5-N; x < 5; x++) {
				var data = ctx.getImageData(40+x*30+15, 10+y*30+15, 10, 10);
//				console.log(data.data);
				var r = 0, g = 0, b = 0;
				for (var i = 0; i < 100; i++) {
					r += data.data[i*4+0];
					g += data.data[i*4+1];
					b += data.data[i*4+2];
				}
				r /= 100; g /= 100; b /= 100;
                                var wbalan = $('#rgb_w').val() / 128;
                                var wrthre = wbalan * $('#rgb_r').val();
                                var wgthre = wbalan * $('#rgb_g').val();
                                var wbthre = wbalan * $('#rgb_b').val();
                                var wothre = wbalan * $('#rgb_o').val();
				var code = (r > wrthre ? 1 : 0) | (g > wgthre ? 2 : 0) | (b > wbthre ? 4 : 0);
				code = ['0','r','g','y','b','p','b','w'][code];
				if (code && code == 'r' && (g > wothre)) code = 'o'
				console.log("rgb="+r+", "+b+", "+g+" -> "+(code||"-"))
				document.getElementById('r'+y+x).style.backgroundColor = get_color(code||'');
				if (code) {
					result += code;
					if (('roygb'.indexOf(code)>=0) && (++count[code] > 5)) {
//						fail = true;
					}
				} else {
//					fail = true;
				}
			}
		}
		if (fail) {
			stop();
		}
	}
	if (!fail) {
		if (timer) clearTimeout(timer);
		timer = setTimeout(capture, 500);
	}
}
var CounterC = 0;
function flushC(tm,cnt=8,id="#standby") {
    CounterC++;
    setTimeout(function(){
            $(id).css('background-color',CounterC%2?'orange':'#ccc');
            cnt>CounterC?flushC(tm,cnt,id):($(id).css('background-color',"orange"),CounterC=0);
        },tm); // 
}
async function start() {
    const devices = (await navigator.mediaDevices.enumerateDevices())
    .filter((device) => device.kind === 'videoinput')
    .map((device) => {
      return {
        text: device.label,
        value: device.deviceId,
      };
    });
    $("#cams").html(""); 
    for (let i=0;i<devices.length;i++) {
        $("#cams").html($("#cams").html()+(i+1)+":"+ devices[i].text+"\n");
    }
//    $('#rgb_r').focus();
    if ($('#rgb_w').val()==255) {
         setRgb(125, 125, 145, 100, 150);
    setRgbRange(125, 125, 145, 100, 150);
    }
    navigator.mediaDevices.getUserMedia({
            video: { deviceId: devices[document.frm.camsel.value].value },
            audio: false,
        }).then(stream => {
	    video.srcObject = stream;
            localMediaStream = stream;
	    capture();
        }).catch(e => {
            console.log("Camera capture failed: ",e)
        });
     CounterC = 0; // start button flush 
     flushC(250,1000,"#standby");
}

function stop() { // éBëúÇÉpÅ[ÉcèCê≥ÉuÉçÉbÉNfieldXÇ…à⁄ì]
    CounterC = 1000; // stop button flush 
//	if (video.srcObject) video.srcObject.stop();
	localMediaStream = null;
	if (timer) clearTimeout(timer);
	timer = null;
        document.frm.data.value = result;
	setTile(result);
}
