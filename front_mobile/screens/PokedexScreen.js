import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ActivityIndicator, Alert, Modal, Platform, Pressable, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { getPokemonById, toggleFavorite, getPokemonByName } from '../services/api';

const { width, height } = Dimensions.get('window');
const pokedexImageSource = require('../assets/pokedex-bg.png');
const unownImageSource = require('../assets/UnownQuestion.png');
const { width: imgOriginalWidth, height: imgOriginalHeight } = Image.resolveAssetSource(pokedexImageSource);
const imageAspectRatio = imgOriginalWidth / imgOriginalHeight;

// Calculate optimal dimensions that fit within the screen
let POKEDEX_WIDTH = width * 0.95;
let POKEDEX_HEIGHT = POKEDEX_WIDTH / imageAspectRatio;

if (POKEDEX_HEIGHT > height * 0.85) {
    POKEDEX_HEIGHT = height * 0.85;
    POKEDEX_WIDTH = POKEDEX_HEIGHT * imageAspectRatio;
}

export default function PokedexScreen({ navigation }) {
    const [currentId, setCurrentId] = useState(1);
    const [currentPokemon, setCurrentPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [spriteSize, setSpriteSize] = useState({ width: 75, height: 75 });
    const [menuVisible, setMenuVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

    // Increased max height from 75 to 100 as requested
    const MAX_HEIGHT = 100;

    useEffect(() => {
        fetchPokemon(currentId);
    }, [currentId]);

    const handleLogout = async () => {
        setMenuVisible(false);
        try {
            await AsyncStorage.removeItem('user_token');
            navigation.replace('Login');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleMenuPress = () => {
        setMenuVisible(true);
    };

    const navigateToFavorites = () => {
        setMenuVisible(false);
        navigation.navigate('Favorites');
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={handleMenuPress}
                    style={{ marginRight: 15 }}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                    <Ionicons name="ellipsis-vertical" size={24} color="#FFF" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const fetchPokemon = async (id) => {
        setLoading(true);
        try {
            const response = await getPokemonById(id);
            // Assuming response.data contains the pokemon object directly
            setCurrentPokemon(response.data);
        } catch (error) {
            const message = error.response?.data?.message || "Não foi possível carregar o Pokemon.";
            Alert.alert("Erro", message);
            // If error (e.g. 404), maybe go back if it was a next action? 
            // For now just keep ID but show no data or handle gracefully.
            if (id > 1) setCurrentId(prev => prev - 1); // simple rollback if not found/error
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchText.trim()) return;

        setLoading(true);
        const query = searchText.trim().toLowerCase();

        try {
            const response = await getPokemonByName(query);
            setCurrentPokemon(response.data);
            setCurrentId(response.data.id); // Sync ID so Prev/Next works from here
            setSearchText(''); // Optional: clear search on success
        } catch (error) {
            // Not found - Show Unown/Ghost logic
            setCurrentPokemon({
                id: -1, // Invalid ID for controls
                nome: '?????',
                numPokedex: '???',
                sprite: 'UNOWN_FALLBACK', // Special flag
                isFavorite: false
            });
        } finally {
            setLoading(false);
        }
    };

    // Use the isFavorite property directly from the API data
    const isFavorite = currentPokemon?.isFavorite;

    const toggleCurrentFavorite = async () => {
        if (!currentPokemon) return;

        console.log(`[PokedexScreen] Toggling favorite for ID: ${currentPokemon.id}`);
        try {
            const response = await toggleFavorite(currentPokemon.id);
            const { isFavorite: newStatus } = response.data;

            // Update local state instant feedback
            setCurrentPokemon(prev => ({ ...prev, isFavorite: newStatus }));

        } catch (error) {
            console.error("[PokedexScreen] Error toggling favorite", error);
            Alert.alert("Erro", "Não foi possível atualizar favorito.");
        }
    };

    // Calculate sprite size whenever current pokemon flips
    useEffect(() => {
        if (currentPokemon && currentPokemon.sprite) {
            Image.getSize(currentPokemon.sprite, (width, height) => {
                let newWidth = width;
                let newHeight = height;

                if (height > MAX_HEIGHT) {
                    const ratio = MAX_HEIGHT / height;
                    newHeight = MAX_HEIGHT;
                    newWidth = width * ratio;
                }

                setSpriteSize({ width: newWidth, height: newHeight });
            }, (error) => {
                setSpriteSize({ width: MAX_HEIGHT, height: MAX_HEIGHT });
            });
        }
    }, [currentPokemon]);

    const handleNext = () => {
        setCurrentId(prev => prev === 151 ? 1 : prev + 1);
    };

    const handlePrev = () => {
        setCurrentId(prev => prev === 1 ? 151 : prev - 1);
    };

    return (
        <LinearGradient
            colors={['#333335ff', '#232325ff']} // Shadcn-like dark gradient
            style={styles.container}
        >
            {/* Search Input */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar Pokemon..."
                    placeholderTextColor="#a1a1aa"
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            <View style={styles.pokedexContainer}>
                <Image
                    source={require('../assets/pokedex-bg.png')}
                    style={styles.pokedexImage}
                    resizeMode="contain"
                />

                {/* Favorite Button */}
                {currentPokemon && currentPokemon.id !== -1 && (
                    <TouchableOpacity
                        onPress={toggleCurrentFavorite}
                        style={[styles.favoriteButton, { backgroundColor: '#FFF' }]}
                    >
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={28}
                            color="#CC0000"
                            style={{ position: 'absolute' }}
                        />
                    </TouchableOpacity>
                )}

                <View style={styles.screenArea}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#CC0000" />
                    ) : currentPokemon ? (
                        <>
                            {/* Fixed Height Container to stabilize text position */}
                            <View style={{ height: MAX_HEIGHT, justifyContent: 'center', alignItems: 'center', marginBottom: -20 }}>
                                <Image
                                    source={currentPokemon.sprite === 'UNOWN_FALLBACK' ? unownImageSource : { uri: currentPokemon.sprite }}
                                    style={{ width: spriteSize.width, height: spriteSize.height }}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={styles.pokemonName}>{currentPokemon.nome}</Text>
                            <Text style={styles.pokemonNumber}>{currentPokemon.numPokedex}</Text>
                        </>
                    ) : (
                        <Text style={{ marginTop: 20 }}>Erro ao carregar</Text>
                    )}
                </View>

                <View style={styles.controlsContainer}>
                    <Pressable
                        onPress={handlePrev}
                        style={({ pressed }) => [
                            styles.gameButton,
                            loading && styles.disabledButton,
                            pressed && !loading && {
                                borderBottomWidth: 0,
                                transform: [{ translateY: 4 }]
                            }
                        ]}
                        disabled={loading}
                    >
                        <Text style={styles.gameButtonText}>Anterior</Text>
                    </Pressable>
                    <View style={{ width: 10 }} />
                    <Pressable
                        onPress={handleNext}
                        style={({ pressed }) => [
                            styles.gameButton,
                            loading && styles.disabledButton,
                            pressed && !loading && {
                                borderBottomWidth: 0,
                                transform: [{ translateY: 4 }]
                            }
                        ]}
                        disabled={loading}
                    >
                        <Text style={styles.gameButtonText}>Próximo</Text>
                    </Pressable>
                </View>
            </View>

            {/* Dropdown Menu Modal */}
            <Modal
                transparent={true}
                visible={menuVisible}
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setMenuVisible(false)}
                >
                    <View style={styles.dropdownMenu}>
                        <TouchableOpacity style={styles.menuItem} onPress={navigateToFavorites}>
                            <Ionicons name="heart" size={20} color="#CC0000" style={{ marginRight: 10 }} />
                            <Text style={styles.menuText}>Meus Favoritos</Text>
                        </TouchableOpacity>
                        <View style={styles.menuDivider} />
                        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                            <Ionicons name="log-out-outline" size={20} color="#929292ff" style={{ marginRight: 10 }} />
                            <Text style={styles.menuText}>Sair</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50,
    },
    searchContainer: {
        width: POKEDEX_WIDTH,
        marginBottom: 20,
        zIndex: 10,
    },
    searchInput: {
        backgroundColor: '#18181b',
        color: '#FFF',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#27272a',
        textAlign: 'center',
    },
    pokedexContainer: {
        width: POKEDEX_WIDTH,
        height: POKEDEX_HEIGHT,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pokedexImage: {
        width: '100%',
        height: '100%',
    },
    screenArea: {
        position: 'absolute',
        top: '34%',
        left: '12%',
        width: '70%',
        height: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    favoriteButton: {
        position: 'absolute',
        top: '23%',
        right: '18%',
        zIndex: 10,
        backgroundColor: '#FFF',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        borderWidth: 2,
        borderColor: '#CC0000',
    },
    pokemonName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 32,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Monospace for retro feel
    },
    pokemonNumber: {
        fontSize: 14,
        color: '#666',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    controlsContainer: {
        position: 'absolute',
        bottom: '15%',
        flexDirection: 'row',
        width: '75%',
        left: '8%',
        justifyContent: 'center', // Centered controls
    },
    gameButton: {
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 4, // Slightly rounded but mostly blocky
        borderBottomWidth: 4, // 3D effect
        borderBottomColor: '#000',
        minWidth: 80,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    disabledButton: {
        opacity: 0.6,
    },
    gameButtonText: {
        color: '#FFF',
        fontWeight: '900',
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'Courier-Bold' : 'monospace',
        letterSpacing: 1.5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    dropdownMenu: {
        marginTop: 60,
        marginRight: 10,
        backgroundColor: '#18181b', // Dark menu
        borderRadius: 8,
        padding: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        minWidth: 150,
        borderWidth: 1,
        borderColor: '#27272a',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    menuText: {
        fontSize: 16,
        color: '#f4f4f5', // Light text
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#27272a',
        marginHorizontal: 5,
    },
});
