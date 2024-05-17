// app/components/RecipeList.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

const RecipeList = ({ recipes, onCategoryClick, stripHtmlTags }) => {
  return (
    <FlatList
      data={recipes}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => onCategoryClick(item.id)}
          style={styles.recipeItem}
        >
          <Image source={{ uri: item.image }} style={styles.recipeImage} />
          <View style={styles.textContainer}>
            <Text style={styles.recipeName}>{item.title}</Text>
            {item.summary && (
              <Text style={styles.recipeDescription}>{stripHtmlTags(item.summary).slice(0, 100)}...</Text>
            )}
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  recipeItem: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  recipeImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default RecipeList;
