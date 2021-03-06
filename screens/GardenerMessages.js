import React, { useState, useLayoutEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { db } from '../firebase2';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';

const GardenerMessages = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser.email;
  const [currentUserData, setCurrentUserData] = useState({});
  const [friendsData, setFriendsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    try {
      const q = query(
        collection(db, 'gardeners'),
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
              collection(db, 'clients'),
              where('email', '==', friend)
            );
            getDocs(q2).then((snapshot) => {
              setLoading(false);
              setFriendsData((currFriends) => [
                snapshot.docs[0].data(),
                ...currFriends,
              ]);
            });
          });
        } else setLoading(false);
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleChat = (email) => {
    navigation.navigate('Chat', {
      currentUserData: currentUserData[0],
      isGardener: true,
      clientEmail: email,
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
              name: friend.name,
              id: friend.email,
            };
          })}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleChat(item.id)}
              style={styles.item}
            >
              <Text style={styles.nameText}>{item.name}</Text>
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

export default GardenerMessages;

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
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 50,
    borderBottomColor: 'green',
    borderStyle: 'solid',
    borderBottomWidth: 2,
    backgroundColor: 'white',
  },
});
