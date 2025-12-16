import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { adapty, LogLevel, shouldEnableMock } from 'react-native-adapty';
import type {
  AdaptyProfile,
  AdaptyPaywall,
} from 'react-native-adapty';
import { readCredentials, readPlacementId } from './helpers';
import { recipes, Recipe } from './recipes';
import { styles } from './styles';
import { mockConfig } from './custom-mock-config';
import CustomPurchaseScreen from './CustomPurchaseScreen';
import AdaptyUIScreen from './AdaptyUIScreen';
import AdaptyPaywallComponentScreen from './AdaptyPaywallComponentScreen';

const enableMock = shouldEnableMock();

type UIMode = 'custom' | 'modal' | 'component';

export default function RecipesScreen() {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<AdaptyProfile | null>(null);
  const [paywall, setPaywall] = useState<AdaptyPaywall | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showPurchaseScreen, setShowPurchaseScreen] = useState(false);
  const [showAdaptyUI, setShowAdaptyUI] = useState(false);
  const [showAdaptyComponent, setShowAdaptyComponent] = useState(false);
  const [uiMode, setUiMode] = useState<UIMode>('custom');

  // Initialize Adapty SDK on mount
  useEffect(() => {
    initializeAdapty();
  }, []);

  // Initialize Adapty: activate, load profile, load paywall
  const initializeAdapty = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Step 0: Set log level (NOTE: This is for debugging in example app only. Don't use VERBOSE in production.)
     // await adapty.setLogLevel(LogLevel.VERBOSE);

      // Step 1: Activate SDK with mock mode enabled
      await adapty.activate(readCredentials(), {
        logLevel: LogLevel.VERBOSE,
        __ignoreActivationOnFastRefresh: __DEV__,
        enableMock: enableMock,
        mockConfig: mockConfig,
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

    // Otherwise, show purchase screen
    if (!paywall) {
      setError('Paywall not loaded. Please try again.');
      return;
    }

    // Show purchase screen based on selected UI mode
    if (uiMode === 'modal') {
      setShowAdaptyUI(true);
    } else if (uiMode === 'component') {
      setShowAdaptyComponent(true);
    } else {
      setShowPurchaseScreen(true);
    }
  };

  // Handle successful purchase
  const handlePurchaseSuccess = (updatedProfile: AdaptyProfile) => {
    setProfile(updatedProfile);
    setShowPurchaseScreen(false);
    setShowAdaptyUI(false);
    setShowAdaptyComponent(false);
    setError(null);
  };

  // Close purchase screen
  const handleClosePurchaseScreen = () => {
    setShowPurchaseScreen(false);
  };

  // Close Adapty UI screen
  const handleCloseAdaptyUI = () => {
    setShowAdaptyUI(false);
  };

  // Close Adapty Component screen
  const handleCloseAdaptyComponent = () => {
    setShowAdaptyComponent(false);
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

  // Adapty UI Modal screen
  if (showAdaptyUI && paywall) {
    return (
      <AdaptyUIScreen
        paywall={paywall}
        onSuccess={handlePurchaseSuccess}
        onClose={handleCloseAdaptyUI}
      />
    );
  }

  // Adapty Paywall Component screen
  if (showAdaptyComponent && paywall) {
    return (
      <AdaptyPaywallComponentScreen
        paywall={paywall}
        onSuccess={handlePurchaseSuccess}
        onClose={handleCloseAdaptyComponent}
      />
    );
  }

  // Custom Purchase screen
  if (showPurchaseScreen && paywall) {
    return (
      <CustomPurchaseScreen
        paywall={paywall}
        onSuccess={handlePurchaseSuccess}
        onClose={handleClosePurchaseScreen}
      />
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
          <Text style={styles.headerTitle}>Adapty (Expo go)</Text>
        </View>

        {/* Developer Settings Section */}
        <View style={styles.devSettingsContainer}>
          <View style={styles.devSettingsHeader}>
            <Text style={styles.devSettingsTitle}>⚙️ Developer Settings</Text>
            <Text style={styles.devSettingsSubtitle}>
              Example configuration options
            </Text>
          </View>

          <View style={styles.devSettingsContent}>
            {/* Mock Mode Info */}
            <View style={styles.mockInfo}>
              <Text style={styles.mockInfoText}>
                Mock mode {enableMock ? 'enabled' : 'disabled'}
              </Text>
            </View>

            {/* UI Mode Selector */}
            <View style={styles.devSection}>
              <Text style={styles.devSectionTitle}>Choose UI Mode for paywall</Text>
              <View style={styles.uiModeContainer}>
                <TouchableOpacity
                  style={[
                    styles.uiModeButton,
                    uiMode === 'custom' && styles.uiModeButtonActive,
                  ]}
                  onPress={() => setUiMode('custom')}
                >
                  <Text
                    style={[
                      styles.uiModeButtonText,
                      uiMode === 'custom' && styles.uiModeButtonTextActive,
                    ]}
                  >
                    Custom
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.uiModeButton,
                    uiMode === 'modal' && styles.uiModeButtonActive,
                  ]}
                  onPress={() => setUiMode('modal')}
                >
                  <Text
                    style={[
                      styles.uiModeButtonText,
                      uiMode === 'modal' && styles.uiModeButtonTextActive,
                    ]}
                  >
                    Modal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.uiModeButton,
                    uiMode === 'component' && styles.uiModeButtonActive,
                  ]}
                  onPress={() => setUiMode('component')}
                >
                  <Text
                    style={[
                      styles.uiModeButtonText,
                      uiMode === 'component' && styles.uiModeButtonTextActive,
                    ]}
                  >
                    Component
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.uiModeDescription}>
                {uiMode === 'custom'
                  ? '🎨 Custom purchase screen with manual product loading'
                  : uiMode === 'modal'
                  ? '🪟 Adapty UI as modal popup (createPaywallView)'
                  : '📦 Adapty UI as embedded component (AdaptyPaywallView)'}
              </Text>
            </View>
          </View>
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

