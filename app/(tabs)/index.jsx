import React, { useState, useEffect } from 'react';
import { View, Text,  ScrollView,
  RefreshControl, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import RecipeList from '../../components/RecipeList'

const HomeScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // Error state
  const router = useRouter();
  const API_KEY = "8cf6b4b8bd7e49a8960870bff6b603d5";

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const detailedRecipes = await Promise.all(data.results.map(async (recipe) => {
        const detailResponse = await fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${API_KEY}`);
        const detailData = await detailResponse.json();
        return { ...recipe, summary: detailData.summary };
      }));
      setRecipes(detailedRecipes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Failed to fetch recipes. Please try again later.');  // Set error message
      setLoading(false);
    }
  };

  const onCategoryClick = (id) => {
    router.push({
      pathname: '/RecipeDetails',
      params: {
        id: id
      }
    });
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const stripHtmlTags = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {  // Display error message if an error occurs
    return (
      <ScrollView 
      refreshControl={
        <RefreshControl
        onRefresh={()=>fetchRecipes()}
        refreshing={loading}
        />
      }>
        <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        </View>
        
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      
      <Text style={styles.screenTitle}>Welcome to our Recipe App</Text>
      
      <RecipeList recipes={recipes} onCategoryClick={onCategoryClick} stripHtmlTags={stripHtmlTags} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {  // Styles for error container
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:50
  },
  errorText: {  // Styles for error text
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
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

export default HomeScreen;
