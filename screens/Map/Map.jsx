import React from 'react';
import {View} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {styles} from './style';

const Map = () => {
  return (
    <View style={styles.mapContainer}>
      <MapView
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 36.3725,
          longitude: 128.6898,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={styles.map}>
        <Marker
          coordinate={{latitude: 36.3725, longitude: 128.6898}}
          title="영남제일병원"
          description="영남제일병원"
        />
      </MapView>
    </View>
  );
};

export default Map;
