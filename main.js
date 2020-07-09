if (window.location.pathname == '/game/merchant') {
  var MIMObj = {
    headerIndex: 5,
    domEls: {
      parentColumn: $('#merchant').find('.row').find('.col-md-4'),
      inventory: $('.card-header:contains(Sellable)').siblings('.card-body').find('tbody').children(),
    },
    inventory: {
      valueArray: [],
      valueTotal: 0,
    },
    settings: {
      hideDefaultSellButton: false,
      showSellValue: true,
      hideNullItems: false,
      maxButtonEnabled: true,
      halfButtonEnabled: false,
    },
    htmlContent: {
      card: '<div class="card"><div class="card-header">Merchant Improvement Mod</div><div id="mod-settings-body" class="card-body"><div id="mim-total-inventory-value"></div><div class="form-check"><input class="form-check-input" type="checkbox" value="" id="mim-persist-sell-btn"><label class="form-check-label" for="mim-persist-sell-btn">Hide default sell button</label></div><div class="form-check"><input class="form-check-input" type="checkbox" value="" id="mim-show-sell-value"><label class="form-check-label" for="mim-show-sell-value">Show sell value</label></div><div class="form-check"><input class="form-check-input" type="checkbox" value="" id="mim-hide-null-items"><label class="form-check-label" for="mim-show-sell-value">Hide items you don\'t currently have</label></div><div class="form-check"><input class="form-check-input" type="checkbox" value="" id="mim-half-btn-enabled"><label class="form-check-label" for="mim-show-sell-value">Show sell half button</label></div><div class="form-check"><input class="form-check-input" type="checkbox" value="" id="mim-max-btn-enabled"><label class="form-check-label" for="mim-show-sell-value">Show sell max button</label></div><br /><button type="button" id="mim-settings-save-btn" class="btn btn-primary btn-block">Save settings</button></div></div>',
    }
  };

  function retrieveSettings() {
    if (sessionStorage.getItem("aot-merchant-mod")) {
      let stored = JSON.parse(atob(window.sessionStorage.getItem('aot-merchant-mod')));
      MIMObj.settings = stored;
    } else {
      saveSettings();
      return MIMObj.settings;
    }
  }

  function saveSettings() {
    let toBeStored = btoa(JSON.stringify(MIMObj.settings));
    window.sessionStorage.setItem('aot-merchant-mod', (toBeStored));
  }

  function calculateTotalValue(arr) {
    let value = arr.reduce(function (a, b) {
      return a + b;
    }, 0);
    return value;
  }
  retrieveSettings();


  if (MIMObj.settings.hideDefaultSellButton) {
    let btn = $('input[name = "commit"]');
    let numInput = $('input[name = "amount"]');
    btn.each(function () {
      btn.hide();
    });
    numInput.each(function () {
      numInput.hide();
    });
  }

  MIMObj.domEls.inventory.each(function () {
    amountCol = $(this).children('td').eq(1);
    valueCol = $(this).children('td').eq(2);
    amount = amountCol[0].innerText;
    value = valueCol[0].innerText;

    totalvalue = amount * value;

    // Table body
    if (amount > 0) {
      MIMObj.inventory.valueArray.push(totalvalue);

      if (MIMObj.settings.halfButtonEnabled && amount != 1) {
        if (MIMObj.settings.showSellValue) {
          $(this).append('<td><input type="submit" class="btn btn-primary sell-half-btn" style="justify-content: center; min-height: 45px; margin-left: 0px; max-height: 45px; padding: 5px; font-size: 12px; white-space: normal;" value="x' + Math.floor(amount / 2) + ' \n (+' + Math.floor(totalvalue / 2) + ')" data-disable-with="Sell"></td>');
        } else {
          $(this).append('<td><input type="submit" class="btn btn-primary sell-half-btn" style="justify-content: center; min-height: 45px; margin-left: 0px; max-height: 45px; padding: 5px; font-size: 12px; white-space: normal;" value="Sell half \n (x' + Math.floor(amount / 2) + ')" data-disable-with="Sell"></td>');
        }
      }

      if (MIMObj.settings.maxButtonEnabled) {
        if (MIMObj.settings.showSellValue) {
          $(this).append('<td><input type="submit" class="btn btn-primary sell-all-btn" style="justify-content: center; min-height: 45px; margin-left: 0px; max-height: 45px; padding: 5px; font-size: 12px; white-space: normal;" value="x' + amount + ' \n (+' + totalvalue + ')" data-disable-with="Sell"></td>');
        } else {
          $(this).append('<td><input type="submit" class="btn btn-primary sell-all-btn" style="justify-content: center; min-height: 45px; margin-left: 0px; max-height: 45px; padding: 5px; font-size: 12px; white-space: normal;" value="Sell all \n x' + amount + '" data-disable-with="Sell"></td>');
        }
      }
    } else {
      if (MIMObj.settings.hideNullItems) {
        $(this).hide();
      }
    }
  });

  MIMObj.inventory.valueTotal = calculateTotalValue(MIMObj.inventory.valueArray);

  $('.sell-all-btn').on('click', function () {
    let cRow = $(this).parent().parent();
    $thisSellForm = cRow.find('form');
    maxAmount = cRow.children('td')[1].innerText;
    inputVal = cRow.find('#amount').val(maxAmount);
    $thisSellForm.submit();
  });

  $('.sell-half-btn').on('click', function () {
    let cRow = $(this).parent().parent();
    $thisSellForm = cRow.find('form');
    maxAmount = cRow.children('td')[1].innerText;
    inputVal = cRow.find('#amount').val(Math.floor(maxAmount / 2));
    $thisSellForm.submit();
  });

  settingsCard = $('#merchant').find('.row').find('.col-md-4').append(MIMObj.htmlContent.card);

  saveSettingsButton = $('#mim-settings-save-btn');

  // Update settings
  saveSettingsButton.click(function () {
    MIMObj.settings.hideDefaultSellButton = $('#mim-persist-sell-btn')[0].checked;
    MIMObj.settings.showSellValue = $('#mim-show-sell-value')[0].checked;
    MIMObj.settings.hideNullItems = $('#mim-hide-null-items')[0].checked;
    MIMObj.settings.halfButtonEnabled = $('#mim-half-btn-enabled')[0].checked;
    MIMObj.settings.maxButtonEnabled = $('#mim-max-btn-enabled')[0].checked;
    saveSettings();
    location.reload();
  });

  // Set setting checkbox values
  $('#mim-persist-sell-btn')[0].checked = MIMObj.settings.hideDefaultSellButton
  $('#mim-show-sell-value')[0].checked = MIMObj.settings.showSellValue
  $('#mim-hide-null-items')[0].checked = MIMObj.settings.hideNullItems
  $('#mim-half-btn-enabled')[0].checked = MIMObj.settings.halfButtonEnabled
  $('#mim-max-btn-enabled')[0].checked = MIMObj.settings.maxButtonEnabled

  // Total inventory value
  $('#mim-total-inventory-value')[0].innerHTML = "<p>Inventory value: " + MIMObj.inventory.valueTotal + "</p>";

}
