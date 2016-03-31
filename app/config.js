require.config({
    baseUrl: 'app',
    paths: {
        d3: 'components/d3/d3.min',
        jquery: 'components/jquery/dist/jquery.min'
    },
    shim: {
        'jquery': {
            exports: '$'
        }
    }
});


require(['d3', 'jquery'], function (d3, $) {
    var url = "http://ezvarnish.ezsystems.fr:6555/match/%5EART-/top/100?b=100";

    console.log('jQuery version:', $.fn.jquery);

    var width   = innerWidth-40,
        height  = innerHeight-40,
        color   = d3.scale.category20c(),
        div     = d3.select("body").append("div")
           .style("position", "relative");

    var treemap = d3.layout.treemap()
            .size([width, height])
            .sticky(false)
            .value(function(d) { return d.score; });

    // Node-positioning function
    var position = function() {
        this.style('left',   function(d) { return d.x + 'px'; })
            .style('top',    function(d) { return d.y + 'px'; })
            .style('width',  function(d) { return d.dx + 'px'; })
            .style('height', function(d) { return d.dy + 'px'; });
    };

    // Set background-image based on data
    var getBackgroundStyle = function(d) {
        return d.children ? null : 'url(' + d.image + ')';
    };

    getData();

    function getData() {
        var tree = { 'name': 'VCS', children: [] };
        console.log("Interval !");

        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            jsonpCallback: 'jsonCallBack',
            contentType: "application/json",
            dataType: 'jsonp',
            success: function(json) {
                for (var key in json) {
                    var title = key.split("@")[0].substring(4);
                    var image = key.split("@")[1];
                    var score = json[key];

                    tree.children.push( {"id": window.btoa(unescape(encodeURIComponent(title))), "title": title, "image": image, "score": score } );
                }

                // Select all nodes, join data on id
                var nodes = div.datum(tree)
                        .selectAll(".node")
                        .data(treemap.nodes, function(d) { return d.id; });

                // On new nodes ...
                nodes.enter().append('a')
                    .attr("class", "node")
                    //.attr('href', function(d) { return d.url; })
                    .style('background', getBackgroundStyle)
                    .style("font-size", function(d) {
                          // compute font size based on sqrt(area)
                          return Math.max(20, 0.18*Math.sqrt(d.area))+'px'; })
                    .text(function(d) { return d.title })
                    .call(position);

                nodes.exit().remove();

                nodes
                    .style('background', getBackgroundStyle)
                    .style("font-size", function(d) {
                          // compute font size based on sqrt(area)
                          return Math.max(20, 0.18*Math.sqrt(d.area))+'px'; })
                    .transition()
                    .duration(750)
                    .text(function(d) { return d.title } )
                    .call(position);

            },
            error: function(e) {
                console.log(e.message);
            }
        });
    }

    setInterval(getData, 5000);

});
