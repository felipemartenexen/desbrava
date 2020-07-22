    //Variáveis que são preenchidas
    var bufferId = 'buffer';
    var calcularRaio;
    
    //Configuração Mapa
    mapboxgl.accessToken = 'pk.eyJ1IjoiZmVsaXBlbWFydGVuZXhlbiIsImEiOiJjazNyZGJyZDMwNDdkM21vMnM3eWRwNnhhIn0.VNoLWqjc-gSs16rIcrll8Q';
    var map = new mapboxgl.Map({
      container: 'map', 
      style: 'mapbox://styles/mapbox/streets-v9', 
      center: [-54.30619342093922, -13.797236147766867],
      zoom: 2.41,
      attributionControl: false
    });
  
    //Inicio do Mapa
    map.on('load', function() {

    //Adicionar as Camadas, Estilos e Fontes no Mapa
    //car_dealership
    map.addSource('car_dealership', { type: 'geojson', data: car_dealership_data});
    map.addLayer({
        "id": "car_dealership",
        "type": "circle",
        "source": "car_dealership",
        'paint': {
            'circle-radius': 4,
            'circle-color': '#3366ff'
            },
    });
    
    //cbc_store
    map.addSource('cbc_store', { type: 'geojson', data: cbc_store_data,
    //cluster: true,
    //clusterMaxZoom: 14, 
    //clusterRadius: 50 
  });
    map.addLayer({
        "id": "cbc_store",
        "type": "circle",
        "source": "cbc_store",
        'paint': {
            'circle-radius': 4,
            'circle-color': '#cc00cc'
            },
    });
    
    //espaco_laser_stores
    map.addSource('espaco_laser_stores', { type: 'geojson', data: espaco_laser_stores_data,
    //cluster: true,
    //clusterMaxZoom: 14, 
    //clusterRadius: 50 
  });
    map.addLayer({
        "id": "espaco_laser_stores",
        "type": "circle",
        "source": "espaco_laser_stores",
        'paint': {
            'circle-radius': 4,
            'circle-color': '#ff9966'
            },
    });

    //kop_store
    map.addSource('kop_store', { type: 'geojson', data: kop_store_data,
    //cluster: true,
    //clusterMaxZoom: 14, 
    //clusterRadius: 50 
  });
    map.addLayer({
        "id": "kop_store",
        "type": "circle",
        "source": "kop_store",
        'paint': {
            'circle-radius': 4,
            'circle-color': '#cc9900'
            },
    });

    //list_schools
    map.addSource('list_schools', { type: 'geojson', data: list_shools_data,
    //cluster: true,
    //clusterMaxZoom: 14, 
    //clusterRadius: 50 
});
    map.addLayer({
        "id": "list_schools",
        "type": "circle",
        "source": "list_schools",
        'layout': {
            'visibility': 'none',
        },
        'paint': {
            'circle-radius': 4,
            'circle-color': '#99ff66'
            },
    });

    //media
    map.addSource('media', { type: 'geojson', data: media_data,
    //cluster: true,
    //clusterMaxZoom: 14, 
    //clusterRadius: 50 
  });
    map.addLayer({
        "id": "media",
        "type": "circle",
        "source": "media",
        'paint': {
            'circle-radius': 4,
            'circle-color': '#003300'
            },
    });

    //piticas_stores
    map.addSource('piticas_stores', { type: 'geojson', data: piticas_stores_data,
    //cluster: true,
    //clusterMaxZoom: 14, 
    //clusterRadius: 50 
  });
    map.addLayer({
        "id": "piticas_stores",
        "type": "circle",
        "source": "piticas_stores",
        'paint': {
            'circle-radius': 4,
            'circle-color': '#00cc99'
            },
    });

    //toyota_stores
    map.addSource('toyota_stores', { type: 'geojson', data: toyota_stores_data,
    //cluster: true,
    //clusterMaxZoom: 14, 
    //clusterRadius: 50
  });
    map.addLayer({
        "id": "toyota_stores",
        "type": "circle",
        "source": "toyota_stores",
        'paint': {
            'circle-radius': 4,
            'circle-color': '#003366'
            },    
    });
   
    //Seleção 
    //NEXT STEP
    map.addSource('selecionados', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
        ]
      }
    });
  
  //PopUp
  var popup = new mapboxgl.Popup();
 
  map.on('click', function(e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['car_dealership'] });
    if (!features.length) {
      popup.remove();
      return;
    }

  var feature = features[0];

    popup.setLngLat(feature.geometry.coordinates)
      .setHTML(feature.properties.name)
      .addTo(map);

    map.getCanvas().style.cursor = features.length ? 'pointer' : '';
  });
  //Fim PopUp

    // CRIAR BUFFER
    // Criar Ponto e Área do Buffer (Vazio)
    map.addSource(bufferId, {
      'type': 'geojson',
      'data': { type: 'Feature', geometry: { type: 'Point', coordinates: [null, null] } }
    });
    map.addLayer({
      'id': bufferId,
      'type': 'fill',
      'source': bufferId,
      'layout': {},
      'paint': {
        'fill-color': '#088',
        'fill-opacity': 0.5
      }
    });
  });



    //Função que Captura a Coordenada
    function calcularRaio() {
          map.on('mousedown', function(e) {
          //console.log('botao funcionando')

          pixelCoords = e.point;
          geoCoords = e.lngLat;

          x = pixelCoords.x;
          y = pixelCoords.y;

          lng = Number(geoCoords.lng.toFixed(5));
          lat = Number(geoCoords.lat.toFixed(5));

          var feature = {
            type: 'Point',
            coordinates: [lat, lng]
          };
          currentPoint = {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "Point",
              "coordinates": [Number(lng), Number(lat)]
            }
          };      
      
          //Raio do Slider
          var raioValor2 = document.getElementById('raio').value;
          
          //Criação do Buffer (Coordenada Click, Valor do Slider, Unidade)
          bufferCurrentPoint = turf.buffer(currentPoint, raioValor2, {units: 'kilometers'});

          var source = map.getSource(bufferId);
          
          source.setData(bufferCurrentPoint);

          //Identificar os Markers da Camada dentro do raio
          var markerWithin = turf.pointsWithinPolygon(car_dealership_data , bufferCurrentPoint);

          console.log("Selecionados: " + markerWithin.features.length + " pontos.");
          document.getElementById("categoria").innerHTML = "Selecionados: " + markerWithin.features.length + " pontos."+ "<br>";

          console.log(markerWithin.features);
                    
          //Popular Tabela com os Markers Encontrados Dentro do Raio
          $("#myTable tr").remove();

          var table = document.getElementById("myTable");

          var row = table.insertRow(-1);
          var headerCell = document.createElement("th");
          headerCell.innerHTML = "";  
          row.appendChild(headerCell);
              
          for (var i = 0; i < markerWithin.features.length; i++) {

            row = table.insertRow(-1);

            var cell = row.insertCell(-1);
            //document.getElementById("categoria").innerHTML = "Selecionados: " + markerWithin.features.length + " pontos."+ "<br>"; 
            cell.innerHTML = markerWithin.features[i].properties.name;
          }
            /////Fim table
        
          });
      };
    ///Fim do map.on 

    //Listar Camadas
        var layers =
        [{
            'name': 'Car Dealership',
            'id': 'car_dealership',
            'source': 'car_dealership',
            'directory': 'Categoria I',
        }, {
            'name': 'CBC Store',
            'id': 'cbc_store',
            'source': 'cbc_store',
            'directory': 'Categoria I',
        }, {
            'name': 'Espaço Laser Stores',
            'id': 'espaco_laser_stores',
            'source': 'espaco_laser_stores',
            'directory': 'Categoria I',
        }, {
            'name': 'KOP Store',
            'id': 'kop_store',
            'source': 'kop_store',
            'directory': 'Categoria I',
        }, {
            'name': 'List Schools',
            'id': 'list_schools',
            'source': 'list_schools',
            'directory': 'Categoria I',
        }, {
            'name': 'Media',
            'id': 'media',
            'source': 'media',
            'directory': 'Categoria II',
        }, {
            'name': 'Piticas Stores',
            'id': 'piticas_stores',
            'source': 'piticas_stores',
            'directory': 'Categoria II',
        }, {
            'name': 'Toyota Stores',
            'id': 'toyota_stores',
            'source': 'toyota_stores',
            'directory': 'Categoria II',
        } 
        
    ];
    
    //Adicionar Painel de Controle das Camadas 
    map.addControl(new LayerTree({
        layers: layers,
    }));

    //Adicionar Controle de Navegação
    var nav = new mapboxgl.NavigationControl({showCompass: false});
    map.addControl(nav, 'top-left');

    //Adicionar Fullscreen
    var fullscreen = new mapboxgl.FullscreenControl()
    map.addControl(fullscreen, 'top-left');
    
    //Adicionar Geolocalização
    var geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
    enableHighAccuracy: true
    },
    trackUserLocation: true
    });
    map.addControl(geolocate,'top-left');
    geolocate.on('geolocate', function() {
    console.log('A geolocate event has occurred.')
    });

    //Adicionar Sidebar
    var sidebar = L.control.sidebar({ container: 'sidebar', position: 'right' })
        .addTo(map)
        .open('home');            
        