mapboxgl.accessToken = 'pk.eyJ1IjoibmFob21hIiwiYSI6ImNrdmN1M2VqdjNwc2MycW1zcGdxNmlqeWEifQ.xLWKVeuyBVIhSID2bxYl6A';

let map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
  zoom: 8, // starting zoom
  center: [-123.690, 48.577] // starting center
});

let btn = document.getElementsByTagName("button")[0];

btn.addEventListener('click', sortTable);

// define the function to sort table
function sortTable(e) {
  let table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementsByTagName("table")[0];
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
          //start by saying there should be no switching:
          shouldSwitch = false;
          /*Get the two elements you want to compare,
          one from current row and one from the next:*/
          x = parseFloat(rows[i].getElementsByTagName("td")[1].innerHTML);
          y = parseFloat(rows[i + 1].getElementsByTagName("td")[1].innerHTML);
          //check if the two rows should switch place:
          if (x < y) {
              //if so, mark as a switch and break the loop:
              shouldSwitch = true;
              break;
          }
      }
      if (shouldSwitch) {
          /*If a switch has been marked, make the switch
          and mark that a switch has been done:*/
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
      }
  }
}

async function geojsonFetch() {
  let response, tremors, washington_bc, table;
  response = await fetch('assets/tremors.json');
  tremors = await response.json();
  response = await fetch('assets/washington-bc.geojson');
  washington_bc = await response.json();

  //load data to the map as new layers and table on the side.
  map.on('load', function loadingData() {

    map.addSource('tremors', {
      type: 'geojson',
      data: tremors
    });

    map.addLayer({
      'id': 'tremors-layer',
      'type': 'circle',
      'source': 'tremors',
      'paint': {
        'circle-radius': 4,
        'circle-stroke-width': 2,
        'circle-color': 'red',
        'circle-stroke-color': 'white'
      }
    });


    map.addSource('washington_bc', {
      type: 'geojson',
      data: washington_bc
    });

    map.addLayer({
      'id': 'washington_bc-layer',
      'type': 'fill',
      'source': 'washington_bc',
      'paint': {
        'fill-color': '#CBC3E3', // blue color fill
        'fill-opacity': 0.5
      }
    });

  });

  table = document.getElementsByTagName("table")[0];
  let row, cell1, cell2, cell3;
  for (let i = 0; i < tremors.features.length; i++) {
    // Create an empty <tr> element and add it to the 1st position of the table:
    row = table.insertRow(-1);
    cell1 = row.insertCell(0);
    cell2 = row.insertCell(1);
    cell3 = row.insertCell(2);
    cell1.innerHTML = tremors.features[i].properties.id;
    cell2.innerHTML = tremors.features[i].properties.magnitude;
    cell3.innerHTML = new Date(tremors.features[i].properties.time);
  }
};

geojsonFetch();


