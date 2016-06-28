'use strict';

$(document).foundation();

$('#switch-filter-position').change(function () {
    var filter = false;
    if ($('#switch-filter-position').is(':checked')) {
        filter = true;
    }
    chrome.storage.sync.set({
        'filter': filter
    }, function () {
    });
});

chrome.storage.sync.get(function (response) {
    if (response.filter == true) {
        $('#switch-filter-position').prop('checked', true);
    } else {
        $('#switch-filter-position').prop('checked', false);
    }
});

$('#position').keyup(function () {
    var position = $('#position').val();

    chrome.storage.sync.set({
        'position': position
    }, function () {
        // Notify that we saved.
    });
});

chrome.storage.sync.get(function (response) {
    $('#position').val(response.position);
});

$('#switch-bottomsticker').change(function () {
    var bottomsticker = false;
    if ($('#switch-bottomsticker').is(':checked')) {
        bottomsticker = true;
    }
    chrome.storage.sync.set({
        'bottomsticker': bottomsticker
    }, function () {
    });
});

chrome.storage.sync.get(function (response) {
    if (response.bottomsticker == true) {
        $('#switch-bottomsticker').prop('checked', true);
    } else {
        $('#switch-bottomsticker').prop('checked', false);
    }
});

$('#intro-close').click(function () {
    chrome.storage.sync.set({
        'introDismissed': true
    }, function () {
        // Notify that we saved.
    });
});

chrome.storage.sync.get(function (response) {
    if (typeof(response.introDismissed) == "undefined") {
        $('#intro').foundation('toggle');
    }
});