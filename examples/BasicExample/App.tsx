import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  useColorScheme,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { adapty, createPaywallView } from 'react-native-adapty';
import type {
  AdaptyProfile,
  AdaptyPaywall,
  AdaptyPurchaseResult,
  AdaptyPaywallProduct,
} from 'react-native-adapty';
import { readCredentials, readPlacementId } from './src/helpers';
import { recipes, Recipe } from './src/recipes';
import { styles } from './src/styles';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<AdaptyProfile | null>(null);
  const [paywall, setPaywall] = useState<AdaptyPaywall | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Initialize Adapty SDK on mount
  useEffect(() => {
    initializeAdapty();
  }, []);

  // Initialize Adapty: activate, load profile, load paywall
  const initializeAdapty = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Step 1: Activate SDK
      await adapty.activate(readCredentials(), {
        __ignoreActivationOnFastRefresh: __DEV__,
      });

      // Step 2: Get user profile
      const userProfile = await adapty.getProfile();
      setProfile(userProfile);

      // Step 3: Load paywall
      const paywallData = await adapty.getPaywall(readPlacementId());
      setPaywall(paywallData);

      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Adapty SDK';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Check if user has premium access
  const isPremiumActive = profile?.accessLevels?.['premium']?.isActive ?? false;

  // Handle recipe click
  const handleRecipeClick = async (recipe: Recipe) => {
    // If recipe is not premium or user has premium access, show details
    const isRecipeFree = !recipe.isPremium;
    if (isRecipeFree || isPremiumActive) {
      setSelectedRecipe(recipe);
      return;
    }

    // Otherwise, show paywall
    await showPaywall();
  };

  // Show paywall using Paywall Builder
  const showPaywall = async () => {
    if (!paywall) {
      setError('Paywall not loaded. Please try again.');
      return;
    }

    if (!paywall.hasViewConfiguration) {
      setError('Paywall does not have Paywall Builder configuration.');
      return;
    }

    try {
      // Create paywall view
      const view = await createPaywallView(paywall);

      // Set up event handlers
      await view.setEventHandlers({
        onPurchaseCompleted: (
          purchaseResult: AdaptyPurchaseResult,
          _product: AdaptyPaywallProduct,
        ) => {
          // Purchase completed successfully
          if (purchaseResult.type === 'success') {
            // Update profile to reflect new access level
            setProfile(purchaseResult.profile);
            // Close paywall by returning true
            return true;
          }
          // Don't close for cancelled or pending purchases
          return false;
        },
      });

      // Present the paywall
      await view.present();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to show paywall';
      setError(errorMessage);
    }
  };

  // Go back from recipe detail view
  const handleBack = () => {
    setSelectedRecipe(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading Adapty SDK...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Detail view for selected recipe
  if (selectedRecipe) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.detailView}>
          <Text style={styles.detailTitle}>{selectedRecipe.title}</Text>
          <Text style={styles.detailDescription}>{selectedRecipe.description}</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Back to Recipes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Main recipe list view
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Adapty Recipes (RN)</Text>
        </View>

        {/* Error display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Premium status bar */}
        <View style={[styles.statusBar, isPremiumActive ? styles.statusPremium : styles.statusFree]}>
          <Text style={styles.statusText}>{isPremiumActive ? '✓ Premium Active' : 'Free Plan'}</Text>
        </View>

        {/* Basic Recipes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Recipes (Free)</Text>
          {recipes
            .filter(recipe => !recipe.isPremium)
            .map(recipe => (
              <TouchableOpacity
                key={recipe.id}
                style={styles.recipeCard}
                onPress={() => handleRecipeClick(recipe)}
              >
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <Text style={styles.recipeDescription}>{recipe.description}</Text>
              </TouchableOpacity>
            ))}
        </View>

        {/* Premium Recipes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium Recipes</Text>
          {recipes
            .filter(recipe => recipe.isPremium)
            .map(recipe => (
              <TouchableOpacity
                key={recipe.id}
                style={[styles.recipeCard, !isPremiumActive && styles.recipeCardLocked]}
                onPress={() => handleRecipeClick(recipe)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {!isPremiumActive && <Text style={styles.lockIcon}>🔒</Text>}
                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                </View>
                <Text style={styles.recipeDescription}>{recipe.description}</Text>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
