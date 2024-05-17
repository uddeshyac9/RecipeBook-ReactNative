// app/recipe/[id].js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet,ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';




const RecipeDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState(null);
  const API_KEY = '4c81577010ef4ae193e4962f2633c54a';

  const fetchRecipeDetails = async () => {
    try {
      const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  useEffect(() => {
    fetchRecipeDetails();
  }, [id]);

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={{color:'white',textAlign:'center'}}>Loading...</Text>
        <ActivityIndicator/>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
    <Text style={styles.title}>{recipe.title}</Text>
    <Image source={{ uri: recipe.image }} style={styles.image} />
    <Text style={styles.sectionTitle}>Ingredients:</Text>
    {recipe.extendedIngredients.map((ingredient) => (
      <Text key={ingredient.id} style={styles.ingredient}>
        {ingredient.original}
      </Text>
    ))}
    <Text style={styles.sectionTitle}>Instructions:</Text>
    {recipe.analyzedInstructions.length > 0 ? (
      recipe.analyzedInstructions[0].steps.map((step) => (
        <Text key={step.number} style={styles.instruction}>
          {step.number}. {step.step}
        </Text>
      ))
    ) : (
      <Text style={styles.instruction}>{recipe.instructions}</Text>
    )}
  </ScrollView>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  padding: 16,
  
},
title: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 16,
  color:'white'
},
image: {
  width: '100%',
  height: 200,
  borderRadius: 8,
  marginBottom: 16,
  
},
sectionTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginVertical: 8,
  color:'white'
},
ingredient: {
  fontSize: 16,
  marginBottom: 8,
  color:'white'
},
instruction: {
  fontSize: 16,
  marginBottom: 8,
  color:'white',
  marginBottom:25
},
});

export default RecipeDetailsScreen;
