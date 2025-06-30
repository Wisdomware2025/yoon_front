import React, {useRef} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const MapMain = () => {
  const apiKey = 'AIzaSyBZPh0Cj7PYNWtLsrJQasXFu4gxkNVaFls'; // 실제 프로젝트에서는 환경 변수로 분리 권장
  const mapRef = useRef(null); // 지도 ref 설정

  const autoCompleteHandler = (data, details = null) => {
    console.log('선택된 장소:', data);
    if (details && details.geometry?.location) {
      const {lat, lng} = details.geometry.location;
      console.log('위도:', lat, '경도:', lng);

      // 지도 이동
      mapRef.current?.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000, // duration: 1초
      );
    } else {
      console.warn('장소 상세 정보가 없습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef} // ref 연결
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
        minLength={2}
        placeholder="검색어 입력"
        query={{
          key: apiKey,
          language: 'ko',
          components: 'country:kr',
        }}
        fetchDetails={true}
        onPress={autoCompleteHandler}
        textInputProps={{
          onFocus: () => console.log('포커스됨'),
          onBlur: () => console.log('포커스 해제됨'),
        }}
        predefinedPlaces={[]}
        onFail={error => console.error(error)}
        onNotFound={() => console.warn('검색 결과 없음')}
        keyboardShouldPersistTaps="handled"
        keepResultsAfterBlur={true}
        enablePoweredByContainer={false}
        timeout={20000}
        debounce={300}
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

export default MapMain;