// app/index.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, useRouter } from "expo-router";

const HomeScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const router = useRouter();
  const API_KEY= "ab9d9f079598468c8a0da2fd7f2f5279";

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setRecipes(data.results);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };
  const onCategoryClick =(id)=> {
    router.push({
      pathname:'/RecipeDetails',
      params:{
        id:id
      }
    })
 }  

  useEffect(() => {
    fetchRecipes();
  }, []);

  return recipes && (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Welcome to our Recipe App</Text>
      <FlatList
        data={recipes}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.id}
            onPress={() => onCategoryClick(item.id)}
            style={styles.recipeItem}
          >
            <Text style={styles.recipeName}>{item.title}</Text>
            <Text style={styles.recipeDescription}>{item.summary}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop:30
  },
  screenTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color:'white'
  },
  recipeItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;
