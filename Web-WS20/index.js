import { CSVToArray } from "./input_parse_csv.js";

const dropZone = document.getElementById("drop_zone");

var lat = [];
var lon = [];
var scl = [
  [0, "rgb(21,115,0)"],
  [0.04, "rgb(255,223,0)"],
  [0.05, "rgb(250,78,0)"],
  [0.08, "rgb(255,0,29)"],
  [0.1, "rgb(206,0,0)"],
  [0.15, "rgb(128,0,0)"],
  [0.2, "rgb(183,0,255)"],
  [0.875, "rgb(116,0,128)"],
  [1, "rgb(73,0,86)"],
];

// Array for all the Plots which will be drawn
var data = [];

var layout = {
  mapbox: {
    center: { lon: 8.39, lat: 49.0 },
    style: "dark",
    zoom: 10,
  },
  paper_bgcolor: "#343332",
  plot_bgcolor: "#fff",
  coloraxis: { colorscale: "Viridis", color: "#fff" },
  title: { text: "Feinstaubmessung", font: { color: "#fff" } },
  width: 1000,
  height: 1000,
  legend: {
    x: 0,
    y: 1,
    //xanchor: "right",
    font: {
      family: "sans-serif",
      size: 15,
      color: "#fff",
    },
    bgcolor: "#343332",
    bordercolor: "#ffffff",
    borderwidth: 2,
  },
};

Plotly.setPlotConfig({
  mapboxAccessToken:
      "pk.eyJ1Ijoic3ZmaTAxMSIsImEiOiJja3hkaTEyMXEzZTJ3MzBvMXhlN2hqNnlrIn0.VBpEOm7CQ8NaqyCDQ9ZTdA",
});

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  //handleData(evt);

  let files = evt.dataTransfer.files; // FileList object.

  // files is a FileList of File objects. List some properties.
  let output = [];
  let text = "";
  for (let i = 0, f; (f = files[i]); i++) {
    const reader = new FileReader();

    reader.onload = function (e) {
      text = e.target.result;
      let current_data = CSVToArray(text, ";");
      console.log(current_data);
      current_data.forEach(function (e) {
        CSV_to_Plot(e);
      });
    };

    reader.readAsText(f);

    output.push(
        "<li><strong>",
        escape(f.name),
        "</strong> (",
        f.type || "n/a",
        ") - ",
        f.size,
        " bytes, last modified: ",
        f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : "n/a",
        "</li>"
    );
  }

  document.getElementById("file_list2").innerHTML =
      "<ul>" + output.join("") + "</ul>";

  // Load Map
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = "copy"; // Explicitly show this is a copy.
}

function CSV_to_Plot(e) {
  let inputAsObject = e;
  console.log(inputAsObject);
  lat = inputAsObject.map((x) => x["LocationN"]);
  lon = inputAsObject.map((x) => x["LocationE"]);
  let z = inputAsObject.map((x) => x["PM2.5"]);
  let result = {
    type: "scattermapbox",
    mode: "markers",
    lon: lon,
    lat: lat,
    text: z,
    marker: {
      color: z,
      colorscale: scl,
      cmin: 0,
      cmax: 500,
      reversescale: false,
      opacity: 1,
      size: 10,
      colorbar: {
        thickness: 10,
        titleside: "right",
        outlinecolor: "rgba(68,68,68,0)",
        ticks: "outside",
        ticklen: 3,
        shoticksuffix: "last",
        ticksuffix: " ppm",
        dtick: 25,
        tickfont: {
          color: "#fff",
          size: 12,
        },
      },
    },
  };
  data.push(result);
  //}
  // Creat Plot from Data
  Plotly.newPlot("myDiv", data, layout);
}

// Setup the dnd listeners.
dropZone.addEventListener(
    "dragover",
    function (e) {
      handleDragOver(e);
    },
    false
);

dropZone.addEventListener(
    "drop",
    function (e) {
      handleFileSelect(e);
    },
    false
);
