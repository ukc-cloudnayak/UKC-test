jQuery(document).ready(function() {
  // module connectors configuration
  jQuery('.mod').each(function() {
    jQuery(this).attr('data-connectors', '1');
  });
});

// extend Tc.Module Class
Tc.Module = Tc.Module.extend({
  onInitStyle: function(data) {
    var $ctx = this.$ctx;

    if(data['color_scheme']) {
      $ctx.removeClass(/colorScheme.+/);
      $ctx.addClass("colorScheme"+Tc.Utils.String.capitalize(data['color_scheme']));
    }

  }
});

jQuery.extend({
  randomColor: function() {
    return '#' + Math.floor(Math.random()*256*256*256).toString(16);
  }
});

(function(removeClass) {
  jQuery.fn.removeClass = function(value) {
    if(value && typeof value.test === 'function') {
      for(var i = 0; i < this.length; i++) {
        var elem = this[i];
        if( elem.nodeType === 1 && elem.className ) {
          var classNames = elem.className.split(/\s+/);
          for(var n = 0; n < classNames.length; n++) {
            if(value.test(classNames[n])) {
              classNames.splice(n, 1);
            }
          }
          elem.className = jQuery.trim(classNames.join(" "));
        }
      }
    } else {
      removeClass.call(this, value);
    }

    return this
  }
})(jQuery.fn.removeClass);

jQuery(document).ready(function() {
  jQuery('html').removeClass('no-js');
});


// The following are from codekit project

// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
jQuery(document).foundation();


(function($) {
  $(document).ready(function() {

    $('.milestone strong').appear(function() {
      $(this).countTo(100);
    });

    $(".bars").each(function() {
      $('> li > .highlighted', $(this)).each(function() {
        $(this).appear(function() {
          var percent = $(this).attr("data-percent");
          // $bar.html('<p class="highlighted"><span class="tip">'+percent+'%</span></p>');
          // http://stackoverflow.com/questions/3363035/jquery-animate-forces-style-overflowhidden
          $(this).animate({
            'width': percent + '%'
          }, 1700, function() { $(this).css('overflow', 'visible'); });
        });
      });
    });

    $(".members").each(function() {

      var members = $(this);

      $(this).find('.member').each(function() {
        $(this).click(function() {
          $(members).find('.member').removeClass('active');
          $(this).addClass('active');
          var target = $(this).attr('data-target');
          // console.log($(members).find('.member-intro'));
          $(members).find('.member-intro').removeClass('active');
          $(target).addClass('active');
        });
      });

    });

    $('.fadeinleft, .fadeinright, .fadein').appear(function() {
      var delay = $(this).data('delay');
      var that = this;

      setTimeout(function() {
        $(that).addClass('appear');
      }, delay)

      // $(this).delay(delay).addClass('appear');
      // $.delay(delay).addClass('appear');
      // $(this).addClass('appear');
    });

    $('ul#filter li a').click(function() {
      $('ul#filter li').removeClass('current');
      $(this).closest('li').addClass('current');

      var cat = $(this).attr('data-cat');

      var gallery = $('ul#filter').closest('.gallery-wrapper').find('ul.gallery');

      if (cat === 'all') {
        $('li', gallery).removeClass('hidden');
      } else {
        $('li', gallery).each(function() {
          if ($(this).hasClass(cat)) {
            $(this).removeClass('hidden');
          } else {
            $(this).addClass('hidden');
          }
        });
      }

      return false;
    });


    $('form#contact').validate({
      messages: { },
      submitHandler: function(form) {
        $.ajax({
          type: 'POST',
          url: 'send.php',
          data: $(form).serialize(),
          success: function(data) {
            if(data.match(/success/)) {
              $(form).trigger('reset');
              $('#thanks').show().fadeOut(5000);
            }
          }
        });
        return false;
      }
    });


  });
})(jQuery);
(function($) {
  Tc.Module.StylePanel = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
      this.require('jquery.cookie.js', 'plugin', 'onBinding');
      this.require('json2.js', 'plugin', 'onBinding');
      this.require('jquery.url.js', 'plugin', 'onBinding');
    },
    setCookie: function(key, value) {
      var cookie = JSON.parse($.cookie('squarebox_html') || '{}') || {};
      cookie[key] = value;
      $.cookie('squarebox_html', JSON.stringify(cookie), { expires: 7, path: '../default.htm' });
    },
    readCookie: function(key) {
      var cookie = JSON.parse($.cookie('squarebox_html') || '{}') || {};
      if(key) {
        return cookie[key];
      } else {
        return cookie;
      }
    },
    reloadMod: function() {
      // to make css pie work
      $('.ie8 .mod *').each(function() {
        var klass = $(this).attr('class');
        $(this).attr('class', klass);
      });
    },
    afterBinding: function() {
      // $.cookie('squarebox_html', null);
      var $ctx = this.$ctx;

      if(this.readCookie('bg_pattern')) {
        $('body').removeClass(/pattern\-\d+/);
        $('body').addClass(this.readCookie('bg_pattern'));
      }

      if(this.readCookie('color_scheme')) {
        $('body').removeClass(/colorScheme.+/);
        $('body').addClass("colorScheme"+Tc.Utils.String.capitalize(this.readCookie('color_scheme')));
      }

      this.fire('initStyle', this.readCookie());

      this.reloadMod();

      if($.url().param('screenshot')) {
        $ctx.hide();
      }
    },
    onBinding: function() {
      var $ctx = this.$ctx;
      var that = this;

      // $ctx.css('margin-left', '0');

      $('.panel-container').find('.bg_pattern').click(function() {
        that.setCookie('bg_pattern', $(this).attr('id'));
        that.afterBinding();
        return false;
      });

      $('.panel-container').find('.color_scheme').click(function() {
        that.setCookie('color_scheme', $(this).attr('id'));
        that.afterBinding();
        return false;
      });

      $('.switch', $ctx).click(function() {
        if($(this).hasClass('to-open')) {
          $(this).removeClass('to-open');
          $(this).addClass('to-close');
          $ctx.stop().animate({"left": $('.panel-container', $ctx).outerWidth() }, {duration: 500});
        } else {
          $(this).removeClass('to-close');
          $(this).addClass('to-open');
          $ctx.stop().animate({"left": "0px"}, {duration: 500});
        }

        return false;
      });

    }
  })
})(Tc.$);


