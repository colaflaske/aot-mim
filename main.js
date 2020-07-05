if(window.location.pathname == '/game/merchant') {
    $inventory = $('.card-header:contains(Sellable)').siblings('.card-body').find('tbody').children()

    $inventory.each(function(){
        amountCol = $(this).children('td').eq(1);
        valueCol = $(this).children('td').eq(2);
        amount = amountCol[0].innerText;
        value = valueCol[0].innerText;

        totalvalue = amount * value;

        if(amount > 0) {
            $(this).append('<td><input type="submit" class="btn btn-primary sellAllButton" style="justify-content: center; max-height: 45px; margin-left: -15px; padding-top: -15px; font-size: 10px; white-space: normal;" value="x' + amount + ' (+$' + totalvalue + ')" data-disable-with="Sell"></td>');
        }
    });


    $('.sellAllButton').on('click', function() {
        let cRow = $(this).parent().parent();

        $thisSellForm = cRow.find('form');
        maxAmount = cRow.children('td')[1].innerText;
        inputVal = cRow.find('#amount').val(maxAmount);
        $thisSellForm.submit();
    });
}
