export function CSVToArray(strData, strDelimiter) {
  // seperate the string into arrays eacht break line with \n
  let [rubbish, ...Alldata] = strData.split(/PM1.0/g); // g wendet den string nicht nur beim ersten an
  //console.log(Alldata);
  let ArrData = Alldata.map(function (measurement) {
    measurement = "PM1.0" + measurement;

    let [header, ...data] = measurement.split("\r\n");
    //console.log(data);
    // fix the double Location, Location and theb spaces in the file from Jonas
    header = header.replace("Location; Location;", "Location N; Location E;");
    header = header.replace(/\s/g, "");
    let headers = header.split(strDelimiter);

    // remove the E and N in da Numbers
    //console.log(data)
    data = data.map((line) => (line = line.replace("E", "")));
    data = data.map((line) => (line = line.replace("N", "")));
    //console.log(data)

    let objects = data.map((line, index) =>
        line
            // Split line with value separators
            .split(strDelimiter)

            // Reduce values array into an object like: { [header]: value }
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
            .reduce(
                // Reducer callback
                (object, value, index) => ({
                  ...object,
                  [headers[index]]: parseFloat(value),
                }),

                // Initial value (empty JS object)
                {}
            )
    );
    // Calculate from degre minutes to decimal degree
    let objectWOnan = [];
    objects.forEach(function (line) {
      if (!isNaN(line["LocationN"])) {
        line["LocationN"] =
            (line["LocationN"] - (line["LocationN"] % 100)) / 100 +
            (line["LocationN"] % 100) / 60;
        line["LocationE"] =
            (line["LocationE"] - (line["LocationE"] % 100)) / 100 +
            (line["LocationE"] % 100) / 60;
        objectWOnan.push(line);
      }
    });
    // Return the parsed data, only when GPS data is inside.
    return objectWOnan;
  });
  console.log(ArrData);
  return ArrData;
}
