let myData = [];

$(document).ready(function(){
  // jQuery used to process the json feed
  $.getJSON('https://data.nasa.gov/resource/2vr3-k9wn.json', function(data){
    // data is the json string
    //console.log(data);
    for(let i = 0; i < data.length; i++){
      let dt = data;
      if(dt[i].orbit_class === 'Aten'){
        myData.push({
          "Designation":dt[i].designation,
          "Magnitude":dt[i].h_mag,
          "Period":dt[i].period_yr,
          "Discovery_Date":dt[i].discovery_date,
          "moid_au":dt[i].moid_au,
          "q_au_1":dt[i].q_au_1,
          "q_au_2":dt[i].q_au_2
        });
      }
    }
    console.log(myData);

    // create and attaach the canvas
    let mySVG = d3.select("#out1")
      .append("svg")
      .attr("width", 500)
      .attr("height", 500);

    // bar height for the chart 
    let barHeight = 30;

    // Define the div for the pop-up box
    let popup = d3.select("body")
                  .append("div")
                  .attr("class", "popup")
                  .style("opacity", 0);

    // Build the data-bound bar chart
    // using mouseover and mouseout to
    // toggle the opacity of the popup
    mySVG.selectAll("rect")
      .data(myData)
      .enter()
      .append("rect")
      .style("stroke", "black")
      .style("fill", "#8888aa")
      .attr("width", function(d){
        return parseInt(200 * d.Period);
      })
      .attr("height", barHeight)
      .attr("y", function(d, i){
        return (50 + (i * barHeight));
      })
      .attr("x", function(d){
        return 200;
      })
      .on("mouseover", function(d){
        // d3.select(this).style("fill", "#000088");
        d3.select(this).style("fill", function(d){
          if(d.Magnitude > 22 && d.moid_au < 0.05){
            return "#ff0000"
          }else{
            return "#000088";
          }
        })

        popup.style("opacity", .8);
        popup.html("Designation: " + d.Designation +
          "<br>Magnitude: " + d.Magnitude + 
          "<br>Period (years): " + d.Period +
          "<br>Discovered: " + d.Discovery_Date +
          "<br>Min distance from Earth (au): " + d.moid_au +
          "<br>Perigee (au): " + d.q_au_1 +
          "<br>Apogee (au): " + d.q_au_2)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d){
        d3.select(this).style("fill", "#8888aa");
        popup.style("opacity", 0);
      });

      // column headers
      mySVG.append("text")
        .attr("style", "font: 16px bold arial, sans-serif")
        .attr("style", "fill: white")
        .attr("x", 50)
        .attr("y", 30)
        .text("Designation");

      mySVG.append("text")
        .attr("style", "font: 16px bold arial, sans-serif")
        .attr("style", "fill: white")
        .attr("x", 250)
        .attr("y", 30)
        .text("Magnitude");

      // left hand column shows object designation
      mySVG.selectAll("text.desig")
        .data(myData)
        .enter()
        .append("text")
        .attr("class", "desig")
        .attr("x", 50)
        .attr("y", function(d, i){
          return 50 + (i * barHeight);
        })
        .attr("dy", 5 + barHeight / 2)
        .attr("text-anchor", "left")
        .attr("style", "font: 14px arial, sans-serif")
        .attr("style", "fill: white")
        .text(function(d){
          return d.Designation;
        });

  });
});