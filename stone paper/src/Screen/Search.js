import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Sample data - replace with your actual data
  const sampleData = [
    { id: '1', title: 'Mathematics Course', type: 'course', description: 'Advanced mathematics course for engineering students' },
    { id: '2', title: 'Physics Lab Manual', type: 'document', description: 'Complete lab manual for physics practicals' },
    { id: '3', title: 'Chemistry Notes', type: 'document', description: 'Organic chemistry comprehensive notes' },
    { id: '4', title: 'Computer Science', type: 'course', description: 'Introduction to programming and algorithms' },
    { id: '5', title: 'Biology Textbook', type: 'document', description: 'Cell biology and genetics textbook' },
    { id: '6', title: 'Calculus Problems', type: 'assignment', description: 'Differential calculus practice problems' },
    { id: '7', title: 'English Literature', type: 'course', description: 'Shakespeare and modern literature' },
    { id: '8', title: 'History Notes', type: 'document', description: 'World history from ancient to modern times' },
  ];

  const popularSearches = [
    'Mathematics', 'Physics', 'Chemistry', 'Programming', 'Biology', 'History'
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  // Load recent searches from storage (you can use AsyncStorage here)
  useEffect(() => {
    // Mock recent searches - replace with actual AsyncStorage call
    const mockRecentSearches = ['Math', 'Science', 'Programming'];
    setRecentSearches(mockRecentSearches);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.length === 0) {
      setSearchResults([]);
      setShowSuggestions(true);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setShowSuggestions(false);

    // Simulate API call delay
    setTimeout(() => {
      const filteredResults = sampleData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 500);
  };

  const handleQuickSearch = (query) => {
    setSearchQuery(query);
    handleSearch(query);
    Keyboard.dismiss();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSuggestions(true);
    Keyboard.dismiss();
  };

  const addToRecentSearches = (query) => {
    if (!recentSearches.includes(query)) {
      const updatedSearches = [query, ...recentSearches.slice(0, 4)];
      setRecentSearches(updatedSearches);
      // Save to AsyncStorage here
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    // Clear from AsyncStorage here
  };

  const renderSearchItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => {
        addToRecentSearches(item.title);
        // Navigate to item detail or perform action
        console.log('Selected:', item);
      }}
    >
      <View style={styles.resultIcon}>
        <Ionicons 
          name={getItemIcon(item.type)} 
          size={20} 
          color="#007AFF" 
        />
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultDescription}>{item.description}</Text>
        <Text style={styles.resultType}>{item.type.toUpperCase()}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
    </TouchableOpacity>
  );

  const getItemIcon = (type) => {
    switch (type) {
      case 'course': return 'book';
      case 'document': return 'document-text';
      case 'assignment': return 'clipboard';
      default: return 'document';
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={64} color="#C7C7CC" />
      <Text style={styles.emptyStateTitle}>No results found</Text>
      <Text style={styles.emptyStateText}>
        Try searching with different keywords or check your spelling
      </Text>
    </View>
  );

  const renderSuggestions = () => (
    <ScrollView style={styles.suggestionsContainer}>
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <View style={styles.suggestionSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={clearRecentSearches}>
              <Text style={styles.clearButton}>Clear</Text>
            </TouchableOpacity>
          </View>
          {recentSearches.map((search, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => handleQuickSearch(search)}
            >
              <Ionicons name="time-outline" size={20} color="#8E8E93" />
              <Text style={styles.suggestionText}>{search}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Popular Searches */}
      <View style={styles.suggestionSection}>
        <Text style={styles.sectionTitle}>Popular Searches</Text>
        <View style={styles.popularTags}>
          {popularSearches.map((search, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tag}
              onPress={() => handleQuickSearch(search)}
            >
              <Text style={styles.tagText}>{search}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Categories */}
      <View style={styles.suggestionSection}>
        <Text style={styles.sectionTitle}>Browse Categories</Text>
        <View style={styles.categories}>
          {[
            { name: 'Courses', icon: 'book' },
            { name: 'Documents', icon: 'document-text' },
            { name: 'Assignments', icon: 'clipboard' },
            { name: 'Study Materials', icon: 'library' }
          ].map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryItem}
              onPress={() => handleQuickSearch(category.name)}
            >
              <View style={styles.categoryIcon}>
                <Ionicons name={category.icon} size={24} color="#007AFF" />
              </View>
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search courses, documents, assignments..."
              placeholderTextColor="#8E8E93"
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => setShowSuggestions(true)}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch}>
                <Ionicons name="close-circle" size={20} color="#8E8E93" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {isSearching ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="search" size={48} color="#007AFF" />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderSearchItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
            />
          ) : showSuggestions && searchQuery.length === 0 ? (
            renderSuggestions()
          ) : searchQuery.length > 0 ? (
            renderEmptyState()
          ) : null}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#007AFF',
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  resultsList: {
    paddingBottom: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    marginBottom: 8,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  resultType: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  suggestionsContainer: {
    flex: 1,
  },
  suggestionSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  clearButton: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  suggestionText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  popularTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
});