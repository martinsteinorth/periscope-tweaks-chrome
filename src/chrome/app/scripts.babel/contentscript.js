'use strict';

$(document).foundation();

var jobdata = {};
var position = '';
var filterActive = '';
var bottomstickerActive = '';

function rowHasDescription(row) {
    if (row.find('td.intno span.txt').text() == '') {
        return false;
    } else {
        return true;
    }
}

function rowMatchesPosition(row, position) {
    if (row.find('td.pos span.txt').text() != position) {
        return false;
    } else {
        return true;
    }
}

function isPositionValid(position) {
    var positionValid = false;
    
    $("tr.table_row").not('.table_row_np').each(function () {
        var row = $(this);
        
        if (rowMatchesPosition(row, position)) {
            positionValid = true;
            return false;    
        }
    });
    
    return positionValid;
}


function filter() {
    $("tr.table_row").not('.table_row_np').each(function () {
        var row = $(this);

        if (rowHasDescription(row)) {
            jobdata.cust = row.find('td.cust span.txt').text();
            jobdata.prod = row.find('td.prod span.txt').text();
            jobdata.camp = row.find('td.camp span.txt').text();
            jobdata.job = row.find('td.job span.txt').text();
            jobdata.intno = row.find('td.intno span.txt').text();
        }

        if (rowMatchesPosition(row, position)) {
            row.find('td.cust span.txt').text(jobdata.cust);
            row.find('td.prod span.txt').text(jobdata.prod);
            row.find('td.camp span.txt').text(jobdata.camp);
            row.find('td.job span.txt').text(jobdata.job);
            row.find('td.intno span.txt').text(jobdata.intno);

            row.find('td.cust span.hidden').text(jobdata.cust);
            row.find('td.prod span.hidden').text(jobdata.prod);
            row.find('td.camp span.hidden').text(jobdata.camp);
            row.find('td.job span.hidden').text(jobdata.job);
            row.find('td.intno span.hidden').text(jobdata.intno);
        } else {
            row.css('display', 'none');
        }
    });
}

function initSums() {
    $('#sum_c0, #sum_c1, #sum_c2, #sum_c3, #sum_c4, #sum_c5, #sum_c6').each(function (count, element) {
        var id = $(element).attr('id');
        var sum = $(element).find('span').first().html();
        var $target = $('#ext-' + id + ' span')

        $target.html(sum);
        
        $target.removeClass('ext-sum-under');
        $target.removeClass('ext-sum-full');

        if (count <= 4) {
            if (parseInt(sum) < 8) {
                $target.toggleClass('ext-sum-under');
            } else {
                $target.toggleClass('ext-sum-full');
            }
        }
    });
}

function initDates() {
    $('.big_screen .datefield').each(function (count, element) {
        var date = $(element).html().replace(/\s/, '<br/>');
        var $target = $('#ext-date-' + count)

        $target.html(date);

    });
    
    $('.table_row_np:nth-last-child(1)').hide();
    $('.table_row_np:nth-last-child(2)').hide();
}

function observeSums() {
    var sumObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            updateSum(mutation.target.id, mutation.addedNodes[0].innerText);
            initSums();
        });
    });

    sumObserver.observe($('.sum').parent()[0], {
        childList: true, subtree: true
    });

}

function updateSum(elementId, sum) {
    $('#ext-' + elementId + ' span').html(sum);
}

function addBottomSticker() {
    $('body').append('\
            <div id="ext-bottomsticker">\
                <table>\
                    <tr>\
                        <td class="sum" id="ext-sum_c0"><span>0,00</span></td>\
                        <td class="sum" id="ext-sum_c1"><span>0,00</span></td>\
                        <td class="sum" id="ext-sum_c2"><span>0,00</span></td>\
                        <td class="sum" id="ext-sum_c3"><span>0,00</span></td>\
                        <td class="sum" id="ext-sum_c4"><span>0,00</span></td>\
                        <td class="sum" id="ext-sum_c5"><span>0,00</span></td>\
                        <td class="sum" id="ext-sum_c6"><span>0,00</span></td>\
                    </tr>\
                    <tr>\
                        <td class="ext-date" id="ext-date-0"><span>Mo</span></td>\
                        <td class="ext-date" id="ext-date-1"><span>Di</span></td>\
                        <td class="ext-date" id="ext-date-2"><span>Mi</span></td>\
                        <td class="ext-date" id="ext-date-3"><span>Do</span></td>\
                        <td class="ext-date" id="ext-date-4"><span>Fr</span></td>\
                        <td class="ext-date ext-weekend" id="ext-date-5"><span>Sa</span></td>\
                        <td class="ext-date ext-weekend" id="ext-date-6"><span>So</span></td>\
                    </tr>\
                </table>\
            </div>\
    ');

}

function removeBottomSticker() {
    var $bottomsticker = $('#ext-bottomsticker');

    if ($bottomsticker.length > 0) {
        $bottomsticker.remove();
    }
}

function showPositionInvalidDialog(position) {
    if (typeof(position) == 'undefined' || position == '') {
        var $dialog = $('<div id="invalid-position-dialog" class="ext-modal"><div class="ext-modal-content"><div class="ext-modal-header"><span class="ext-modal-close">&times;</span><h2>What\'s your position?</h2></div><div class="ext-modal-body"><p>You need to provide a position in the settings dialog.<br/>Make sure you type it exactly as it is shown in Periscope and try again.</p></div></div></div>')    
    }
    else {
        var $dialog = $('<div id="invalid-position-dialog" class="ext-modal"><div class="ext-modal-content"><div class="ext-modal-header"><span class="ext-modal-close">&times;</span><h2>' + position + '?</h2></div><div class="ext-modal-body"><p>Your provided position "'+ position + '" can\'t be found in your timetracker.<br/>Make sure you typed it exactly as it is shown in Periscope and try again.</p></div></div></div>')
    }
    
    $('body').append($dialog);
    
    $dialog.show();
    
    window.onclick = function(event) {
        if (event.target == $dialog[0]) {
            $dialog.remove();
        }
    } 
    
    $('.ext-modal-close').click(function () {
        $dialog.remove();
    });
    
}
    
$(document).ready(function () {

    chrome.storage.sync.get(['position', 'filter', 'bottomsticker'], function (result) {
            position = result.position;
            filterActive = result.filter;
            bottomstickerActive = result.bottomsticker;

            if ($('#timereport_w_inner').length > 0) {

                var loadObserver = new MutationObserver(function (mutations) {
                    mutations.forEach(function (mutation) {
                        if (mutation.addedNodes.length == 3) {
                            removeBottomSticker();

                            if (filterActive === true) {
                                if (isPositionValid(position)) {
                                    filter();    
                                }
                                else {
                                    showPositionInvalidDialog(position);
                                }
                            }
                            
                            if (bottomstickerActive === true) {
                                addBottomSticker();
                                initSums();
                                initDates();
                                observeSums();
                            }

                        }
                    });
            });

            loadObserver.observe($('#timereport_w_inner')[0], {
                attributes: true
                , childList: true
                , characterData: true
            });
        }
    });
});