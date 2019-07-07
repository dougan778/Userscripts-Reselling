// ==UserScript==
// @name         Gift Card Settings
// @namespace    dougan
// @version      0.1
// @description  Settings for Gift Card Scripts
// @author       Dougan
// @grant        unsafeWindow
// @match        https://www.raise.com/my_orders
// @run-at       document-start
// ==/UserScript==

unsafeWindow.giftCardSettings = {};
unsafeWindow.giftCardSettings.raiseSettings =
{
    // --- Raise Export User Settings (modify these to your liking) ---
    enable_raise_export: true,           // If true, will display your cards in a grid format.
    enable_raise_auto_reveal: true,      // if true, will automatically click the "reveal card details" button.
    raise_export_columns: ["Merchant","value","code","pin","date", "from", "", "value","paid"], // -- Rearrange and add/remove these to customize your export layout.  Put "" to insert a blank column.

    // -- Raise Export General Settings (generally leave these as-is) --
    click_reveal_delay: 2000, // Milliseconds in-between how often the "reveal contents" button should be clicked.
    wait_time_after_clicks_done_for_reading: 2000, // Once all the "reveal" buttons are clicked, this is the time (in ms) to wait before reading in all the results.  You can bump this up if you are on a slow internet connection and you're not reading all the cards.

};

// Next section is processing configurations, don't mess with it.

if (unsafeWindow.giftCardSettings.raiseSettings.enable_raise_export){
    unsafeWindow.giftCardSettings.raiseSettings.enable_raise_auto_reveal = true;
}

