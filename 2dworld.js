// function sizeChange() {
//         d3.select("g").attr("transform", "scale(" + $("#container_2d").width()/900 + ")");
//         $("svg").height($("#container_2d").width()*0.618);
//     }
// d3.select(window)
//     .on("resize", sizeChange);
var ref_count_set = new Firebase('https://firstproject-a737a.firebaseio.com/final-state-count');
ref_count_set.on('value', function (snapshot) {
    
    
    var data = snapshot.val();
//    for(var i in data) {
//        console.log(data[i]['count']);
//    }
    var ref_short_name_set = new Firebase('https://firstproject-a737a.firebaseio.com/location_2D_state');
    ref_short_name_set.on('value', function (snapshot) {
        var data_second = snapshot.val();
        var location_list = [];
        var list = [];
        for (var i in data_second) {
            // console.log(data[i]);
            var tmp = [];
            location_list.push(data_second[i][2]);
            tmp.push(data_second[i][0], data_second[i][1]);
            list.push(tmp);
        }
        var counts = {};
        location_list.forEach(function (x) {
            counts[x] = (counts[x] || 0) + 1;
        });
        //////this sentence is written for updating count value.!!!!!!!!!!!!!!
//        for(var i in data)
//            ref_count_set.child(i.toString()).child("count").set(counts[data_second[i][2]]);
//        console.log(counts);

//        console.log(location_list);
//        var list = [];
//        var ref_set = new Firebase('https://firstproject-a737a.firebaseio.com/location_conversion_data_2D');
//        ref_set.on('value', function (snapshot) {
//
//            var data = snapshot.val();
//            for (var key in data) {
//                var tmp = [];
////            console.log("data[key]: " + data[key][1]);
//                tmp.push(data[key][0], data[key][1]);
//                list.push(tmp);
//            }
//        console.log("list:" + list[0][0]);
            var width = 500, height = 400;
            // var width = $("#container_2d").width();
            // var height = $("#container_2d").height();
            // var width = 400, height = 500;
            console.log("width: " + width + ", height: " + height); 
            var projection = d3.geo.albersUsa();//shiyuxin
            // Setting color domains(intervals of values) for our map

            var color_domain = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
            var ext_color_domain = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
            var legend_labels = ["< 2", "2+", "4+", "6+", "8+", "10+", "12+", "14+", "16+", "18+", "20+", "22+", "24+"];
            var color = d3.scale.threshold()
                    .domain(color_domain)
                    .range(["#dcdcdc", "#d0d6cd", "#bdc9be", "#aabdaf", "#97b0a0", "#84a491", "719782", "#5e8b73", "#4b7e64", "#387255", "#256546", "#125937", "#004d28"]);

            var div = d3.select("#container_2d").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

            // d3.select("g").attr("transform", "scale(" + $("#container_2d").width()/900 + ")");
            // $("svg").height($("#container_2d").width()*0.618);


            var svg = d3.select("#container_2d").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .style("margin", "10px auto")
                    .append("g");
                    // .attr("transform", "scale(" + $("#container_2d").width()/900 + ")");

            var path = d3.geo.path()

            //Reading map file and data

            queue()
                    .defer(d3.json, "us.json")
//                    .defer(d3.csv, "data.csv")
                    //                .defer(d3.text, "globe.txt")
                    .await(ready);

            //Start of Choropleth drawing

            function ready(error, us) {
                var rateById = {};
                var nameById = {};

//                data.forEach(function (d) {
//                    rateById[d.id] = +d.rate;
//                    nameById[d.id] = d.name;
//                });
                for(var i in data){
                    rateById[i] = +data[i].count;
                    nameById[i] = data[i].name;
                }
                // console.log(rateById);
                var places = list;
                //Drawing Choropleth

                svg.append("g")
                        .attr("class", "region")
                        .attr("transform", "scale(" + $("#container_2d").width()/900 + ")")
                        .selectAll("path")
                        .data(topojson.feature(us, us.objects.counties).features)
                        //.data(topojson.feature(map, map.objects.russia).features) <-- in case topojson.v1.js
                        .enter().append("path")
                        .attr("d", path)
                        .style("fill", function (d) {
                            return color(rateById[d.id]);

                        })
                        .style("opacity", 0.8)


                        //Adding mouseevents
                        .on("mouseover", function (d) {
                            d3.select(this).transition().duration(200).style("opacity", 1);
                            div.transition().duration(200)
                                    .style("opacity", 1)
//                    div.text(nameById[d.id] + " : " + rateById[d.id])
//                            .style("left", (d3.event.pageX) + "px")
//                            .style("top", (d3.event.pageY -30) + "px");
                            div.text(nameById[d.id])
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY - 30) + "px");
                        })
                        .on("mouseout", function () {
                            d3.select(this)
                                    .transition().duration(200)
                                    .style("opacity", 0.8);
                            div.transition().duration(200)
                                    .style("opacity", 0);
                        })


                //Adding legend for our Choropleth

//        svg.append("circle").attr("r",5).attr("transform", function() {return "translate(" + projection([-75,40]) + ")";});
                svg.selectAll(".pin")
                        .data(places)
                        .enter().append("circle", ".pin")
                        .attr("r", 3)
                        .attr("transform", function (d) {
//                    return "translate(" + projection([
//                                d.location.longitude,
//                                d.location.latitude
//                            ]) + ")";
                            return "translate(" + projection([d[0], d[1]]) + ")";
//                    return "translate(" + projection(d[2]) + ")";
                        })
                        .attr("transform", "scale(" + $("#container_2d").width()/900 + ")");


            }; // <-- End of Choropleth drawing


            var legend = svg.selectAll("g.legend")
                    .data(ext_color_domain)
                    .enter().append("g")
                    .attr("class", "legend");

            var ls_w = 20, ls_h = 20;

            legend.append("rect")

                    .attr("x", 20)
                    .attr("y", function (d, i) {
                        return height - (i * ls_h) - 2 * ls_h;
                    })
                    .attr("width", ls_w)
                    .attr("height", ls_h)
                    .attr("transform", "scale(" + $("#container_2d").width()/900 + ")")
                    .style("fill", function (d, i) {
                        return color(d);
                    })
                    .style("opacity", 0.8);

            legend.append("text")
                    .attr("x", 50)
                    .attr("y", function (d, i) {
                        return height - (i * ls_h) - ls_h - 4;
                    })
                    .attr("transform", "scale(" + $("#container_2d").width()/900 + ")")
                    .text(function (d, i) {
                        return legend_labels[i];
                    });
        });
    });
