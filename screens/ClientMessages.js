import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ActivityIndicator, Colors } from 'react-native-paper';
import { db } from '../firebase2';

const ClientMessages = () => {
  const [currentUserData, setCurrentUserData] = useState({});
  const [friendsData, setFriendsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  const navigation = useNavigation();

  useEffect(() => {
    const currentUser = auth.currentUser.email;
    const q = query(
      collection(db, 'clients'),
      where('email', '==', currentUser)
    );
    getDocs(q).then((snapshot) => {
      setCurrentUserData(
        snapshot.docs.map((doc) => ({
          name: doc.data().name,
          email: doc.data().email,
          friends: doc.data().friends ? doc.data().friends : [],
          id: doc._key.path.segments[6],
        }))
      );
      if (snapshot.docs[0].data().friends.length) {
        snapshot.docs[0].data().friends.map((friend) => {
          const q2 = query(
            collection(db, 'gardeners'),
            where('email', '==', friend)
          );
          getDocs(q2).then((snapshot) => {
            setFriendsData((currFriends) => [
              snapshot.docs[0].data(),
              ...currFriends,
            ]);
          });
        });
        setLoading(false);
      } else setLoading(false);
    });
  }, []);

  const handleChat = (email) => {
    navigation.navigate('Chat', {
      currentUserData: currentUserData[0],
      gardenerEmail: email,
    });
  };

  if (loading)
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={true} color={Colors.green200} />
      </View>
    );
  else {
    return friendsData.length ? (
      <View style={styles.container}>
        <FlatList
          key={({ item }) => {
            item.id;
          }}
          data={friendsData.map((friend) => {
            return {
              name: friend.name ? friend.name : friend.email,
              id: friend.email,
              companyName: friend.companyName,
            };
          })}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleChat(item.id)}
              style={styles.item}
            >
              <Text style={styles.nameText}>{item.name}</Text>
              <Text style={styles.companyText}>{item.companyName}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    ) : (
      <View style={styles.textcontainer}>
        <Text style={styles.text}>You have no conversations</Text>
      </View>
    );
  }
};

export default ClientMessages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  textcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 60,
    borderBottomColor: 'green',
    borderStyle: 'solid',
    borderBottomWidth: 2,
    backgroundColor: 'white',
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  companyText: {
    color: 'grey',
  },
});
