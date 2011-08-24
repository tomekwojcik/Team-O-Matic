(function() {
  var $;
  $ = window.jQuery;
  $(document).ready(function() {
    var display_error, form;
    form = $('#form');
    $('#alert').fadeOut();
    display_error = function(message) {
      var hide_error, timeout;
      timeout = null;
      hide_error = function() {
        $('#alert').fadeOut('fast');
        window.clearTimeout(timeout);
        return timeout = null;
      };
      $('#alert p').text(message);
      return $('#alert').fadeIn('fast', function() {
        return timeout = window.setTimeout(hide_error, 3000);
      });
    };
    return form.submit(function(event) {
      var ajax_complete, ajax_error, ajax_response, ajax_success, ajax_timeout, data, item, _i, _len, _ref;
      event.stopPropagation();
      event.preventDefault();
      ajax_response = null;
      ajax_timeout = null;
      ajax_complete = function() {
        $('#people, #submit').attr('disabled', false);
        window.clearTimeout(ajax_timeout);
        ajax_timeout = null;
        return ajax_response = null;
      };
      ajax_success = function() {
        var i, member, sep, tbody, team, team_members, _i, _j, _len, _len2;
        tbody = $('#result tbody');
        $('tr', tbody).detach();
        i = 1;
        for (_i = 0, _len = ajax_response.length; _i < _len; _i++) {
          team = ajax_response[_i];
          team_members = '';
          sep = '';
          for (_j = 0, _len2 = team.length; _j < _len2; _j++) {
            member = team[_j];
            team_members += sep + member.trim();
            sep = ', ';
          }
          $("<tr><td>" + i + "</td><td>" + team_members + "</td></tr>").appendTo(tbody);
          i += 1;
        }
        window.location.hash = 'result';
        return ajax_complete();
      };
      ajax_error = function() {
        if (ajax_response.status === 400) {
          display_error('Coś nie halo w formularzu.');
        } else {
          display_error('Coś nie halo na serwerze.');
        }
        return ajax_complete();
      };
      data = [];
      _ref = $('#people').val().split(',');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        data[_i] = item.trim();
      }
      $.ajax({
        url: '/',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json',
        beforeSend: function() {
          return $('#people, #submit').attr('disabled', true);
        },
        success: function(data) {
          ajax_response = data.teams;
          return ajax_timeout = window.setTimeout(ajax_success, 1000);
        },
        error: function(xhr) {
          ajax_response = xhr;
          return ajax_timeout = window.setTimeout(ajax_error, 1000);
        }
      });
      return false;
    });
  });
}).call(this);
