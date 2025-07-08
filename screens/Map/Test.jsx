import React, {use, useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const categories = [
  {label: '병원', type: 'hospital'},
  {label: '주유소', type: 'gas_station'},
  {label: '약국', type: 'pharmacy'},
  {label: '음식점', type: 'restaurant'},
];

const MAP_API_KEY = 'AIzaSyDPWW2AbxAUzAC0hrIXdTtNcbWBkEs3R08';

const Test = () => {
  const [selectedCategory, setSelectedCategory] = useState('hospital');
  const [places, setPlaces] = useState([]);
  const [region, setRegion] = useState({
    latitude: 36.35654,
    longitude: 128.693,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const fetchPlaces = useCallback(async () => {
    const {latitude, longitude} = region;
    const radius = 1500;

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1000&type=${selectedCategory}&language=ko&key=${MAP_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json(); // ⬅️ 이게 필요
      setPlaces(data.results);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  }, [selectedCategory, region]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  const autoCompleteHandler = (data, details = null) => {
    if (!details || !details.geometry) {
      console.warn('details 정보 없음:', details);
      return;
    }

    const {
      geometry: {
        location: {lat, lng},
      },
    } = details;

    setRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>가까운 병원을 찾으시나요?</Text>
      </View>

      <View style={styles.searchBar}>
        <GooglePlacesAutocomplete
          minLength={2}
          placeholder="검색어 입력"
          query={{
            key: MAP_API_KEY,
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
              top: 10,
              left: 10,
              right: 10,
              zIndex: 1,
            },

            // container: {
            //   marginHorizontal: 10,
            //   marginTop: 10,
            //   zIndex: 1,
            // },
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

      {/* 카테고리 버튼 */}
      <View style={{position: 'relative'}}>
        <MapView style={styles.map} region={region}>
          {(places ?? []).map((place, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              }}
              title={place.name}
              description={place.vicinity}
            />
          ))}
        </MapView>

        <View style={styles.categoryContainer}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.type}
              style={[
                styles.categoryButton,
                cat.type === selectedCategory && styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory(cat.type)}>
              <Text
                style={
                  cat.type === selectedCategory
                    ? styles.selectedCategoryText
                    : styles.categoryText
                }>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 장소 정보 리스트 */}
      <FlatList
        style={styles.list}
        data={Array.isArray(places) ? places : []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
            {item.photos && (
              <Image
                source={{
                  uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference=${item.photos[0].photo_reference}&key=${MAP_API_KEY}`,
                }}
                style={styles.image}
              />
            )}
            <View style={{flex: 1}}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.address}>{item.vicinity}</Text>
              <Text style={styles.status}>
                <Text
                  style={
                    item.opening_hours?.open_now
                      ? [styles.status, styles.openText]
                      : [styles.status, styles.closeText]
                  }>
                  {item.opening_hours?.open_now ? '영업 중' : '영업 종료'}
                </Text>
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    height: 80,
    justifyContent: 'center',
  },
  headerText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  categoryContainer: {
    position: 'absolute',
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginHorizontal: 15,
    // backgroundColor: '#fff',
    paddingVertical: 10,
  },
  categoryButton: {
    marginLeft: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 60,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
  },
  selectedCategoryButton: {
    backgroundColor: '#7DCA79',
  },
  categoryText: {
    color: '#333',
  },
  selectedCategoryText: {
    color: 'white',
  },
  map: {
    width: '100%',
    height: 350,
  },
  list: {
    flex: 1,
    backgroundColor: 'white',
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
  },
  status: {
    marginTop: 4,
  },
  openText: {
    color: '#178F11',
    fontWeight: 'bold',
  },
  closeText: {
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default Test;
