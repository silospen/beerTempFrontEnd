var beerTemp = (function ($, undef) {

    function populateGraph(result) {
        console.log(result);
    }

    function fetchDataSource() {
        $.ajax({
            url: '/beerTemp',
            cache: false,
            type: 'GET',
            success: populateGraph
        });
    }

    fetchDataSource();

})(jQuery);