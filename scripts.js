/**
 * Panel - Persona Filter
 */
$personaFilter = $('#persona-filter');
if ($personaFilter.length) {
    // Pull Persona data from REST endpoint
    $.ajax({
        url: '/wp-json/personas/v1/all'
    })
    .done(function(data) {
        applyPersonaFilter(data);
    });

    function applyPersonaFilter(data) {
        $identitySelect = $('#pf-identity');
        $topicSelect = $('#pf-topic');

        // Populate Identity dropdown
        $.each(data.identities, function(index, value) {
            $identitySelect.append('<option value="' + index + '" data-topic-page-routes=\'' + JSON.stringify(value.topic_page_routes) + '\'>' + value.label + '</option>');
        });

        // Populate Topics dropdown based on Identity selection
        $identitySelect.on('change', function() {
            routes = $(this).find('option:selected').data('topic-page-routes');

            // Ensure Topics element is enabled
            $topicSelect.removeAttr('disabled');

            // Clear all previous topics to repopulate with new selections
            $topicSelect.find('option').not('.placeholder').remove();

            // Add options/corresponding page route date attributes
            $.each(routes, function(index, value) {
                topic = data.topics[index];
                $topicSelect.append('<option value="' + index + '" data-page-route="' + value + '">' + topic.label + '</option>');
            });
        });

        // Remove disabled attribute from submit once topic is selected
        $topicSelect.on('change', function(index, value) {
            if (!$(this).find('option:selected').hasClass('placeholder')) {
                $(this).closest('form').find('input[type="submit"]').removeAttr('disabled');
            }
        });

        // On submit, pull the selected topic page route, use AJAX to retrieve permalink, then redirect
        $personaFilter.on('submit', function(e) {
            e.preventDefault();

            route = $personaFilter.find('#pf-topic option:selected').data('page-route');
            params = {
                'action': 'get_permalink',
                'post_type': 'post',
                'id': route
            };
            $.post('/wp-admin/admin-ajax.php', params, function(response) {
                window.location.href = response;
            });
        });
    }
}
