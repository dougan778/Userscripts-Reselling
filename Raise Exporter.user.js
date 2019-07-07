// ==UserScript==
// @name         Raise Exporter
// @namespace    dougan
// @version      0.3
// @description  Automatically extracts gift cards from raise orders into an excel-friendly format.
// @author       Dougan
// @match        https://www.raise.com/my_orders
// @grant        unsafeWindow
// @grant	GM_addStyle
// @grant	GM_getValue
// @grant	GM_setValue
// @grant	GM_listValues
// @grant	GM_xmlhttpRequest
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require Gift Card Settings.user.js
// ==/UserScript==

// TODO:
// Alert when order still processing.

// Updates
// 0.3 - Dougan 3/17/19 - updated to new DOM
// 0.2 - Dougan 8/6/18 - Fixed issue with merchant showing wrong in export for multiple cards.
// 0.1 - Dougan 8/3/18 - Created

function log(value){
    console.log("Raise Exporter: " + value);
}

var card = function(){
    this.merchant = null;
    this.value = null;
    this.code = null;
    this.pin = null;
    this.paid = null;
};
card.prototype.createRow = function(){
    var result = "<tr>";
    var myCard = this;
    unsafeWindow.giftCardSettings.raiseSettings.raise_export_columns.forEach(function(column){
        result += "<td>";
        switch(column.toLowerCase()){
            case "merchant":
                result += myCard.merchant;
                break;
            case "value":
                result += myCard.value;
                break;
            case "code":
                result += myCard.code;
                break;
            case "pin":
                result += myCard.pin;
                break;
            case "paid":
                result += myCard.paid;
                break;
            case "from":
                result += "Raise";
                break;
            case "date":
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth()+1; //January is 0!
                var yyyy = today.getFullYear();

                today = mm + '/' + dd + '/' + yyyy;
                result += today;
                break;
            default:

                result += "";
        }
        result += "</td>";
    });
    result += "</tr>";
    return result;
};

function getCardTable(){
    var result = "<table border='1' style='border-collapse: separate;' class='export-card-display'><tr padding='1'>";
    for(var i = 0; i < unsafeWindow.giftCardSettings.raiseSettings.raise_export_columns.length; i++){
        result += "<td>" + unsafeWindow.giftCardSettings.raiseSettings.raise_export_columns[i] + "</td>";
    }
    result += "</tr></table>";
    return result;
};

var clickElement = function(jelement){
    $(jelement).each ( function ()
    {
        $(this).css ('background', 'red');

        var clickEvent  = document.createEvent ('MouseEvents');
        clickEvent.initEvent ('click', true, true);
        this.dispatchEvent (clickEvent);
    });
};

if (unsafeWindow.giftCardSettings.raiseSettings.enable_raise_auto_reveal){
    var i = 0;
    $(".singleOrder:first .cardDetails .line-item-show-full-numbers").each(function(){
        i++;
        var element = $(this);
        setTimeout(function(){
            clickElement(element);
        }, unsafeWindow.giftCardSettings.raiseSettings.click_reveal_delay * i);
    });
    var cardQuantity = i;
}

if (unsafeWindow.giftCardSettings.raiseSettings.enable_raise_export){
    $(".breadcrumb").append("<div class='ps-raise'>Card Details:" + getCardTable() + "</div>");

    setTimeout(function(){
        try{
            log("Beginning Scan.");
            var cards = [];

            var cardMerchants = [];
            var cardDatas = [];
            $(".orderDetails:first h3").each(function(){
                if ($(this).text() != "How to Use Your Gift Card"){
                    cardMerchants.push($(this).text().replace("Gift Card", "").trim());
                }
            });
            $(".orderDetails:first .cardDetails").each(function(){
                cardDatas.push($(this));
            });


            var table = $(".export-card-display:first");
            for (var i = 0; i < cardDatas.length; i++){
                var myCard = new card();
                myCard.merchant = cardMerchants[i];
                log("Creating Card: " + myCard.merchant);

                myCard.code = $(cardDatas[i]).find(".cardInstructions__body span.line-item-account-number:first").text();
                myCard.pin = $(cardDatas[i]).find(".cardInstructions__body span.line-item-pin-number:first").text();
                myCard.value = $(cardDatas[i]).find(".cardDetails__logoHolder div.cardDetails__savings div.cardDetails__row div:first").text();
                myCard.paid = ""; // No longer displayed

                cards.push(myCard);
            };

            log("Adding cards: " + cards.length);
            cards.forEach(function(myCard){

                $(table).append(myCard.createRow());

            });
        }
        catch(ex){


            console.log(ex);
        }
    }, (cardQuantity *  unsafeWindow.giftCardSettings.raiseSettings.click_reveal_delay) +  unsafeWindow.giftCardSettings.raiseSettings.wait_time_after_clicks_done_for_reading);
};


