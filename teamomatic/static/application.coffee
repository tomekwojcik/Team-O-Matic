$ = window.jQuery

$(document).ready( ->
    form = $('#form')
    
    $('#alert').fadeOut()
    
    display_error = (message) ->
        timeout = null
        hide_error = ->
            $('#alert').fadeOut('fast')
            window.clearTimeout(timeout)
            timeout = null
            
        $('#alert p').text(message)
        $('#alert').fadeIn('fast', ->
            timeout = window.setTimeout(hide_error, 3000)
        )
    
    form.submit((event) ->
        event.stopPropagation()
        event.preventDefault()
        
        ajax_response = null
        ajax_timeout = null
        
        ajax_complete = ->
            $('#people, #submit').attr('disabled', false)
            window.clearTimeout(ajax_timeout)
            ajax_timeout = null
            ajax_response = null
        
        ajax_success = ->
            tbody = $('#result tbody')
            $('tr', tbody).detach()
            i = 1
            for team in ajax_response
                team_members = team.join(', ')
                $("<tr><td>#{i}</td><td>#{team_members}</td></tr>").appendTo(tbody)
                i += 1
                
            window.location.hash = 'result'
            ajax_complete()
            
        ajax_error = ->
            display_error($.parseJSON(ajax_response.responseText))
            ajax_complete()
        
        data = []
        for item in $("#form input[type=checkbox]:checked")
            data[_i] = $(item).val()
            
        $.ajax({
            url: '/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: 'json',
            beforeSend: ->
                $('#people, #submit').attr('disabled', true)
            success: (data) ->
                ajax_response = data.teams
                ajax_timeout = window.setTimeout(ajax_success, 1000)
            error: (xhr) ->
                ajax_response = xhr
                ajax_timeout = window.setTimeout(ajax_error, 1000)
        })
        
        false
    )
    
    $('#footer span').click( ->
        $('#submit').jrumble({
            rumbleEvent: 'constant'
        })
    )
)