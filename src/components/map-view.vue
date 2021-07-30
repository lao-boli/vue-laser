<template>
  <div class="container" style="height: 500px; width: 100%">
    <!-- <ul>
      <li
        v-for="(marker, index) in markers"
        :key="index"
        @click="displayTooltip(index);"
      >
        {{ marker.name }}
      </li>
    </ul> -->

    <l-map :zoom="zoom" :center="center">
      <l-image-overlay :bounds="rect.bounds" :url="rect.url"></l-image-overlay>

      <!-- lStyle is deprecated and is going to be removed in the next major version -->
      <l-rectangle :bounds="rect.bounds" :l-style="rect.style"></l-rectangle>
      <!-- Do not use OpenStreetMap Online tile -->
      <!-- <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer> -->
      <l-marker
        v-for="(marker, index) in markers"
        :class="marker.color"
        :key="index"
        ref="markersRef"
        :lat-lng="marker.position"
      >
        <l-tooltip :content="marker.id" />
      </l-marker>
    </l-map>
  </div>
</template>

<script lang="ts">
import { LMap, LTileLayer, LMarker, LTooltip, LPopup, LRectangle,LImageOverlay } from "vue2-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.3.4/dist/images/";


// markers: [
//   { Id: 1, name: "Oslo", position: { lat: 59.923043, lng: 10.752839 } },
//   {
//     Id: 2,
//     name: "Stockholm",
//     position: { lat: 59.339025, lng: 18.065818 }
//   },
//   {
//     Id: 3,
//     name: "Copenhagen",
//     position: { lat: 55.675507, lng: 12.574227 }
//   },
//   { Id: 4, name: "Berlin", position: { lat: 52.521248, lng: 13.399038 } },
//   { Id: 5, name: "Paris", position: { lat: 48.856127, lng: 2.346525 } }
// ]

interface Marker {
  id: number,
  position:{lat:number,lng:number},
  color:string
}

  // "id": "123",
  // "name": "liu",
  // "gender": "男",
  // "age": "-30",
  // "unit": "test",
  // "equipment": "6c60d6c41c5b144c",
  // "hp": 100,
  // "ammo": 128,
  // "lastReportTime": "2021-07-30 23:31:52",
  // "lat": 24.563537,
  // "lng": 118.381233,
  // "team": "red"
interface Solider {
  id:number,
  name:string,
  gender:string,
  age:number,
  hp:number,
  lastReportTime:string,
  lat:number,
  lng:number,
  team:string
}

const conversion = (solider:Solider)=>{
  const marker:Marker={
    id:solider.id,
    color:solider.team,
    position:{
      lat:solider.lat,
      lng:solider.lng
    }
  }
  return marker
}

export default {
  name: "MapView",
  components: {
    "l-map": LMap,
    "l-tile-layer": LTileLayer,
    "l-marker": LMarker,
    "l-tooltip": LTooltip,
    "l-popup": LPopup,
    "l-rectangle":LRectangle,
    "l-image-overlay":LImageOverlay
  },
  data() {
    return {
      zoom: 15,
      center: {
        lat: (this.leftTopLat+this.rightDownLat)/2, 
        lng: (this.leftTopLng+this.rightDownLng)/2
      },
      rect:{
        bounds:[[this.leftTopLat,this.leftTopLng],[this.rightDownLat,this.rightDownLng]],
        style: { color: 'red', weight: 2 },
        url: this.mapUrl
      },
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      markers: this.redList.map(conversion).concat(this.blueList.map(conversion)),
      markerObjects: null
    };
  },
  props:{
    leftTopLat:{
      type:Number
    },
    leftTopLng:{
      type:Number
    },
    rightDownLat:{
      type:Number
    },
    rightDownLng:{
      type:Number
    },
    redList:{
      type:Array
    },
    blueList:{
      type:Array
    },
    mapUrl:{
      type:String
    }
  },
  mounted: function() {
    L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.3.4/dist/images/";
    this.$nextTick(() => {
      console.log("markersRef",this.$refs.markersRef)
      this.markerObjects = this.$refs.markersRef.map(ref => ref.mapObject);
    });
  },

  methods: {
    displayTooltip(selectedIndex) {
      for (let markerObject of this.markerObjects) {
        markerObject.closeTooltip();
      }
      this.markerObjects[selectedIndex].toggleTooltip();
    },
  }
};
</script>

<style>
li {
  cursor: pointer;
}
</style>
