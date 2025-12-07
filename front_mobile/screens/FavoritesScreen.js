import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getFavorites, toggleFavorite } from '../services/api';

export default function FavoritesScreen({ navigation }) {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const response = await getFavorites();
            setFavorites(response.data);
        } catch (error) {
            // Alert.alert('Erro', 'Não foi possível carregar os favoritos.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        try {
            // Optimistic update
            setFavorites(prev => prev.filter(item => item.id !== id));
            await toggleFavorite(id);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível remover.");
            // Revert on error (could implement more robust rollback here)
            loadFavorites();
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemove(item.id)}
            >
                <Text style={styles.removeText}>X</Text>
            </TouchableOpacity>

            <Image
                source={{ uri: item.sprite }}
                style={styles.sprite}
                resizeMode="contain"
            />
            <Text style={styles.name}>{item.nome}</Text>
            <Text style={styles.number}>{item.numPokedex}</Text>
        </View>
    );

    return (
        <LinearGradient
            colors={['#333335ff', '#232325ff']} // Shadcn-like dark gradient
            style={styles.container}
        >
            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#CC0000" />
                </View>
            ) : favorites.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>Você ainda não tem favoritos.</Text>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 10,
        paddingTop: 20, // Added padding top since header is gone
    },
    card: {
        flex: 1,
        backgroundColor: '#18181b', // Zinc-900
        margin: 8,
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        elevation: 5,
        borderWidth: 1,
        borderColor: '#27272a',
    },
    sprite: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f4f4f5', // Zinc-100
        textAlign: 'center',
        marginBottom: 5,
    },
    number: {
        fontSize: 14,
        color: '#a1a1aa', // Zinc-400
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#a1a1aa',
        textAlign: 'center',
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 28,
        height: 28,
        backgroundColor: 'rgba(239, 68, 68, 0.2)', // Red-500 with opacity
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        borderWidth: 1,
        borderColor: '#ef4444',
    },
    removeText: {
        color: '#ef4444',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
