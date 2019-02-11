
    var svg = d3.select("#chart2"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var pie = d3.pie()
            .sort(null)
            .value(function(d) { return d.rate; });
    var path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    var label = d3.arc()
        .outerRadius(radius - 100)
        .innerRadius(radius - 100);
         
    var tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')   
    .style('opacity', 0);


    // var color = d3.scaleOrdinal(d3.schemeBuGn[6]);
   var color= d3.scaleSequential(d3.interpolateBuGn)
    .domain([30, 1000]);
    d3.csv("./data/BrandPerCountry.csv", function(d) {
      return { country: d.country, rate: +d.count};
    }).then(function(data) {
      data.sort(function(a,b){return a.rate<b.rate})
        var arc = g.selectAll(".arc")
          .data(pie(data))
          .enter().append("g")
          .attr("class", "arc");
        
        arc.append("path")
            .attr("class","pathpie")
            .attr("d", path)
            .attr("fill", function(d,i) { return color(d.data.rate); })
            .on("mouseover",function(d){
              $( "#interactive-information" ).hide();
              tooltip.transition()  
              .duration(200)  
              .style('opacity', 0.9);  
              tooltip.html(d.data.country + '<br/>'  + d.data.rate) 
              .style('left', (d3.event.pageX -5) + 'px')  
              .style('top', (d3.event.pageY + 5) + 'px');   

              $("#piechart").attr("text-align","center")
              .attr("display","block");
              var coid= d.data.country.toString() 
              $("#"+coid).attr("bgcolor", "#99d8c9")

            })
            .on("mouseout",function(d){
              $( "#interactive-information" ).show();
              $("#piechart")
              .attr("display","inline-block")
              var coid= d.data.country.toString() 
              $("#"+coid).attr("bgcolor","white")
              tooltip.transition()  
              .duration(500)  
              .style('opacity', 0); 
            })
            ;
        // arc.append("title")
        var total = d3.sum(data.map(function(d) { // calculate the total number of tickets in the dataset         
            return d.rate // checking to see if the entry is enabled. if it isn't, we return 0 and cause other percentages to increase                                      
            })); 

            
        //     .text(function(d:any) { return d.data.country+"\n"+d.data.rate; });
        arc.append("text")
            .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
            .attr("dy", "0.35em")
            .text(function(d) { console.log(d.data.rate/total) ;return "\n"+Math.round(100*d.data.rate/total)+"%"; });
    });
 

