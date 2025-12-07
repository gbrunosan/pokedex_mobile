import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { login, register } from '../services/api';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);
        try {
            if (isLogin) {
                const response = await login(email, password);
                const { token } = response.data;
                await AsyncStorage.setItem('user_token', token);
                navigation.replace('Pokedex');
            } else {
                // Register
                await register(email, password);
                // Auto-login after register
                const response = await login(email, password);
                const { token } = response.data;
                await AsyncStorage.setItem('user_token', token);
                navigation.replace('Pokedex');
            }
        } catch (error) {
            const message = error.response?.data || error.message || 'Falha na autenticação';
            Alert.alert('Erro', typeof message === 'string' ? message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#333335ff', '#232325ff']} // Shadcn-like dark gradient
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <View style={styles.card}>
                        <Image
                            source={require('../assets/pokeball-login.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />

                        <Text style={styles.title}>{isLogin ? 'Login Pokedex' : 'Registrar Treinador'}</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Usuário"
                            placeholderTextColor="#a1a1aa"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="default"
                        />

                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Senha"
                                placeholderTextColor="#a1a1aa"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="#a1a1aa" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.buttonText}>{isLogin ? 'Entrar' : 'Cadastrar'}</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchButton}>
                            <Text style={styles.switchText}>
                                <Text style={styles.switchTextGray}>
                                    {isLogin ? 'Não tem uma conta? ' : 'Já tem conta? '}
                                </Text>
                                <Text style={styles.switchTextHighlight}>
                                    {isLogin ? 'Cadastre-se' : 'Faça Login'}
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    card: {
        width: '85%',
        backgroundColor: '#18181b', // Zinc-900 (Shadcn dark card)
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        borderWidth: 1,
        borderColor: '#27272a',
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#f4f4f5', // Zinc-100
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#27272a', // Zinc-800
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#FFF',
        borderWidth: 1,
        borderColor: '#3f3f46',
    },
    passwordContainer: {
        width: '100%',
        height: 50,
        backgroundColor: '#27272a', // Zinc-800
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#3f3f46',
        paddingHorizontal: 15,
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#FFF',
    },
    eyeIcon: {
        marginLeft: 10,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#CC0000',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    switchButton: {
        marginTop: 20,
    },
    switchText: {
        textAlign: 'center',
        fontSize: 14,
    },
    switchTextGray: {
        color: '#b7b7bdff', // Light Gray
    },
    switchTextHighlight: {
        color: '#f87171', // Light Red
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});
