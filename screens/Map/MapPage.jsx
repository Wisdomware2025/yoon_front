import React, {useRef} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const MapPage = () => {
  const mapRef = useRef();

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 37.541,
          longitude: 126.986,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={styles.map}
      />

      <GooglePlacesAutocomplete
        placeholder="장소를 검색해보세요!"
        minLength={2}
        fetchDetails={true}
        debounce={200}
        currentLocation={false}
        predefinedPlaces={[]}
        enableHighAccuracyLocation={false}
        onPress={(data, details = null) => {
          if (details) {
            const {lat, lng} = details.geometry.location;
            mapRef.current?.animateToRegion({
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }}
        onFail={error => console.log('Google Places API 에러:', error)}
        onNotFound={() => console.log('검색 결과 없음')}
        query={{
          key: 'AIzaSyBZPh0Cj7PYNWtLsrJQasXFu4gxkNVaFls',
          language: 'ko',
          components: 'country:kr',
        }}
        keyboardShouldPersistTaps="handled"
        keepResultsAfterBlur={true}
        enablePoweredByContainer={false}
        nearbyPlacesAPI="GooglePlacesSearch"
        textInputProps={{
          onFocus: () => console.log('검색창에 포커스됨'),
          onBlur: () => console.log('검색창에서 포커스 나감'),
        }}
        styles={{
          container: {
            position: 'absolute',
            top: Platform.OS === 'ios' ? 40 : 10,
            left: 10,
            right: 10,
            zIndex: 1,
          },
          textInput: {
            height: 44,
            borderRadius: 5,
            paddingVertical: 5,
            paddingHorizontal: 10,
            fontSize: 16,
            borderWidth: 1,
            borderColor: '#ddd',
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3,
          },
          listView: {
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 5,
            marginTop: 5,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3,
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: '100%',
    width: '100%',
  },
});

export default MapPage;
