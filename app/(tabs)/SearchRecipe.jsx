import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import RecipeList from '../../components/RecipeList';  // Import the RecipeList component

const API_KEY = "8cf6b4b8bd7e49a8960870bff6b603d5";  // Replace with your actual API key

const SearchRecipeScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const [error, setError] = useState(null); 

  const fetchRecipes = async (query = '') => {
    try {
      setLoading(true);
      let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${query}`;
      const response = await fetch(url);
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
      setLoading(false);
      setError('Failed to fetch recipes. Please try again later.');
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

  const stripHtmlTags = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const handleSearch = () => {
    fetchRecipes(searchQuery);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }


  return (
    <View style={styles.container}>
   
      <Text style={styles.screenTitle}>Search Recipes</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes by name or ingredient"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <RecipeList recipes={recipes} onCategoryClick={onCategoryClick} stripHtmlTags={stripHtmlTags} />  
      )}
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
  screenTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }, loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {  // Styles for error container
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {  // Styles for error text
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default SearchRecipeScreen;
